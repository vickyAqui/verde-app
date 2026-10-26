import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, ScrollView,
  TextInput, RefreshControl, Platform,
} from 'react-native';
import MapView, { Marker, Circle, Polygon, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../api';
import {
  COLORS, CT_CENTER, areaColor, AREA_LABELS, AREA_COLORS,
  raioOf, parsePoligono, fmtAreaM2, denColor, DEN_LABELS,
} from '../../theme';
import { LoadingView, ErrorView, EmptyView, StatusBadge } from '../../components/ui';
import { styles } from './MapStyle.js';

const TABS = [
  { key: 'areas', label: 'Áreas', count: (areas) => areas.length },
  { key: 'denuncias', label: 'Denúncias', count: (_areas, denuncias) => denuncias.length },
];

const AREA_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'identificada', label: 'Déficit' },
  { key: 'em tratamento', label: 'Em trat.' },
  { key: 'reflorestada', label: 'Reflor.' },
];

const DEN_FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'aberta', label: 'Abertas' },
  { key: 'em tratamento', label: 'Em trat.' },
  { key: 'resolvido', label: 'Resolvidas' },
];

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function fmtDist(m) {
  if (m === null) return '';
  if (m < 1000) return `a ${Math.round(m)} m`;
  return `a ${(m / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
}

export default function MapScreen({ navigation }) {
  const route = useRoute();
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

  const [areas, setAreas] = useState([]);
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const [a, d] = await Promise.all([api.get('/areas'), api.get('/denuncias')]);
      setAreas(a.data.areas ?? []);
      setDenuncias(d.data.denuncias ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Deep-link do mapa/home: { areaId } ou { denunciaId }
  useEffect(() => {
    const id = route.params?.areaId;
    const denId = route.params?.denunciaId;
    if (id && areas.length > 0) {
      const found = areas.find((a) => a.idArea === id);
      if (found?.latitude != null && found?.longitude != null) {
        setTab('areas');
        setSelected({ kind: 'area', ref: found });
        mapRef.current?.animateToRegion(
          { latitude: found.latitude, longitude: found.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 },
          600,
        );
      }
      navigation.setParams({ areaId: undefined });
    } else if (denId && denuncias.length > 0) {
      const found = denuncias.find((d) => d.idDenuncia === denId);
      const area = found?.area;
      if (area?.latitude != null && area?.longitude != null) {
        setTab('denuncias');
        setSelected({ kind: 'denuncia', ref: found, area });
        mapRef.current?.animateToRegion(
          { latitude: area.latitude, longitude: area.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 },
          600,
        );
      }
      navigation.setParams({ denunciaId: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.areaId, route.params?.denunciaId, areas, denuncias, navigation]);

  const locate = useCallback(async () => {
    setLocError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocError('Permita o acesso à localização para ver o que está perto.');
        setLocating(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setUserPos(coords);
      mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 600);
    } catch {
      setLocError('Não foi possível obter sua localização.');
    } finally {
      setLocating(false);
    }
  }, []);

  const buildRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = tab === 'areas' ? areas : denuncias;
    const f = filter || 'all';

    if (tab === 'areas') {
      return base
        .filter((a) => (f === 'all' ? true : a.statusArea === f))
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
          ref: a,
          title: a.rua || 'Área sem nome',
          sub: `${a.bairro || 'Cidade Tiradentes'} · ${a.cidade || 'São Paulo'}`,
          status: a.statusArea,
          lat: a.latitude,
          lng: a.longitude,
          raio: typeof a.raio === 'number' ? a.raio : null,
          poligono: parsePoligono(a.poligono),
        }));
    }

    return base
      .filter((d) => (f === 'all' ? true : d.statusDenuncia === f))
      .filter(
        (d) =>
          !q ||
          (d.titulo || '').toLowerCase().includes(q) ||
          ((d.area && d.area.rua) || '').toLowerCase().includes(q),
      )
      .map((d) => {
        const area = d.area || {};
        return {
          key: `d-${d.idDenuncia}`,
          kind: 'denuncia',
          id: d.idDenuncia,
          ref: d,
          area,
          title: d.titulo || 'Denúncia',
          sub: `${area.rua || area.bairro || 'Cidade Tiradentes'} · ${d.dataDenuncia || ''}`,
          status: d.statusDenuncia,
          lat: area.latitude,
          lng: area.longitude,
          raio: typeof area.raio === 'number' ? area.raio : null,
          poligono: parsePoligono(area.poligono),
        };
      });
  }, [tab, filter, query, areas, denuncias]);

  const denCountByArea = useMemo(() => {
    const m = new Map();
    for (const d of denuncias) m.set(d.idArea, (m.get(d.idArea) ?? 0) + 1);
    return m;
  }, [denuncias]);

  const sortedRows = useMemo(() => {
    const list = [...buildRows];
    if (userPos) {
      list.sort((a, b) => {
        const da = a.lat != null && a.lng != null ? haversineM(userPos.latitude, userPos.longitude, a.lat, a.lng) : Infinity;
        const db = b.lat != null && b.lng != null ? haversineM(userPos.latitude, userPos.longitude, b.lat, b.lng) : Infinity;
        return da - db;
      });
    }
    return list;
  }, [buildRows, userPos]);

  const markers = sortedRows.filter((r) => r.lat != null && r.lng != null);
  const unmapped = sortedRows.length - markers.length;

  const filtersForTab = tab === 'areas' ? AREA_FILTERS : DEN_FILTERS;

  const changeTab = (t) => {
    setTab(t);
    setFilter('all');
    setQuery('');
    setSelected(null);
  };

  const changeFilter = (f) => {
    setFilter(f);
    setSelected(null);
  };

  const selArea = selected?.kind === 'area' ? selected.ref : null;
  const selDenuncia = selected?.kind === 'denuncia' ? selected.ref : null;
  const selAreaForDenuncia = selected?.kind === 'denuncia' ? selected.area : null;

  const fitAll = () => {
    if (markers.length === 0) return;
    mapRef.current?.fitToCoordinates(
      markers.map((r) => ({ latitude: r.lat, longitude: r.lng })),
      { edgePadding: { top: 60, right: 60, bottom: 120, left: 60 }, animated: true },
    );
  };

  const statusColor = (status, kind) =>
    kind === 'area' ? (AREA_COLORS[status] ?? '#6B7280') : (denColor(status) ?? '#6B7280');

  const statusLabel = (status, kind) =>
    kind === 'area' ? (AREA_LABELS[status] ?? status) : (DEN_LABELS[status] ?? status);

  if (loading) {
    return (
      <View style={styles.root}>
        <LoadingView label="Carregando mapa…" />
      </View>
    );
  }

  if (error && sortedRows.length === 0) {
    return (
      <View style={styles.root}>
        <ErrorView message={error} onRetry={() => { setRefreshing(true); load(); }} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Cabeçalho ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 10 }]}>
        <View style={styles.headerText}>
          <Text style={styles.headerEyebrow}>Cidade Tiradentes · zona leste</Text>
          <Text style={styles.headerTitle}>Mapa Ambiental</Text>
        </View>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={COLORS.muted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={tab === 'areas' ? 'Buscar rua ou bairro…' : 'Buscar denúncia…'}
            placeholderTextColor={COLORS.faint}
          />
        </View>
      </View>

      {/* ── Camada + filtros ── */}
      <View style={styles.layerBar}>
        <View style={styles.layerToggle}>
          {TABS.map((t) => {
            let count = 0;
            if (t.key === 'areas') count = areas.length;
            else count = denuncias.length;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.layerTab, tab === t.key && styles.layerTabActive]}
                onPress={() => changeTab(t.key)}
                activeOpacity={0.85}
              >
                <Text style={[styles.layerTabText, tab === t.key && styles.layerTabTextActive]}>
                  {t.label} {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          {filtersForTab.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, filter === f.key && styles.chipActive]}
              onPress={() => changeFilter(f.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Mapa ── */}
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{ ...CT_CENTER, latitudeDelta: 0.09, longitudeDelta: 0.09 }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {markers.map((r) => {
            const isArea = r.kind === 'area';
            const color = statusColor(r.status, r.kind);
            const poly = r.poligono;
            const raio = raioOf(r.status, r.raio);
            const isSel = selected?.key === r.key;
            const strokeWidth = isSel ? 3 : 2;
            return (
              <React.Fragment key={r.key}>
                {poly ? (
                  <Polygon
                    coordinates={poly}
                    strokeColor={color}
                    strokeWidth={strokeWidth}
                    fillColor={`${color}55`}
                    onPress={() => setSelected(r)}
                  />
                ) : (
                  <Circle
                    center={{ latitude: r.lat, longitude: r.lng }}
                    radius={raio}
                    strokeColor={color}
                    strokeWidth={strokeWidth}
                    fillColor={`${color}44`}
                    lineDashPattern={isArea && r.status === 'reflorestada' ? undefined : [6, 4]}
                    onPress={() => setSelected(r)}
                  />
                )}
                <Marker
                  coordinate={{ latitude: r.lat, longitude: r.lng }}
                  onPress={() => setSelected(r)}
                >
                  <View style={[styles.pin, { backgroundColor: color, borderWidth: isSel ? 4 : 3 }]}>
                    <Ionicons name={isArea ? 'leaf' : 'alert-triangle'} size={12} color="#fff" />
                  </View>
                </Marker>
              </React.Fragment>
            );
          })}

          {userPos && (
            <>
              <Circle
                center={userPos}
                radius={1800}
                strokeColor="#2563EB"
                strokeWidth={1.5}
                fillColor="#2563EB14"
              />
              <Marker coordinate={userPos}>
                <View style={styles.userPin} />
              </Marker>
            </>
          )}
        </MapView>

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.sideBtn} onPress={locate} disabled={locating}>
            {locating ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="locate" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideBtn} onPress={fitAll} disabled={markers.length === 0}>
            <Ionicons name="expand" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {userPos && (
          <View style={styles.userPill}>
            <View style={styles.userPillDot} />
            <Text style={styles.userPillText}>Você está aqui</Text>
          </View>
        )}

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: statusColor('identificada', 'area') }]} />
            <Text style={styles.legendText}>Déficit</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: statusColor('em tratamento', 'area') }]} />
            <Text style={styles.legendText}>Em trat.</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: statusColor('reflorestada', 'area') }]} />
            <Text style={styles.legendText}>Reflor.</Text>
          </View>
          <Text style={styles.legendCount}>{markers.length} demarcada{markers.length === 1 ? '' : 's'}</Text>
        </View>

        {locError && (
          <View style={styles.locError}>
            <Ionicons name="warning-outline" size={14} color={COLORS.error} />
            <Text style={styles.locErrorText}>{locError}</Text>
          </View>
        )}

        {unmapped > 0 && !loading && !locError && (
          <View style={styles.unmapped}>
            <Ionicons name="map-pin-outline" size={14} color={COLORS.warning} />
            <Text style={styles.unmappedText}>
              {numFmt(unmapped)} registro{unmapped === 1 ? '' : 's'} sem coordenadas
            </Text>
          </View>
        )}
      </View>

      {/* ── Lista (mais próximas) ── */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {userPos ? 'Mais próximas de você' : 'Áreas e denúncias'}
          </Text>
          {unmapped > 0 && (
            <TouchableOpacity style={styles.mapLink} onPress={() => setFilter('all')}>
              <Text style={styles.mapLinkText}>Ver no mapa</Text>
            </TouchableOpacity>
          )}
        </View>

        {sortedRows.length === 0 ? (
          <EmptyView
            icon="map-outline"
            title="Nada por aqui"
            hint="Ajuste a busca ou os filtros."
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
            }
          >
            {sortedRows.map((r) => {
              const dist =
                userPos && r.lat != null && r.lng != null
                  ? haversineM(userPos.latitude, userPos.longitude, r.lat, r.lng)
                  : null;
              const active = selected?.key === r.key;
              const noGeo = r.lat == null || r.lng == null;
              return (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.row,
                    active && styles.rowActive,
                  ]}
                  onPress={() => setSelected(active ? null : r)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.dot, { backgroundColor: statusColor(r.status, r.kind), opacity: noGeo ? 0.35 : 1 }]} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowTitle} numberOfLines={1}>{r.title}</Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {r.sub}
                      {!noGeo && (
                        <>
                          {' · '}
                          {r.poligono ? 'polígono' : fmtAreaM2(raioOf(r.status, r.raio))}
                        </>
                      )}
                      {noGeo && <Text style={styles.rowSubMuted}> · sem mapa</Text>}
                      {dist != null && <Text style={styles.rowDist}> · {fmtDist(dist)}</Text>}
                    </Text>
                  </View>
                  <StatusBadge
                    color={statusColor(r.status, r.kind)}
                    label={statusLabel(r.status, r.kind)}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── Cartão do selecionado ── */}
      {selected && (
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={[styles.sheetDot, { backgroundColor: statusColor(selected.status, selected.kind) }]} />
            <View style={styles.sheetInfo}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                {selected.kind === 'area' ? 'Área selecionada' : 'Denúncia selecionada'}
              </Text>
              <Text style={styles.sheetSub} numberOfLines={1}>
                {selected.title}
                {selected.kind === 'area' && selected.lat != null && (
                  <>
                    {' · '}
                    {selected.ref.poligono ? 'polígono irregular' : fmtAreaM2(raioOf(selected.status, selected.raio))}
                  </>
                )}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelected(null)} hitSlop={12}>
              <Ionicons name="close" size={20} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          {selected.kind === 'area' && (denCountByArea.get(selected.id) ?? 0) > 0 && (
            <Text style={styles.sheetMeta}>
              {numFmt(denCountByArea.get(selected.id))} denúncia{denCountByArea.get(selected.id) === 1 ? '' : 's'} registrada(s)
            </Text>
          )}

          <TouchableOpacity
            style={styles.sheetBtn}
            onPress={() => {
              if (selected.kind === 'area') {
                navigation.navigate('Denunciar', { areaId: selected.id });
              } else {
                navigation.navigate('Denunciar', { denunciaId: selected.id });
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.sheetBtnText}>
              {selected.kind === 'area' ? 'Denunciar esta área' : 'Ver minha denúncia'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function numFmt(n) {
  try { return (n ?? 0).toLocaleString('pt-BR'); } catch { return String(n ?? 0); }
}
