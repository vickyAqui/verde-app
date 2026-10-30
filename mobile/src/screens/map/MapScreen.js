import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { getCurrentCoords } from '../../utils/location';
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Loading,
  SearchField,
  StatusBadge,
} from '../../components/ui';
import {
  AREA_STATUS,
  COLORS,
  DEN_STATUS,
  areaColor,
  fmtAreaM2,
  fmtDist,
  haversineM,
  numFmt,
  parsePoligono,
  raioOf,
} from '../../theme';
import { styles } from './MapStyle';
import MapCanvas from './MapCanvas';

const AREA_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'identificada', label: 'Déficit' },
  { key: 'em tratamento', label: 'Em tratamento' },
  { key: 'reflorestada', label: 'Reflorestadas' },
];

const DEN_FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'aberta', label: 'Abertas' },
  { key: 'em tratamento', label: 'Em tratamento' },
  { key: 'resolvido', label: 'Resolvidas' },
];

const DEN_COLOR = '#C9731D';

function toCoord(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function MapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  const [tab, setTab] = useState('areas');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const [fitSignal, setFitSignal] = useState(0);

  const areas = useFetch(() =>
    api.get('/areas').then((r) => r.data.areas ?? []),
  );
  const denuncias = useFetch(() =>
    api.get('/denuncias').then((r) => r.data.denuncias ?? []),
  );

  const areaList = areas.data ?? [];
  const denList = denuncias.data ?? [];
  const loading = areas.loading || denuncias.loading;
  const error = areas.error || denuncias.error;

  const denCountByArea = useMemo(() => {
    const map = new Map();
    for (const d of denList) {
      map.set(d.idArea, (map.get(d.idArea) ?? 0) + 1);
    }
    return map;
  }, [denList]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (tab === 'areas') {
      return areaList
        .filter((a) => (filter === 'all' ? true : a.statusArea === filter))
        .filter(
          (a) =>
            !q ||
            (a.rua || '').toLowerCase().includes(q) ||
            (a.bairro || '').toLowerCase().includes(q) ||
            (a.cidade || '').toLowerCase().includes(q),
        )
        .map((a) => ({
          key: `a-${a.idArea}`,
          kind: 'area',
          id: a.idArea,
          title: a.rua || 'Área sem nome',
          sub: `${a.bairro || 'Cidade Tiradentes'} · ${a.cidade || 'São Paulo'}`,
          status: a.statusArea,
          color: areaColor(a.statusArea),
          lat: toCoord(a.latitude),
          lng: toCoord(a.longitude),
          raio: typeof a.raio === 'number' ? a.raio : null,
          poligono: parsePoligono(a.poligono),
          denunciasCount: denCountByArea.get(a.idArea) ?? 0,
        }));
    }

    return denList
      .filter((d) =>
        filter === 'all' ? true : d.statusDenuncia === filter,
      )
      .filter(
        (d) =>
          !q ||
          (d.titulo || '').toLowerCase().includes(q) ||
          (d.area?.rua || '').toLowerCase().includes(q),
      )
      .map((d) => ({
        key: `d-${d.idDenuncia}`,
        kind: 'denuncia',
        id: d.idDenuncia,
        title: d.titulo,
        sub: `${d.area?.rua || d.area?.bairro || 'Cidade Tiradentes'} · ${d.dataDenuncia}`,
        status: d.statusDenuncia,
        color: DEN_COLOR,
        lat: toCoord(d.area?.latitude),
        lng: toCoord(d.area?.longitude),
        raio: typeof d.area?.raio === 'number' ? d.area.raio : null,
        poligono: parsePoligono(d.area?.poligono),
      }));
  }, [tab, filter, query, areaList, denList, denCountByArea]);

  const sortedRows = useMemo(() => {
    const list = [...rows];
    if (userPos) {
      list.sort((a, b) => {
        const da =
          a.lat !== null && a.lng !== null
            ? haversineM(userPos.lat, userPos.lng, a.lat, a.lng)
            : Infinity;
        const db =
          b.lat !== null && b.lng !== null
            ? haversineM(userPos.lat, userPos.lng, b.lat, b.lng)
            : Infinity;
        return da - db;
      });
    }
    return list;
  }, [rows, userPos]);

  const markers = useMemo(
    () => sortedRows.filter((r) => r.lat !== null && r.lng !== null),
    [sortedRows],
  );

  const selectedRow = useMemo(
    () => sortedRows.find((r) => r.key === selected) ?? null,
    [sortedRows, selected],
  );

  const unmapped = sortedRows.length - markers.length;

  const changeTab = (next) => {
    setTab(next);
    setFilter('all');
    setQuery('');
    setSelected(null);
  };

  const locate = useCallback(async () => {
    setLocError(null);
    setLocating(true);
    try {
      const coords = await getCurrentCoords();
      setUserPos({ lat: coords.latitude, lng: coords.longitude });
      setFitSignal((s) => s + 1);
    } catch (e) {
      setUserPos(null);
      setLocError(e?.message || 'Não foi possível obter sua localização.');
    } finally {
      setLocating(false);
    }
  }, []);

  const fitAll = () => {
    if (markers.length === 0) return;
    setFitSignal((s) => s + 1);
  };

  const goToReport = () => {
    if (!selectedRow) return;
    if (selectedRow.kind === 'area') {
      navigation.navigate('Denunciar', { address: selectedRow.title });
    } else {
      navigation.navigate('Denunciar', { denunciaId: selectedRow.id });
    }
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 12) + 8 },
        ]}
      >
        <Text style={styles.eyebrow}>Cidade Tiradentes · zona leste</Text>
        <Text style={styles.title}>Mapa Ambiental</Text>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={
            tab === 'areas' ? 'Buscar rua ou bairro…' : 'Buscar denúncia…'
          }
        />
      </View>

      <View style={styles.filterArea}>
        <View style={styles.layers}>
          {[
            ['areas', `${numFmt(areaList.length)} áreas`],
            ['denuncias', `${numFmt(denList.length)} denúncias`],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.layerBtn, tab === key && styles.layerActive]}
              onPress={() => changeTab(key)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.layerText,
                  tab === key && styles.layerTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {(tab === 'areas' ? AREA_FILTERS : DEN_FILTERS).map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, filter === f.key && styles.chipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === f.key && styles.chipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapWrap}>
        <MapCanvas
          rows={markers}
          selectedKey={selected}
          onSelect={setSelected}
          userPos={userPos}
          mapRef={mapRef}
          fitSignal={fitSignal}
        />

        <View style={styles.ctrlColumn}>
          <TouchableOpacity
            style={styles.ctrlBtn}
            onPress={locate}
            disabled={locating}
            activeOpacity={0.85}
          >
            <Ionicons
              name="navigate"
              size={18}
              color={locating ? COLORS.faint : COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctrlBtn, markers.length === 0 && { opacity: 0.5 }]}
            onPress={fitAll}
            disabled={markers.length === 0}
            activeOpacity={0.85}
          >
            <Ionicons name="expand" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {userPos && (
          <View style={styles.userPill}>
            <View style={styles.userDot} />
            <Text style={styles.userPillText}>Você está aqui</Text>
          </View>
        )}

        <View style={styles.legend} pointerEvents="none">
          <Text style={styles.legendTitle}>Demarcação</Text>
          <LegendItem color={areaColor('identificada')} label="Déficit" />
          <LegendItem
            color={areaColor('em tratamento')}
            label="Em tratamento"
          />
          <LegendItem color={areaColor('reflorestada')} label="Reflorestada" />
        </View>

        <View style={styles.countPill} pointerEvents="none">
          <Text style={styles.countPillText}>
            {numFmt(markers.length)} demarcada
            {markers.length === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      {!!locError && (
        <View style={[styles.banner, styles.bannerError]}>
          <Ionicons
            name="warning"
            size={13}
            color={COLORS.error}
          />
          <Text style={[styles.bannerText, { color: COLORS.error }]}>
            {locError}
          </Text>
        </View>
      )}

      {unmapped > 0 && !loading && (
        <View style={[styles.banner, styles.bannerWarn]}>
          <Ionicons name="location" size={13} color={COLORS.warning} />
          <Text style={[styles.bannerText, { color: COLORS.warning }]}>
            {numFmt(unmapped)} registro
            {unmapped === 1 ? '' : 's'} sem coordenadas —{' '}
            {tab === 'areas'
              ? 'edite a área informando latitude/longitude.'
              : 'a área da denúncia ainda não foi geocodificada.'}
          </Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && areaList.length === 0 && denList.length === 0 ? (
          <Loading label="Carregando…" />
        ) : error ? (
          <ErrorNote
            message={error}
            onRetry={() => {
              areas.reload();
              denuncias.reload();
            }}
          />
        ) : sortedRows.length === 0 ? (
          <EmptyState title="Nada por aqui" hint="Ajuste a busca ou os filtros." />
        ) : (
          <>
            <Text style={styles.listLabel}>
              {userPos ? 'Mais próximas de você' : 'Áreas e denúncias'}
              {userPos ? (
                <Text style={styles.listLabelHint}>
                  {'  '}· ordenado por distância
                </Text>
              ) : null}
            </Text>

            <View style={styles.rowList}>
              {sortedRows.map((r) => {
                const active = selected === r.key;
                const noGeo = r.lat === null || r.lng === null;
                const dist =
                  userPos && r.lat !== null && r.lng !== null
                    ? haversineM(userPos.lat, userPos.lng, r.lat, r.lng)
                    : null;

                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.row, active && styles.rowActive]}
                    onPress={() => setSelected(active ? null : r.key)}
                    activeOpacity={0.85}
                  >
                    <View
                      style={[
                        styles.rowDot,
                        { backgroundColor: r.color, opacity: noGeo ? 0.35 : 1 },
                      ]}
                    />
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {r.title}
                      </Text>
                      <Text style={styles.rowSub} numberOfLines={1}>
                        {r.sub}
                        {r.kind === 'area' && !noGeo ? (
                          <Text>
                            {' '}·{' '}
                            {r.poligono
                              ? 'polígono'
                              : fmtAreaM2(raioOf(r.status, r.raio))}
                          </Text>
                        ) : null}
                        {noGeo ? <Text> · sem mapa</Text> : null}
                        {dist !== null ? (
                          <Text style={styles.rowSubStrong}>
                            {' '}· {fmtDist(dist)}
                          </Text>
                        ) : null}
                      </Text>
                    </View>
                    <StatusBadge
                      status={r.status}
                      map={r.kind === 'area' ? AREA_STATUS : DEN_STATUS}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedRow && (
              <Card style={styles.selectedCard}>
                <Text style={styles.selectedLabel}>
                  {selectedRow.kind === 'area'
                    ? 'Área selecionada'
                    : 'Denúncia selecionada'}
                </Text>
                <Text style={styles.selectedTitle}>{selectedRow.title}</Text>
                <Text style={styles.selectedText}>
                  {selectedRow.sub}
                  {selectedRow.kind === 'area' &&
                    selectedRow.lat !== null &&
                    ` · cobertura ${
                      selectedRow.poligono
                        ? 'em polígono irregular'
                        : fmtAreaM2(
                            raioOf(selectedRow.status, selectedRow.raio),
                          )
                    }`}
                  {selectedRow.kind === 'area' &&
                    (selectedRow.denunciasCount ?? 0) > 0 &&
                    ` · ${numFmt(selectedRow.denunciasCount)} denúncia${
                      (selectedRow.denunciasCount ?? 0) === 1 ? '' : 's'
                    }`}
                </Text>
                {selectedRow.kind === 'area' &&
                  selectedRow.status === 'identificada' && (
                    <Text style={styles.selectedText}>
                      Esta área ainda não tem árvores. Sua denúncia ajuda a ONG
                      a priorizar o local.
                    </Text>
                  )}
                <Button
                  label={
                    selectedRow.kind === 'area'
                      ? 'Denunciar esta área'
                      : 'Ver minha denúncia'
                  }
                  onPress={goToReport}
                  style={styles.selectedAction}
                />
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}
