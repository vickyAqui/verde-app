
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import api from '../../api';

import {
  AppHeader,
  LoadingView,
  ErrorView,
  EmptyView,
} from '../../components/ui';

import { COLORS } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './NGOsStyle';

const NUM = (value) => {
  try {
    return (value ?? 0).toLocaleString('pt-BR');
  } catch {
    return String(value ?? 0);
  }
};

// Formata o CNPJ sem alterar o valor enviado pela API.
const formatCnpj = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 14);

  if (!digits) return '';

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

export default function NGOsScreen() {
  const { tipo } = useAuth();

  const [tab, setTab] = useState('ongs');
  const [expanded, setExpanded] = useState(null);

  const [ongs, setOngs] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [updatingFollow, setUpdatingFollow] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const [oRes, pRes] = await Promise.all([
        api.get('/ongs?statusOng=aprovada'),
        api.get('/projetos'),
      ]);

      setOngs(oRes.data.ongs ?? []);
      setProjetos(pRes.data.projetos ?? []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Sem conexão com o servidor.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    let mounted = true;

    const loadFollowing = async () => {
      try {
        const res = await api.get('/ongs/following');

        if (mounted) {
          setFollowing(
            new Set(
              (res.data.ongs ?? []).map((ong) => ong.idOng)
            )
          );
        }
      } catch {
        // A lista continua funcionando se essa consulta falhar.
      }
    };

    loadFollowing();

    return () => {
      mounted = false;
    };
  }, []);

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
    } catch (err) {
      Alert.alert(
        'Erro',
        err.response?.data?.error ||
          'Não foi possível atualizar o acompanhamento.'
      );
    } finally {
      setUpdatingFollow(null);
    }
  };

  const handleCreateProjeto = async () => {
    setCreateError(null);

    if (!objetivo.trim() || !descricao.trim()) {
      setCreateError(
        'Preencha o objetivo e a descrição do projeto.'
      );
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

      await load();
    } catch (err) {
      setCreateError(
        err.response?.data?.error ||
          'Não foi possível criar o projeto.'
      );
    } finally {
      setCreating(false);
    }
  };

  const ongList = useMemo(() => ongs, [ongs]);
  const projetoList = useMemo(() => projetos, [projetos]);

  const renderOng = ({ item }) => {
    const isFollowing = following.has(item.idOng);
    const isExpanded = expanded === item.idOng;
    const name = item.nome || 'ONG parceira';

    // O CNPJ é formatado somente para exibição.
    const cnpj = formatCnpj(item.cnpj);

    return (
      <View style={styles.card}>
        <View style={styles.cardMain}>
          <View style={styles.avatar}>
            <Ionicons
              name="people"
              size={21}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.ongHeader}>
              <Text
                style={styles.cardTitle}
                numberOfLines={2}
              >
                {name}
              </Text>

              <TouchableOpacity
                onPress={() => toggleFollow(item.idOng)}
                disabled={updatingFollow === item.idOng}
                style={[
                  styles.followBtn,
                  isFollowing
                    ? styles.followBtnActive
                    : styles.followBtnInactive,
                ]}
                activeOpacity={0.8}
              >
                {updatingFollow === item.idOng ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      isFollowing ? '#FFFFFF' : COLORS.primary
                    }
                  />
                ) : (
                  <Text
                    style={[
                      styles.followText,
                      isFollowing
                        ? styles.followTextActive
                        : styles.followTextInactive,
                    ]}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {item.regiao ? (
              <View style={styles.ongMeta}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={COLORS.primary}
                />
                <Text style={styles.metaText}>
                  {item.regiao}
                </Text>
              </View>
            ) : null}

            {item.descricao ? (
              <Text
                style={styles.cardDescription}
                numberOfLines={2}
              >
                {item.descricao}
              </Text>
            ) : null}
          </View>
        </View>

        {/* CNPJ em uma linha independente do botão de seguir. */}
        {cnpj || item.telefone ? (
          <View style={styles.cardFooter}>
            <View style={styles.footerInfo}>
              {cnpj ? (
                <View style={styles.footerMeta}>
                  <Ionicons
                    name="business-outline"
                    size={12}
                    color={COLORS.primary}
                  />
                  <Text style={styles.footerText}>
                    CNPJ: {cnpj}
                  </Text>
                </View>
              ) : null}

              {isExpanded && item.telefone ? (
                <View style={styles.footerMeta}>
                  <Ionicons
                    name="call-outline"
                    size={12}
                    color={COLORS.primary}
                  />
                  <Text style={styles.footerText}>
                    {item.telefone}
                  </Text>
                </View>
              ) : null}
            </View>

            {item.telefone ? (
              <TouchableOpacity
                style={styles.expandBtn}
                onPress={() =>
                  setExpanded(isExpanded ? null : item.idOng)
                }
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={
                  isExpanded
                    ? 'Ocultar telefone'
                    : 'Mostrar telefone'
                }
              >
                <Ionicons
                  name={
                    isExpanded
                      ? 'chevron-up-outline'
                      : 'chevron-down-outline'
                  }
                  size={16}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  const renderProjeto = ({ item }) => {
    const pct = Math.min(
      100,
      Math.max(0, Number(item.percentualConclusao) || 0)
    );

    return (
      <View style={styles.projetoCard}>
        <View style={styles.projetoHeader}>
          <View style={styles.projetoIcon}>
            <Ionicons
              name="leaf-outline"
              size={19}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.projetoInfo}>
            <Text
              style={styles.projetoTitle}
              numberOfLines={2}
            >
              {item.objetivo || 'Projeto de reflorestamento'}
            </Text>

            <Text style={styles.projetoOng}>
              {item.ong?.nome || 'ONG parceira'}
            </Text>
          </View>

          <Text style={styles.projetoPct}>{pct}%</Text>
        </View>

        {item.descricao ? (
          <Text
            style={styles.projetoDesc}
            numberOfLines={2}
          >
            {item.descricao}
          </Text>
        ) : null}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${pct}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.projetoMeta}>
          {NUM(item.idProjeto)} · atualizado automaticamente
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="ONGs e Projetos"
        subtitle={`${ongList.length} parceiras na região`}
        right={
          tipo === 'ong' && tab === 'projetos' ? (
            <TouchableOpacity
              style={styles.fabCreate}
              onPress={() => {
                setCreateError(null);
                setCreateOpen(true);
              }}
              activeOpacity={0.85}
              accessibilityLabel="Criar projeto"
            >
              <Ionicons name="add" size={21} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'ongs' && styles.tabActive]}
          onPress={() => setTab('ongs')}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'ongs' && styles.tabTextActive,
            ]}
          >
            ONGs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tab === 'projetos' && styles.tabActive,
          ]}
          onPress={() => setTab('projetos')}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'projetos' && styles.tabTextActive,
            ]}
          >
            Projetos
          </Text>
        </TouchableOpacity>
      </View>

      {tipo === 'ong' && tab === 'projetos' ? (
        <TouchableOpacity
          style={styles.createProjectButton}
          onPress={() => {
            setCreateError(null);
            setCreateOpen(true);
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={17} color="#FFFFFF" />
          <Text style={styles.createProjectText}>
            Criar projeto
          </Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.content}>
        {loading ? (
          <LoadingView label="Buscando…" />
        ) : error && ongList.length === 0 &&
          projetoList.length === 0 ? (
          <ErrorView
            message={error}
            onRetry={() => {
              setLoading(true);
              load();
            }}
          />
        ) : tab === 'ongs' ? (
          ongList.length === 0 ? (
            <EmptyView
              icon="people-outline"
              title="Nenhuma ONG por aqui"
              hint="ONGs parceiras vão aparecer nesta lista."
            />
          ) : (
            <FlatList
              data={ongList}
              keyExtractor={(item) => String(item.idOng)}
              renderItem={renderOng}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    load();
                  }}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
            />
          )
        ) : projetoList.length === 0 ? (
          <EmptyView
            icon="folder-open-outline"
            title="Nenhum projeto incluído ainda"
            hint="Acompanhe iniciativas das ONGs parceiras."
          />
        ) : (
          <FlatList
            data={projetoList}
            keyExtractor={(item) => String(item.idProjeto)}
            renderItem={renderProjeto}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  load();
                }}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
        )}
      </View>

      <Modal
        visible={createOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCreateOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalHead}>
            <View>
              <Text style={styles.modalEyebrow}>
                REDES DE REFLORESTAMENTO
              </Text>
              <Text style={styles.modalTitle}>
                Novo projeto
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setCreateOpen(false)}
              hitSlop={12}
              accessibilityLabel="Fechar"
            >
              <Ionicons
                name="close"
                size={24}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.label}>Objetivo *</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ex.: Plantar 50 árvores na região"
              placeholderTextColor={COLORS.faint}
              value={objetivo}
              onChangeText={setObjetivo}
              maxLength={50}
              autoCapitalize="sentences"
            />

            <Text style={styles.label}>Descrição *</Text>

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Descreva os detalhes do projeto..."
              placeholderTextColor={COLORS.faint}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              maxLength={100}
              textAlignVertical="top"
            />

            {createError ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>
                  {createError}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.send,
                (creating || !objetivo.trim() || !descricao.trim()) &&
                  styles.sendDisabled,
              ]}
              onPress={handleCreateProjeto}
              disabled={
                creating ||
                !objetivo.trim() ||
                !descricao.trim()
              }
              activeOpacity={0.85}
            >
              {creating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="leaf-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.sendText}>
                    Criar projeto
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
