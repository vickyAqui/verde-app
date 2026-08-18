import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../api';

export default function AreasScreen() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data.areas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      identified: 'Identificada',
      in_progress: 'Em Reflorestamento',
      reforested: 'Reflorestada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = { identified: '#F59E0B', in_progress: '#3B82F6', reforested: '#10B981' };
    return colors[status] || '#6B7280';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{item.description || 'Sem descrição'}</Text>
      <Text style={styles.cardInfo}>
        Reportada por: {item.reporter?.name || 'Desconhecido'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Áreas Não Verdes</Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={areas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma área encontrada</Text>}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', flex: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cardDescription: { color: '#6B7280', marginTop: 8, fontSize: 14 },
  cardInfo: { color: '#9CA3AF', marginTop: 8, fontSize: 12 },
  loadingText: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});
