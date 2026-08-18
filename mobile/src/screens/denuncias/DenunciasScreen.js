import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../../api';

export default function DenunciasScreen() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDenuncias();
  }, []);

  const loadDenuncias = async () => {
    try {
      const response = await api.get('/denuncias');
      setDenuncias(response.data.denuncias);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'aberta') return '#F59E0B';
    if (status === 'em análise') return '#3B82F6';
    if (status === 'resolvida') return '#10B981';
    return '#6B7280';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.statusDenuncia) }]}>
          <Text style={styles.badgeText}>{item.statusDenuncia}</Text>
        </View>
      </View>
      <Text style={styles.cardInfo}>
        {item.area?.cidade} - {item.area?.bairro}, {item.area?.rua}
      </Text>
      <Text style={styles.cardDescription}>{item.descricao || 'Sem descrição'}</Text>
      <Text style={styles.cardDate}>{item.dataDenuncia}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Denúncias</Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={denuncias}
          keyExtractor={(item) => String(item.idDenuncias)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia encontrada</Text>}
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
  cardInfo: { color: '#2D6A4F', marginTop: 8, fontSize: 14, fontWeight: '600' },
  cardDescription: { color: '#6B7280', marginTop: 4, fontSize: 14 },
  cardDate: { color: '#9CA3AF', marginTop: 8, fontSize: 12 },
  loadingText: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});
