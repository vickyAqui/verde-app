import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../api';

export default function NGOsScreen() {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      const response = await api.get('/ngos');
      setNGOs(response.data.ngos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (ngoId, ngoName) => {
    Alert.alert('Conectar', `Deseja se conectar com ${ngoName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Conectar',
        onPress: async () => {
          try {
            await api.post(`/ngos/${ngoId}/connect`);
            Alert.alert('Sucesso', 'Conexão solicitada!');
          } catch (err) {
            Alert.alert('Erro', err.response?.data?.error || 'Erro ao conectar');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description || 'Sem descrição'}</Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>{item.totalAreasReforested} áreas</Text>
        <Text style={styles.stat}>{item.totalTreesPlanted} árvores</Text>
      </View>
      <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect(item.id, item.name)}>
        <Text style={styles.connectButtonText}>Conectar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ONGs de Reflorestamento</Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={ngos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma ONG encontrada</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#2D6A4F' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  cardDescription: { color: '#6B7280', marginTop: 8, fontSize: 14 },
  stats: { flexDirection: 'row', gap: 16, marginTop: 12 },
  stat: { color: '#2D6A4F', fontWeight: 'bold', fontSize: 14 },
  connectButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  connectButtonText: { color: '#fff', fontWeight: 'bold' },
  loadingText: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});
