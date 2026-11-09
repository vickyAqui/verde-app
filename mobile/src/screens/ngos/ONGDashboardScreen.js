import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import {
  BackLink,
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Loading,
  StatusBadge,
  TabBar,
} from '../../components/ui';
import { COLORS, DEN_STATUS, initials, numFmt, ONG_STATUS } from '../../theme';
import { styles } from './ONGDashboardStyle';

const TABS = [
  { key: 'projetos', label: 'Projetos' },
  { key: 'seguidores', label: 'Seguidores' },
  { key: 'denuncias', label: 'Denúncias' },
];

export default function ONGDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { tipo } = useAuth();

  const [tab, setTab] = useState('projetos');
  const [refreshing, setRefreshing] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const dashboard = useFetch(() =>
    api
      .get('/ongs/me/dashboard')
      .then((r) => r.data)
      .catch((e) => {
        if (e?.response?.status === 404) return null;
        throw e;
      }),
  );

  const data = dashboard.data;
  const ong = data?.ong;
  const stats = data?.stats;
  const projetos = data?.projetos ?? [];
  const membros = data?.membros ?? [];
  const denuncias = data?.denuncias ?? [];
  const approved = ong?.statusOng === 'aprovada';

  const refreshAll = async () => {
    setRefreshing(true);
    await dashboard.reload();
    setRefreshing(false);
  };

  const openCreate = () => {
    setCreateError(null);
    setCreateOpen(true);
  };

  const createProjeto = async () => {
    setCreateError(null);

    if (!objetivo.trim() || !descricao.trim()) {
      setCreateError('Preencha o objetivo e a descrição do projeto.');
      return;
    }

    setCreating(true);
    try {
      await api.post('/projetos', {
        objetivo: objetivo.trim(),
        descricao: descricao.trim(),
      });
      setObjetivo('');
      setDescricao('');
      setCreateOpen(false);
      dashboard.reload();
    } catch (e) {
      setCreateError(
        e?.response?.data?.error ||
          e?.message ||
          'Não foi possível criar o projeto.',
      );
    } finally {
      setCreating(false);
    }
  };

  const content = useMemo(() => {
    if (tab === 'projetos') {
      return (
        <View style={styles.list}>
          {approved ? (
            <TouchableOpacity
              style={styles.createBtn}
              onPress={openCreate}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
              <Text style={styles.createBtnText}>Criar projeto</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.lockedNote}>
              <Ionicons
                name="lock-closed-outline"
                size={14}
                color={COLORS.muted}
              />
              <Text style={styles.lockedText}>
                A criação de projetos será liberada após a aprovação da ONG.
              </Text>
            </View>
          )}

          {projetos.length === 0 ? (
            <Card>
              <EmptyState
                icon="leaf-outline"
                title="Nenhum projeto ainda"
                hint={
                  approved
                    ? 'Crie o primeiro projeto da sua ONG e acompanhe o progresso por aqui.'
                    : 'Assim que sua ONG for aprovada, você poderá criar projetos.'
                }
              />
            </Card>
          ) : (
            projetos.map((projeto) => {
              const pct = Math.round(projeto.percentualConclusao ?? 0);

              return (
                <Card key={projeto.idProjeto} style={styles.projectCard}>
                  <View style={styles.projectTop}>
                    <View style={styles.projectHead}>
                      <View style={styles.projectIcon}>
                        <Ionicons
                          name="leaf-outline"
                          size={18}
                          color={COLORS.primary}
                        />
                      </View>
                      <View style={styles.projectHeadText}>
                        <Text style={styles.projectTitle} numberOfLines={2}>
                          {projeto.objetivo}
                        </Text>
                        <Text style={styles.projectSub} numberOfLines={1}>
                          {ong?.nome}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.projectPct}>{pct}%</Text>
                  </View>

                  {!!projeto.descricao && (
                    <Text style={styles.projectDescription}>
                      {projeto.descricao}
                    </Text>
                  )}

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(100, pct)}%` },
                      ]}
                    />
                  </View>
                </Card>
              );
            })
          )}
        </View>
      );
    }

    if (tab === 'seguidores') {
      if (membros.length === 0) {
        return (
          <Card>
            <EmptyState
              icon="people-outline"
              title="Nenhum seguidor ainda"
              hint="Quando alguém seguir sua ONG, a pessoa aparece aqui."
            />
          </Card>
        );
      }

      return (
        <View style={styles.list}>
          {membros.map((membro) => {
            const nome = membro.usuario?.nome ?? 'Seguidor';

            return (
              <Card key={membro.idOng_Usuario} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {initials(nome)}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {nome}
                  </Text>
                  <Text style={styles.memberEmail} numberOfLines={1}>
                    {membro.usuario?.email ?? '—'}
                  </Text>
                </View>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={COLORS.primary}
                />
              </Card>
            );
          })}
        </View>
      );
    }

    if (denuncias.length === 0) {
      return (
        <Card>
          <EmptyState
            icon="warning-outline"
            title="Nenhuma denúncia registrada"
            hint="Denúncias feitas pela conta da ONG aparecem aqui."
          />
        </Card>
      );
    }

    return (
      <View style={styles.list}>
        {denuncias.map((denuncia) => (
          <Card key={denuncia.idDenuncia} style={styles.denCard}>
            <View style={styles.denInfo}>
              <Text style={styles.denTitle} numberOfLines={1}>
                {denuncia.titulo}
              </Text>
              <View style={styles.denSubRow}>
                <Ionicons
                  name="location"
                  size={11}
                  color={COLORS.primary}
                />
                <Text style={styles.denSub} numberOfLines={1}>
                  {denuncia.area?.rua ||
                    denuncia.area?.bairro ||
                    'Cidade Tiradentes'}{' '}
                  · {denuncia.dataDenuncia}
                </Text>
              </View>
            </View>
            <StatusBadge status={denuncia.statusDenuncia} map={DEN_STATUS} />
          </Card>
        ))}
      </View>
    );
  }, [
    tab,
    approved,
    projetos,
    membros,
    denuncias,
    ong?.nome,
  ]);

  // ── Sem ONG ────────────────────────────────────────────────────────────
  if (!dashboard.loading && !dashboard.error && !data) {
    return (
      <View style={styles.root}>
        <View
          style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
        >
          <BackLink onPress={() => navigation.goBack()} label="Voltar" />
          <Text style={styles.eyebrow}>Área da organização</Text>
          <Text style={styles.title}>Painel da ONG</Text>
        </View>

        <View style={styles.emptyWrap}>
          <Card>
            <EmptyState
              icon="business-outline"
              title="Você ainda não cadastrou uma ONG"
              hint="Cadastre sua organização para acompanhar projetos, seguidores e denúncias em um painel próprio."
              action={
                tipo === 'comum' ? (
                  <Button
                    label="Cadastrar minha ONG"
                    icon="add"
                    onPress={() => navigation.navigate('CreateONGsScreen')}
                    style={{ marginTop: 12 }}
                  />
                ) : null
              }
            />
          </Card>
        </View>
      </View>
    );
  }

  if (dashboard.loading && !data) {
    return (
      <View style={styles.root}>
        <View
          style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
        >
          <BackLink onPress={() => navigation.goBack()} label="Voltar" />
          <Text style={styles.eyebrow}>Área da organização</Text>
          <Text style={styles.title}>Painel da ONG</Text>
        </View>
        <Loading label="Carregando painel da ONG…" />
      </View>
    );
  }

  if (dashboard.error) {
    return (
      <View style={styles.root}>
        <View
          style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
        >
          <BackLink onPress={() => navigation.goBack()} label="Voltar" />
          <Text style={styles.eyebrow}>Área da organização</Text>
          <Text style={styles.title}>Painel da ONG</Text>
        </View>
        <ErrorNote message={dashboard.error} onRetry={dashboard.reload} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0C3322', '#0E4C33', '#166B44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cover, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      >
        <View style={styles.coverTop}>
          <BackLink
            onPress={() => navigation.goBack()}
            label="Voltar"
            color="rgba(255,255,255,0.75)"
          />
          <Text style={styles.coverEyebrow}>+Verde · Painel da ONG</Text>
        </View>

        <View style={styles.coverRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(ong?.nome ?? '?')}</Text>
          </View>

          <View style={styles.coverInfo}>
            <Text style={styles.ongName} numberOfLines={1}>
              {ong?.nome}
            </Text>
            <View style={styles.regionRow}>
              <Ionicons name="location" size={11} color={COLORS.onSecondary} />
              <Text style={styles.regionText} numberOfLines={1}>
                {ong?.regiao || 'Cidade Tiradentes'}
              </Text>
            </View>
          </View>

          <StatusBadge status={ong?.statusOng} map={ONG_STATUS} />
        </View>
      </LinearGradient>

      <View style={styles.statsWrap}>
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            {[
              { label: 'Projetos', value: numFmt(stats?.totalProjetos) },
              { label: 'Seguidores', value: numFmt(stats?.totalMembros) },
              { label: 'Denúncias', value: numFmt(stats?.totalDenuncias) },
              { label: 'Em aberto', value: numFmt(stats?.denunciasAbertas) },
            ].map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {projetos.length > 0 && (
            <View style={styles.progressWrap}>
              <View style={styles.progressHead}>
                <Text style={styles.progressLabel}>
                  Progresso médio dos projetos
                </Text>
                <Text style={styles.progressPct}>
                  {stats?.percentualMedio ?? 0}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, stats?.percentualMedio ?? 0)}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </Card>
      </View>

      {ong?.statusOng === 'pendente' && (
        <View style={styles.pendingBox}>
          <Ionicons name="time-outline" size={16} color={COLORS.warning} />
          <Text style={styles.pendingText}>
            Sua ONG está em análise. Você já pode acompanhar este painel; a
            criação de projetos e o destaque na lista de ONGs são liberados após
            a aprovação.
          </Text>
        </View>
      )}

      <TabBar
        tabs={TABS}
        value={tab}
        onChange={setTab}
        style={styles.tabs}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            colors={[COLORS.primary]}
          />
        }
      >
        {content}
      </ScrollView>

      <Modal
        visible={createOpen}
        transparent
        animationType="slide"
        onRequestClose={() => !creating && setCreateOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => !creating && setCreateOpen(false)}
          />

          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Novo projeto</Text>
              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setCreateOpen(false)}
                disabled={creating}
                hitSlop={8}
              >
                <Ionicons name="close" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Objetivo</Text>
            <TextInput
              style={styles.input}
              value={objetivo}
              onChangeText={setObjetivo}
              placeholder="Ex.: Plantar 50 árvores na região"
              placeholderTextColor={COLORS.faint}
              maxLength={50}
            />

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
              Descrição
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva os detalhes do projeto..."
              placeholderTextColor={COLORS.faint}
              maxLength={100}
              multiline
              textAlignVertical="top"
            />

            {!!createError && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="warning"
                  size={15}
                  color={COLORS.error}
                  style={{ marginTop: 1 }}
                />
                <Text style={styles.errorText}>{createError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.sheetSubmit,
                (creating || !objetivo.trim() || !descricao.trim()) &&
                  styles.sheetSubmitDisabled,
              ]}
              onPress={createProjeto}
              disabled={creating || !objetivo.trim() || !descricao.trim()}
              activeOpacity={0.85}
            >
              {creating ? (
                <ActivityIndicator size="small" color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.sheetSubmitText}>Criar projeto</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
