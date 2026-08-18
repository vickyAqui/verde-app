import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name}!</Text>
        <Text style={styles.title}>+Verde</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Áreas Mapeadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Conexões</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas Atividades</Text>
        <Text style={styles.emptyText}>Nenhuma atividade ainda</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#2D6A4F' },
  greeting: { fontSize: 16, color: '#D8F3DC' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  stats: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#2D6A4F' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', padding: 24 },
});
