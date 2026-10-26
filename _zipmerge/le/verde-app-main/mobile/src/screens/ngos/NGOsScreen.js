import { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api';
import { AppHeader, LoadingView, ErrorView, EmptyView } from '../../components/ui';
import { COLORS } from '../../theme';
import {styles} from './NGOsStyle.js'

export default function NGOsScreen() {
  const [ongs, setONGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/ongs?statusOng=aprovada');
      setONGs(response.data.ongs ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="people" size={22} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.nome || 'ONG parceira'}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.descricao || 'Reflorestamento urbano'}</Text>
        <View style={styles.info}>
          <Text style={styles.infoText}>{item.regiao || 'Cidade Tiradentes'}</Text>
          {item.telefone ? <Text style={styles.infoText}> · {item.telefone}</Text> : null}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="ONGs" subtitle={`${ongs.length} parceiras na região`} />
      {loading ? (
        <LoadingView label="Buscando ONGs..." />
      ) : error && ongs.length === 0 ? (
        <ErrorView message={error} onRetry={() => { setLoading(true); load(); }} />
      ) : (
        <FlatList
          data={ongs}
          keyExtractor={(item) => String(item.idOng)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyView icon="people-outline" title="Nenhuma ONG ainda" hint="As ONGs parceiras aparecem aqui." />
          }
        />
      )}
    </View>
  );
}
