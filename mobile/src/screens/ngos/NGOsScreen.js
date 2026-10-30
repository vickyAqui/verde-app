import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
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

import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import {
  Card,
  EmptyState,
  ErrorNote,
  Loading,
  SectionLabel,
  TabBar,
} from '../../components/ui';
import { COLORS, initials, numFmt } from '../../theme';
import { styles } from './NGOsStyle';

const TABS = [
  { key: 'ongs', label: 'ONGs' },
  { key: 'projetos', label: 'Projetos' },
];

export default function NGOsScreen() {
  const insets = useSafeAreaInsets();
  const { tipo } = useAuth();

  const [tab, setTab] = useState('ongs');
  const [expanded, setExpanded] = useState(null);
  const [following, setFollowing] = useState(new Set());
  const [updatingFollow, setUpdatingFollow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const ongs = useFetch(() =>
    api.get('/ongs?statusOng=aprovada').then((r) => r.ongs ?? []),
  );
  const projetos = useFetch(() =>
    api.get('/projetos').then((r) => r.projetos ?? []),
  );
  const followedOngs = useFetch(() =>
    api.get('/ongs/following').then((r) => r.ongs ?? []),
  );

  useEffect(() => {
    setFollowing(new Set((followedOngs.data ?? []).map((o) => o.idOng)));
  }, [followedOngs.data]);

  const isOng = tipo === 'ong';

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([ongs.reload(), projetos.reload(), followedOngs.reload()]);
    setRefreshing(false);
  };

  const toggleFollow = async (id) => {
    const isFollowing = following.has(id);
    setUpdatingFollow(id);

    try {
      if (isFollowing) {
        await api.del(`/ongs/${id}/follow`);
        setFollowing((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });
      } else {
        await api.post(`/ongs/${id}/follow`);
        setFollowing((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });
      }
    } catch {
      // mantém o estado anterior em caso de falha
    } finally {
      setUpdatingFollow(null);
    }
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
      projetos.reload();
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
    if (tab === 'ongs') {
      if (ongs.loading) return <Loading label="Carregando ONGs…" />;
      if (ongs.error) {
        return <ErrorNote message={ongs.error} onRetry={ongs.reload} />;
      }
      if ((ongs.data ?? []).length === 0) {
        return (
          <EmptyState
            icon="people-outline"
            title="Nenhuma ONG por aqui"
            hint="ONGs parceiras vão aparecer nesta lista."
          />
        );
      }

      return (
        <View style={styles.list}>
          {(ongs.data ?? []).map((ong) => {
            const name = ong.nome ?? 'ONG parceira';
            const open = expanded === ong.idOng;
            const isFollowing = following.has(ong.idOng);

            return (
              <Card key={ong.idOng} style={styles.ongCard}>
                <View style={styles.ongBody}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(name)}</Text>
                  </View>

                  <View style={styles.ongMain}>
                    <View style={styles.ongTopRow}>
                      <View style={styles.ongTitleWrap}>
                        <Text style={styles.ongName} numberOfLines={1}>
                          {name}
                        </Text>
                        <View style={styles.regionRow}>
                          <Ionicons
                            name="location"
                            size={11}
                            color={COLORS.primary}
                          />
                          <Text style={styles.regionText} numberOfLines={1}>
                            {ong.regiao || 'Cidade Tiradentes'}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.followBtn,
                          isFollowing
                            ? styles.followBtnActive
                            : styles.followBtnIdle,
                        ]}
                        onPress={() => toggleFollow(ong.idOng)}
                        disabled={updatingFollow === ong.idOng}
                        activeOpacity={0.85}
                      >
                        <Text
                          style={[
                            styles.followText,
                            isFollowing && styles.followTextActive,
                          ]}
                        >
                          {updatingFollow === ong.idOng
                            ? '...'
                            : isFollowing
                              ? 'Seguindo'
                              : 'Seguir'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {!!ong.descricao && (
                      <Text style={styles.ongDescription}>{ong.descricao}</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactToggle}
                  onPress={() => setExpanded(open ? null : ong.idOng)}
                  activeOpacity={0.8}
                >
                  <View style={styles.contactLabelWrap}>
                    <Ionicons
                      name="person-outline"
                      size={13}
                      color={COLORS.primary}
                    />
                    <Text style={styles.contactLabel} numberOfLines={1}>
                      CNPJ {ong.cnpj || '—'} · Contato e parceiros
                    </Text>
                  </View>
                  <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={COLORS.faint}
                  />
                </TouchableOpacity>

                {open && (
                  <View style={styles.contactRow}>
                    {!!ong.telefone && (
                      <TouchableOpacity
                        style={[styles.contactBtn, styles.contactBtnGhost]}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${String(ong.telefone).replace(/\D/g, '')}`,
                          )
                        }
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name="call-outline"
                          size={13}
                          color={COLORS.text}
                        />
                        <Text style={styles.contactBtnGhostText} numberOfLines={1}>
                          {ong.telefone}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {!!ong.usuario?.email && (
                      <TouchableOpacity
                        style={[styles.contactBtn, styles.contactBtnPrimary]}
                        onPress={() =>
                          Linking.openURL(`mailto:${ong.usuario.email}`)
                        }
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name="at"
                          size={13}
                          color={COLORS.onPrimary}
                        />
                        <Text style={styles.contactBtnPrimaryText}>E-mail</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      );
    }

    if (projetos.loading) return <Loading label="Carregando projetos…" />;
    if (projetos.error) {
      return <ErrorNote message={projetos.error} onRetry={projetos.reload} />;
    }
    if ((projetos.data ?? []).length === 0) {
      return (
        <EmptyState
          icon="leaf-outline"
          title="Nenhum projeto incluído ainda"
          hint="Acompanhe iniciativas das ONGs parceiras."
        />
      );
    }

    return (
      <View style={styles.list}>
        {(projetos.data ?? []).map((projeto) => {
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
                    <Text style={styles.projectOng} numberOfLines={1}>
                      {projeto.ong?.nome || 'ONG parceira'}
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

              <Text style={styles.projectMeta}>
                {numFmt(projeto.idProjeto)} · atualizado automaticamente
              </Text>
            </Card>
          );
        })}
      </View>
    );
  }, [
    tab,
    ongs.loading,
    ongs.error,
    ongs.data,
    projetos.loading,
    projetos.error,
    projetos.data,
    expanded,
    following,
    updatingFollow,
  ]);

  return (
    <View style={styles.root}>
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      >
        <Text style={styles.eyebrow}>Redes de reflorestamento</Text>
        <Text style={styles.title}>ONGs e Projetos</Text>
        <TabBar tabs={TABS} value={tab} onChange={setTab} />
      </View>

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
        {tab === 'projetos' && isOng && (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={openCreate}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color={COLORS.primary} />
            <Text style={styles.createBtnText}>Criar projeto</Text>
          </TouchableOpacity>
        )}

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
