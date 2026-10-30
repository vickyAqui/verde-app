import React, { useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import api from '../../api';
import { useFetch } from '../../hooks/useFetch';
import {
  BackLink,
  Button,
  Card,
  ErrorNote,
  Loading,
  SectionLabel,
  StatusBadge,
} from '../../components/ui';
import { COLORS, DEN_STATUS, ONG_STATUS, numFmt } from '../../theme';
import { styles } from './AdminStyle';

const DEN_ADMIN = {
  aberta: { label: 'Aberta', color: COLORS.error },
  'em tratamento': { label: 'Em tratamento', color: COLORS.warning },
  resolvida: { label: 'Resolvida', color: COLORS.success },
  resolvido: { label: 'Resolvida', color: COLORS.success },
};

const AREA_ADMIN = {
  identificada: { label: 'Identificada', color: COLORS.error },
  'em tratamento': { label: 'Em tratamento', color: COLORS.warning },
  reflorestada: { label: 'Reflorestada', color: COLORS.success },
};

const TABS = [
  { key: 'denuncias', label: 'Denúncias' },
  { key: 'ongs', label: 'ONGs pendentes' },
  { key: 'areas', label: 'Áreas' },
  { key: 'visao', label: 'Visão geral' },
];

const DEN_DOT = {
  aberta: COLORS.error,
  'em tratamento': COLORS.warning,
};

function denDotColor(status) {
  return DEN_DOT[status] ?? COLORS.success;
}

export default function AdminScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState('denuncias');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOngId, setSelectedOngId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dashboard = useFetch(() =>
    api.get('/admin/dashboard').then((r) => r.stats ?? null),
  );
  const denuncias = useFetch(() =>
    api.get('/admin/denuncias').then((r) => r.denuncias ?? []),
  );
  const areas = useFetch(() =>
    api.get('/admin/areas').then((r) => r.areas ?? []),
  );
  const ongs = useFetch(() => api.get('/admin/ongs').then((r) => r.ongs ?? []));
  const projetos = useFetch(() =>
    api.get('/admin/projetos').then((r) => r.projetos ?? []),
  );

  const pendingOngs = useMemo(
    () =>
      (ongs.data ?? []).filter(
        (o) => (o.statusOng || 'pendente').toLowerCase() === 'pendente',
      ),
    [ongs.data],
  );

  const deficitAreas = useMemo(
    () => (areas.data ?? []).filter((a) => a.statusArea !== 'reflorestada'),
    [areas.data],
  );

  const selected = useMemo(
    () =>
      (denuncias.data ?? []).find((d) => d.idDenuncia === selectedId) ?? null,
    [denuncias.data, selectedId],
  );

  const selectedOng = useMemo(
    () => pendingOngs.find((o) => o.idOng === selectedOngId) ?? null,
    [pendingOngs, selectedOngId],
  );

  const reloadMain = () => {
    denuncias.reload();
    areas.reload();
    ongs.reload();
    projetos.reload();
    dashboard.reload();
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      denuncias.reload(),
      areas.reload(),
      ongs.reload(),
      projetos.reload(),
      dashboard.reload(),
    ]);
    setRefreshing(false);
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/denuncias/${id}`, { statusDenuncia: status });
      setSelectedId(null);
      denuncias.reload();
      dashboard.reload();
    } catch (e) {
      Alert.alert(
        'Erro',
        e?.response?.data?.error || 'Não foi possível atualizar.',
      );
    } finally {
      setUpdating(false);
    }
  };

  const updateOngStatus = async (id, action) => {
    setUpdating(true);
    try {
      if (action === 'approve') {
        await api.put(`/admin/ong/${id}/approve`);
      } else {
        await api.del(`/admin/ong/${id}/approve`);
      }
      setSelectedOngId(null);
      ongs.reload();
      dashboard.reload();
    } catch (e) {
      Alert.alert(
        'Erro',
        e?.response?.data?.error || 'Não foi possível atualizar.',
      );
    } finally {
      setUpdating(false);
    }
  };

  const ongName = (ong) => ong.usuario?.nome || ong.nome || 'ONG';

  const currentLoading =
    tab === 'denuncias'
      ? denuncias.loading
      : tab === 'ongs'
        ? ongs.loading
        : tab === 'areas'
          ? areas.loading
          : dashboard.loading;

  const currentError =
    tab === 'denuncias'
      ? denuncias.error
      : tab === 'ongs'
        ? ongs.error
        : tab === 'areas'
          ? areas.error
          : dashboard.error;

  return (
    <View style={styles.root}>
      {/* Cabeçalho */}
      <LinearGradient
        colors={['#0C3322', '#0E4C33', '#166B44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cover, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      >
        <View style={styles.coverRow}>
          <BackLink
            onPress={() => navigation.goBack()}
            label="App"
            color="rgba(255,255,255,0.75)"
          />

          <View style={styles.coverTitleWrap}>
            <Text style={styles.coverEyebrow}>+Verde · Painel da ONG</Text>
            <Text style={styles.coverTitle}>Dashboard</Text>
          </View>
        </View>

        {dashboard.loading ? (
          <View style={styles.statsSkeleton} />
        ) : dashboard.data ? (
          <View style={styles.statsRow}>
            {[
              {
                v: dashboard.data.denunciasAbertas,
                l: 'Abertas',
                c: '#F3B27A',
              },
              {
                v: dashboard.data.totalDenuncias,
                l: 'Denúncias',
                c: '#B8E6C9',
              },
              { v: dashboard.data.totalONGs, l: 'ONGs', c: '#F7D9A0' },
            ].map((s) => (
              <View key={s.l} style={styles.statCard}>
                <Text style={[styles.statValue, { color: s.c }]}>
                  {numFmt(s.v)}
                </Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </LinearGradient>

      {/* Abas */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => {
              setTab(t.key);
              setSelectedId(null);
              setSelectedOngId(null);
            }}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.tabText, tab === t.key && styles.tabTextActive]}
              numberOfLines={1}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            colors={[COLORS.primary]}
          />
        }
      >
        {currentError ? (
          <ErrorNote message={currentError} onRetry={reloadMain} />
        ) : currentLoading ? (
          <Loading label="Carregando…" />
        ) : tab === 'denuncias' ? (
          selected ? (
            <View style={styles.detail}>
              <BackLink onPress={() => setSelectedId(null)} />

              <Card style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <View style={styles.detailTitleWrap}>
                    <Text style={styles.detailTitle}>{selected.titulo}</Text>
                    <View style={styles.metaRow}>
                      <Ionicons
                        name="location"
                        size={11}
                        color={COLORS.primary}
                      />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {selected.area?.rua ||
                          selected.area?.bairro ||
                          'Cidade Tiradentes'}
                      </Text>
                    </View>
                    <Text style={styles.metaText}>
                      {selected.usuario?.nome} · {selected.dataDenuncia}
                    </Text>
                  </View>
                  <StatusBadge
                    status={selected.statusDenuncia}
                    map={DEN_ADMIN}
                  />
                </View>

                {!!selected.descricao && (
                  <View style={styles.descBox}>
                    <Text style={styles.descText}>{selected.descricao}</Text>
                  </View>
                )}

                <View style={styles.actions}>
                  <Button
                    label="Marcar em tratamento"
                    icon="time-outline"
                    variant="warning"
                    onPress={() =>
                      updateStatus(selected.idDenuncia, 'em tratamento')
                    }
                    disabled={
                      updating ||
                      selected.statusDenuncia === 'em tratamento'
                    }
                  />
                  <Button
                    label="Marcar resolvida"
                    icon="checkmark-circle-outline"
                    variant="success"
                    onPress={() =>
                      updateStatus(selected.idDenuncia, 'resolvida')
                    }
                    disabled={
                      updating ||
                      selected.statusDenuncia === 'resolvida' ||
                      selected.statusDenuncia === 'resolvido'
                    }
                  />
                </View>
              </Card>
            </View>
          ) : (
            <View style={styles.list}>
              <SectionLabel style={styles.countLabel}>
                {numFmt(denuncias.data?.length)} denúncias registradas
              </SectionLabel>

              {(denuncias.data ?? []).map((d) => (
                <TouchableOpacity
                  key={d.idDenuncia}
                  onPress={() => setSelectedId(d.idDenuncia)}
                  activeOpacity={0.85}
                >
                  <Card style={styles.rowCard}>
                    <View
                      style={[
                        styles.rowDot,
                        { backgroundColor: denDotColor(d.statusDenuncia) },
                      ]}
                    />
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {d.titulo}
                      </Text>
                      <Text style={styles.rowSub} numberOfLines={1}>
                        {d.usuario?.nome} ·{' '}
                        {d.area?.rua || d.area?.bairro || '—'} ·{' '}
                        {d.dataDenuncia}
                      </Text>
                    </View>
                    <StatusBadge status={d.statusDenuncia} map={DEN_ADMIN} />
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : tab === 'ongs' ? (
          selectedOng ? (
            <View style={styles.detail}>
              <BackLink onPress={() => setSelectedOngId(null)} />

              <Card style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <View style={styles.detailTitleWrap}>
                    <Text style={styles.detailTitle}>
                      {selectedOng.usuario?.nome ||
                        selectedOng.nome ||
                        'ONG'}
                    </Text>
                    <Text style={styles.metaText}>
                      {selectedOng.regiao || 'Região não informada'}
                    </Text>
                    {!!selectedOng.cnpj && (
                      <Text style={styles.metaText}>
                        CNPJ: {selectedOng.cnpj}
                      </Text>
                    )}
                    {!!selectedOng.telefone && (
                      <Text style={styles.metaText}>
                        Telefone: {selectedOng.telefone}
                      </Text>
                    )}
                  </View>
                  <StatusBadge
                    status={selectedOng.statusOng}
                    map={ONG_STATUS}
                  />
                </View>

                {!!selectedOng.descricao && (
                  <View style={styles.descBox}>
                    <Text style={styles.descText}>
                      {selectedOng.descricao}
                    </Text>
                  </View>
                )}

                <View style={styles.actions}>
                  <Button
                    label="Aprovar ONG"
                    icon="checkmark-circle-outline"
                    variant="success"
                    onPress={() =>
                      updateOngStatus(selectedOng.idOng, 'approve')
                    }
                    disabled={updating}
                  />
                  <Button
                    label="Rejeitar ONG"
                    icon="close-circle-outline"
                    variant="error"
                    onPress={() =>
                      updateOngStatus(selectedOng.idOng, 'reject')
                    }
                    disabled={updating}
                  />
                </View>
              </Card>
            </View>
          ) : (
            <View style={styles.list}>
              <SectionLabel style={styles.countLabel}>
                {numFmt(pendingOngs.length)} ONGs aguardando aprovação
              </SectionLabel>

              {pendingOngs.map((ong) => (
                <TouchableOpacity
                  key={ong.idOng}
                  onPress={() => setSelectedOngId(ong.idOng)}
                  activeOpacity={0.85}
                >
                  <Card style={styles.rowCard}>
                    <View style={styles.rowIcon}>
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {ongName(ong)}
                      </Text>
                      <Text style={styles.rowSub} numberOfLines={1}>
                        {ong.regiao || 'Região não informada'}
                      </Text>
                    </View>
                    <StatusBadge status={ong.statusOng} map={ONG_STATUS} />
                  </Card>
                </TouchableOpacity>
              ))}

              {pendingOngs.length === 0 && (
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Nenhuma ONG pendente.</Text>
                </Card>
              )}
            </View>
          )
        ) : tab === 'areas' ? (
          <View style={styles.list}>
            <SectionLabel style={styles.countLabel}>
              {numFmt(areas.data?.length)} áreas mapeadas
            </SectionLabel>

            {(areas.data ?? []).map((area) => (
              <Card key={area.idArea} style={styles.rowCard}>
                <View style={styles.rowIcon}>
                  <Ionicons
                    name="leaf-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {area.rua || area.bairro || area.cidade}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="location"
                      size={11}
                      color={COLORS.primary}
                    />
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {area.bairro || area.cidade || 'Cidade Tiradentes'}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={area.statusArea} map={AREA_ADMIN} />
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.overview}>
            {!!dashboard.data && (
              <View style={styles.statsGrid}>
                {[
                  {
                    l: 'Usuários',
                    v: dashboard.data.totalUsuarios,
                    icon: 'people-outline',
                    color: COLORS.info,
                    bg: COLORS.infoSoft,
                  },
                  {
                    l: 'Áreas',
                    v: dashboard.data.totalAreas,
                    icon: 'leaf-outline',
                    color: COLORS.primary,
                    bg: COLORS.primarySoft,
                  },
                  {
                    l: 'Denúncias',
                    v: dashboard.data.totalDenuncias,
                    icon: 'alert-triangle-outline',
                    color: COLORS.error,
                    bg: COLORS.errorSoft,
                  },
                  {
                    l: 'Projetos',
                    v: dashboard.data.totalProjetos,
                    icon: 'sprout-outline',
                    color: COLORS.success,
                    bg: COLORS.successSoft,
                  },
                ].map((s) => (
                  <View
                    key={s.l}
                    style={[styles.overviewStat, { backgroundColor: s.bg }]}
                  >
                    <Ionicons name={s.icon} size={17} color={s.color} />
                    <View>
                      <Text style={styles.overviewValue}>{numFmt(s.v)}</Text>
                      <Text style={styles.overviewLabel}>{s.l}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Card style={styles.overviewCard}>
              <Text style={styles.overviewTitle}>
                Áreas com déficit de arborização
              </Text>
              <Text style={styles.overviewSub}>
                {numFmt(deficitAreas.length)} áreas ainda precisam de
                intervenção
              </Text>

              <View style={styles.overviewList}>
                {deficitAreas.slice(0, 5).map((area, index) => (
                  <View
                    key={area.idArea}
                    style={[
                      styles.inlineRow,
                      index > 0 && styles.inlineRowBorder,
                    ]}
                  >
                    <Text style={styles.inlineText} numberOfLines={1}>
                      {area.rua || area.bairro || area.cidade}
                    </Text>
                    <StatusBadge
                      status={area.statusArea}
                      map={AREA_ADMIN}
                    />
                  </View>
                ))}
                {deficitAreas.length === 0 && (
                  <Text style={styles.emptyText}>
                    Nenhuma área com déficit.
                  </Text>
                )}
              </View>
            </Card>

            <Card style={styles.overviewCard}>
              <Text style={styles.overviewTitle}>
                ONGs cadastradas · {numFmt(ongs.data?.length)}
              </Text>

              <View style={styles.overviewList}>
                {(ongs.data ?? []).map((ong, index) => (
                  <View
                    key={ong.idOng}
                    style={[
                      styles.inlineRow,
                      index > 0 && styles.inlineRowBorder,
                    ]}
                  >
                    <Text style={styles.inlineText} numberOfLines={1}>
                      {ongName(ong)} —{' '}
                      {ong.regiao || 'Cidade Tiradentes'}
                    </Text>
                    <StatusBadge status={ong.statusOng} map={ONG_STATUS} />
                  </View>
                ))}
                {(ongs.data ?? []).length === 0 && (
                  <Text style={styles.emptyText}>
                    Nenhuma ONG cadastrada.
                  </Text>
                )}
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
