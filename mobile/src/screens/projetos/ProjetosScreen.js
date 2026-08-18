import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../api';

export default function ProjetosScreen() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjetos();
  }, []);

  const loadProjetos = async () => {
    try {
      const response = await api.get('/projetos');
      setProjetos(response.data.projetos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.objetivo}</Text>
      <Text style={styles.cardDescription}>{item.descricao || 'Sem descrição'}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.percentualConclusao}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.percentualConclusao}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Projetos</Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={projetos}
          keyExtractor={(item) => String(item.id_Projeto)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum projeto encontrado</Text>}
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
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  cardDescription: { color: '#6B7280', marginTop: 8, fontSize: 14 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#2D6A4F', borderRadius: 4 },
  progressText: { color: '#2D6A4F', fontWeight: 'bold', fontSize: 14 },
  loadingText: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});
