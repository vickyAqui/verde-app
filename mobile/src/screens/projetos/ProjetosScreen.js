import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput,
  RefreshControl, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api';
import { AppHeader, LoadingView, ErrorView, EmptyView } from '../../components/ui';
import { COLORS } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import {} from './ProjetoStyle.js';

export default function ProjetosScreen() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState(false);
  const [objetivo, setObjetivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sending, setSending] = useState(false);

  const { tipo } = useAuth();
  
  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/projetos');
      setProjetos(response.data.projetos ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const submit = async () => {
    if (!objetivo.trim()) {
      Alert.alert('Atenção', 'Dê um objetivo ao projeto');
      return;
    }
    setSending(true);
    try {
      await api.post('/projetos', { objetivo: objetivo.trim(), descricao: descricao.trim() || undefined });
      setModal(false);
      setObjetivo('');
      setDescricao('');
      load();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Não foi possível criar.');
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }) => {
    const pct = Math.min(100, Math.max(0, Number(item.percentualConclusao) || 0));
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.objetivo}</Text>

        {item.ong?.nome ? (
          <Text style={styles.ongName}>{item.ong.nome}</Text>
        ) : null}

        {item.descricao ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        ) : null}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressText}>{pct}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Projetos"
        subtitle={`${projetos.length} em acompanhamento`}
        right={
          tipo === 'ong' ? (
            <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          ) : null
        }
      />
      {loading ? (
        <LoadingView label="Buscando projetos..." />
      ) : error && projetos.length === 0 ? (
        <ErrorView message={error} onRetry={() => { setLoading(true); load(); }} />
      ) : (
        <FlatList
          data={projetos}
          keyExtractor={(item) => String(item.idProjeto)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyView icon="folder-open-outline" title="Nenhum projeto" hint="Crie seu primeiro projeto de plantio." />
          }
        />
      )}

      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.modalRoot}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>Novo projeto</Text>
            <TouchableOpacity onPress={() => setModal(false)} hitSlop={12}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.label}>Objetivo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Plantar 50 árvores na rua X"
              placeholderTextColor={COLORS.faint}
              value={objetivo}
              onChangeText={setObjetivo}
            />
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalhes do projeto..."
              placeholderTextColor={COLORS.faint}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={[styles.send, sending && styles.sendDisabled]}
              onPress={submit}
              disabled={sending}
            >
              {sending
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.sendText}>Criar projeto</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
