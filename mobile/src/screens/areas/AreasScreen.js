import { useCallback, useMemo, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api';
import { AppHeader, LoadingView, ErrorView, EmptyView, StatusBadge } from '../../components/ui';
import { COLORS, AREA_LABELS, areaColor, raioOf, fmtAreaM2 } from '../../theme';
import {styles} from './AreaStyle.js'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'identificada', label: 'Déficit' },
  { key: 'em tratamento', label: 'Em trat.' },
  { key: 'reflorestada', label: 'Reflor.' },
];

export default function AreasScreen({ navigation }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/areas');
      setAreas(response.data.areas ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return areas
      .filter((a) => (filter === 'all' ? true : a.statusArea === filter))
      .filter((a) => !q
        || a.rua?.toLowerCase().includes(q)
        || a.bairro?.toLowerCase().includes(q)
        || a.cidade?.toLowerCase().includes(q));
  }, [areas, filter, query]);

  const renderItem = ({ item }) => {
    const hasGeo = item.latitude != null && item.longitude != null;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Mapa', { areaId: item.idArea })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.rua}</Text>
          <StatusBadge color={areaColor(item.statusArea)} label={AREA_LABELS[item.statusArea] ?? item.statusArea} />
        </View>
        <Text style={styles.cardInfo}>{item.bairro} · {item.cidade}</Text>
        <Text style={styles.cardMeta}>
          {hasGeo
            ? `Demarcada · ${item.poligono ? 'polígono' : fmtAreaM2(raioOf(item.statusArea, item.raio))} · ver no mapa`
            : 'Sem coordenadas no mapa'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Áreas" subtitle={`${areas.length} mapeadas em Cidade Tiradentes`} />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          placeholder="Buscar rua ou bairro..."
          placeholderTextColor={COLORS.faint}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, filter === f.key && styles.chipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <LoadingView label="Buscando áreas..." />
      ) : error && areas.length === 0 ? (
        <ErrorView message={error} onRetry={() => { setLoading(true); load(); }} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.idArea)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyView icon="leaf-outline" title="Nada por aqui" hint="Ajuste a busca ou o filtro." />
          }
        />
      )}
    </View>
  );
}
