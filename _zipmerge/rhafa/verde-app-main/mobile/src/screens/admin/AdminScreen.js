import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ScrollView, RefreshControl,
  Alert, ActivityIndicator, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api';
import { AppHeader, LoadingView, ErrorView, EmptyView, StatusBadge } from '../../components/ui';
import { COLORS, AREA_LABELS, areaColor, DEN_LABELS, denColor, numFmt } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './AdminStyle.js';

const DEN_STATUS = {
  aberta: { label: 'Aberta', color: COLORS.error },
  'em tratamento': { label: 'Em tratamento', color: COLORS.warning },
  resolvida: { label: 'Resolvida', color: COLORS.success },
};

const ONG_STATUS = {
  pendente: { label: 'Pendente', color: COLORS.warning },
  aprovada: { label: 'Aprovada', color: COLORS.success },
  rejeitada: { label: 'Rejeitada', color: COLORS.error },
};

const AREA_STATUS = {
  identificada: { label: 'Déficit', color: COLORS.error },
  'em tratamento': { label: 'Em tratamento', color: COLORS.warning },
  reflorestada: { label: 'Reflorestada', color: COLORS.success },
};

export default function AdminScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [tab, setTab] = useState('denuncias');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOngId, setSelectedOngId] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [stats, setStats] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ongs, setOngs] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const [dRes, aRes, oRes, pRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/denuncias'),
        api.get('/admin/areas'),
        api.get('/admin/ongs'),
        api.get('/admin/projetos'),
      ]);
      setStats(dRes.data.stats ?? null);
      setDenuncias(dRes.data.denuncias ?? []);
      setAreas(aRes.data.areas ?? []);
      setOngs(oRes.data.ongs ?? []);
      setProjetos(pRes.data.projetos ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const pendingOngs = useMemo(
    () => ongs.filter((o) => (o.statusOng || 'pendente').toLowerCase() === 'pendente'),
    [ongs],
  );

  const deficitAreas = useMemo(
    () => areas.filter((a) => a.statusArea !== 'reflorestada'),
    [areas],
  );

  const selected = useMemo(
    () => denuncias.find((d) => d.idDenuncia === selectedId) ?? null,
    [denuncias, selectedId],
  );

  const selectedOng = useMemo(
    () => pendingOngs.find((o) => o.idOng === selectedOngId) ?? null,
    [pendingOngs, selectedOngId],
  );

  const handleUpdateDenuncia = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/denuncias/${id}`, { statusDenuncia: status });
      setSelectedId(null);
      load();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Não foi possível atualizar.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateOng = async (id, action) => {
    setUpdating(true);
    try {
      if (action === 'approve') {
        await api.put(`/admin/ong/${id}/approve`);
      } else {
        await api.del(`/admin/ong/${id}/approve`);
      }
      setSelectedOngId(null);
      load();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Não foi possível atualizar.');
    } finally {
      setUpdating(false);
    }
  };

  const formatUserName = (ong) => {
    return (ong.usuario?.nome || ong.nome || 'ONG');
  };

  if (loading) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <LoadingView label="Carregando painel…" />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
        }
      >
        {/* ── Cover ── */}
        <View style={styles.cover}>
          <LinearGradient
            colors={['#0C3322', '#0E4C33', '#166B44']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.coverContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <Ionicons name="arrow-back-outline" size={18} color="#FFFFFF" />
              <Text style={styles.backText}>App</Text>
            </TouchableOpacity>
            <View style={styles.coverTitle}>
              <Text style={styles.coverEyebrow}>+Verde · Painel da ONG</Text>
              <Text style={styles.coverTitleText}>Dashboard</Text>
            </View>
          </View>
        </View>

        {/* ── Stats dashboard ── */}
        {stats && (
          <View style={styles.statsRow}>
            {[
              { v: stats.denunciasAbertas, l: 'Abertas', c: '#F3B27A' },
              { v: stats.totalDenuncias, l: 'Denúncias', c: '#B8E6C9' },
              { v: stats.totalONGs, l: 'ONGs', c: '#F7D9A0' },
            ].map((stat) => (
              <View key={stat.l} style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
                <Text style={[styles.statValue, { color: stat.c }]}>{numFmt(stat.v)}</Text>
                <Text style={styles.statLabel}>{stat.l}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Abas ── */}
        <View style={styles.tabBar}>
          {[
            ['denuncias', 'Denúncias'],
            ['ongs', 'ONGs pendentes'],
            ['areas', 'Áreas'],
            ['visao', 'Visão geral'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, tab === key && styles.tabActive]}
              onPress={() => { setTab(key); setSelectedId(null); setSelectedOngId(null); }}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && !loading && (
          <ErrorView message={error} onRetry={() => { setRefreshing(true); load(); }} />
        )}

        {/* ── Conteúdo por aba ── */}
        {tab === 'denuncias' ? (
          selected ? (
            <View style={styles.detailBlock}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedId(null)} hitSlop={8}>
                <Ionicons name="arrow-back-outline" size={16} color={COLORS.muted} />
                <Text style={styles.backText}>Voltar</Text>
              </TouchableOpacity>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{selected.titulo}</Text>
                  <View style={[styles.badgeWrap, { backgroundColor: DEN_STATUS[selected.statusDenuncia]?.color }]}>
                    <Text style={styles.badgeText}>{DEN_STATUS[selected.statusDenuncia]?.label}</Text>
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>
                    {selected.usuario?.nome || '—'} · {selected.dataDenuncia || '—'}
                  </Text>
                </View>
                {selected.descricao && (
                  <View style={styles.descBlock}>
                    <Text style={styles.descText}>{selected.descricao}</Text>
                  </View>
                )}
                <View style={styles.actions}>
                  {selected.statusDenuncia !== 'em tratamento' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.warning }]}
                      onPress={() => handleUpdateDenuncia(selected.idDenuncia, 'em tratamento')}
                      disabled={updating}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="clock-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Marcar em tratamento</Text>
                    </TouchableOpacity>
                  )}
                  {selected.statusDenuncia !== 'resolvida' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                      onPress={() => handleUpdateDenuncia(selected.idDenuncia, 'resolvida')}
                      disabled={updating}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Marcar resolvida</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <FlatList
              data={denuncias}
              keyExtractor={(item) => String(item.idDenuncia)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.denunciaRow}
                  onPress={() => setSelectedId(item.idDenuncia)}
                  activeOpacity={0.85}
                >
                  <View style={styles.denunciaInfo}>
                    <Text style={styles.denunciaTitle}>{item.titulo}</Text>
                    <Text style={styles.denunciaSub}>
                      {item.usuario?.nome || '—'} · {item.area?.rua || item.area?.bairro || '—'} · {item.dataDenuncia || '—'}
                    </Text>
                  </View>
                  <View style={[styles.badgeWrap, { backgroundColor: DEN_STATUS[item.statusDenuncia]?.color }]}>
                    <Text style={styles.badgeText}>{DEN_STATUS[item.statusDenuncia]?.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <EmptyView icon="alert-circle-outline" title="Nenhuma denúncia" hint="Não há denúncias registradas." />
              }
            />
          )
        ) : tab === 'ongs' ? (
          selectedOng ? (
            <View style={styles.detailBlock}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedOngId(null)} hitSlop={8}>
                <Ionicons name="arrow-back-outline" size={16} color={COLORS.muted} />
                <Text style={styles.backText}>Voltar</Text>
              </TouchableOpacity>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{formatUserName(selectedOng)}</Text>
                  <View style={[styles.badgeWrap, { backgroundColor: ONG_STATUS[selectedOng.statusOng]?.color }]}>
                    <Text style={styles.badgeText}>{ONG_STATUS[selectedOng.statusOng]?.label}</Text>
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  {selectedOng.regiao && <Text style={styles.metaText}>{selectedOng.regiao}</Text>}
                  {selectedOng.cnpj && <Text style={styles.metaText}>CNPJ: {selectedOng.cnpj}</Text>}
                  {selectedOng.telefone && <Text style={styles.metaText}>Telefone: {selectedOng.telefone}</Text>}
                </View>
                {selectedOng.descricao && (
                  <View style={styles.descBlock}>
                    <Text style={styles.descText}>{selectedOng.descricao}</Text>
                  </View>
                )}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                    onPress={() => handleUpdateOng(selectedOng.idOng, 'approve')}
                    disabled={updating}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Aprovar ONG</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.error }]}
                    onPress={() => handleUpdateOng(selectedOng.idOng, 'reject')}
                    disabled={updating}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="close-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Rejeitar ONG</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <FlatList
              data={pendingOngs}
              keyExtractor={(item) => String(item.idOng)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ongRow}
                  onPress={() => setSelectedOngId(item.idOng)}
                  activeOpacity={0.85}
                >
                  <View style={styles.ongInfo}>
                    <Text style={styles.ongTitle}>{formatUserName(item)}</Text>
                    <Text style={styles.ongSub}>{item.regiao || 'Região não informada'}</Text>
                  </View>
                  <View style={[styles.badgeWrap, { backgroundColor: ONG_STATUS[item.statusOng]?.color }]}>
                    <Text style={styles.badgeText}>{ONG_STATUS[item.statusOng]?.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <EmptyView icon="people-outline" title="Nenhuma ONG pendente" hint="Não há ONGs aguardando aprovação." />
              }
            />
          )
        ) : tab === 'areas' ? (
          <FlatList
            data={areas}
            keyExtractor={(item) => String(item.idArea)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.areaRow} activeOpacity={0.85}>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaTitle}>{item.rua || item.bairro || item.cidade || 'Área'}</Text>
                  <Text style={styles.areaSub}>{item.bairro || item.cidade || 'Cidade Tiradentes'}</Text>
                </View>
                <View style={[styles.badgeWrap, { backgroundColor: AREA_STATUS[item.statusArea]?.color }]}>
                  <Text style={styles.badgeText}>{AREA_STATUS[item.statusArea]?.label}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyView icon="leaf-outline" title="Nenhuma área" hint="Não há áreas mapeadas." />
            }
          />
        ) : (
          // Visão geral
          <View style={styles.overviewBlock}>
            <View style={styles.statsGrid}>
              {[
                { l: 'Usuários', v: stats?.totalUsuarios, c: COLORS.info },
                { l: 'Áreas', v: stats?.totalAreas, c: COLORS.primary },
                { l: 'Denúncias', v: stats?.totalDenuncias, c: COLORS.error },
                { l: 'Projetos', v: stats?.totalProjetos, c: COLORS.success },
              ].map((stat) => (
                <View key={stat.l} style={[styles.statOverview, { borderColor: stat.c }]}>
                  <Text style={[styles.statLabel, { color: stat.c }]}>{stat.l}</Text>
                  <Text style={styles.statValue}>{numFmt(stat.v)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Áreas com déficit de arborização</Text>
              <Text style={styles.sectionSub}>{numFmt(deficitAreas.length)} áreas ainda precisam de intervenção</Text>
              <View style={styles.listContent}>
                {deficitAreas.slice(0, 5).map((area, index) => (
                  <View key={area.idArea} style={styles.deficitRow}>
                    <Text style={styles.deficitTitle}>{area.rua || area.bairro || area.cidade || 'Área'}</Text>
                    <View style={[styles.badgeWrap, { backgroundColor: AREA_STATUS[area.statusArea]?.color }]}>
                      <Text style={styles.badgeText}>{AREA_STATUS[area.statusArea]?.label}</Text>
                    </View>
                  </View>
                ))}
                {deficitAreas.length === 0 && (
                  <Text style={styles.emptyHint}>Nenhuma área com déficit.</Text>
                )}
              </View>
            </View>
            <View style={styles.card} style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>ONGs cadastradas</Text>
              <Text style={styles.sectionSub}>{numFmt(ongs.length)} organizações</Text>
              <View style={styles.listContent}>
                {ongs.map((ong, index) => (
                  <View key={ong.idOng} style={styles.ongListRow}>
                    <Text style={styles.ongListTitle}>{formatUserName(ong)} — {ong.regiao || 'Cidade Tiradentes'}</Text>
                    <View style={[styles.badgeWrap, { backgroundColor: ONG_STATUS[ong.statusOng]?.color }]}>
                      <Text style={styles.badgeText}>{ONG_STATUS[ong.statusOng]?.label}</Text>
                    </View>
                  </View>
                ))}
                {ongs.length === 0 && (
                  <Text style={styles.emptyHint}>Nenhuma ONG cadastrada.</Text>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


