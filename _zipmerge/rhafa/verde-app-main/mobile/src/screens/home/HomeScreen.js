import { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { LoadingView, ErrorView } from '../../components/ui';
import { COLORS, denColor } from '../../theme';
import { styles } from './HomeStyle.js';

const num = (n) => {
  try {
    return (n ?? 0).toLocaleString('pt-BR');
  } catch {
    return String(n ?? 0);
  }
};

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [areas, denuncias, ongs, projetos] = await Promise.all([
        api.get('/areas'),
        api.get('/denuncias'),
        api.get('/ongs'),
        api.get('/projetos'),
      ]);
      const denList = denuncias.data.denuncias ?? [];
      setData({
        areas: (areas.data.areas ?? []).length,
        abertas: denList.filter((d) => d.statusDenuncia !== 'resolvido'),
        ongs: (ongs.data.ongs ?? []).length,
        projetos: (projetos.data.projetos ?? []).length,
      });
    } catch (e) {
      setError(e.response?.data?.error || 'Sem conexão com o servidor. Verifique o EXPO_PUBLIC_API_URL.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const firstName = user?.nome?.split(/\s+/)[0] ?? '';
  const abertas = data?.abertas ?? [];

  const header = (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerEyebrow}>{firstName ? `Olá, ${firstName}` : 'Bem-vindo(a)'}</Text>
        <Text style={styles.headerTitle} numberOfLines={1}>+Verde Cidade Tiradentes</Text>
      </View>
      <View style={styles.headerBadge}>
        <Ionicons name="leaf" size={18} color={COLORS.primary} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.root}>
        {header}
        <LoadingView label="Carregando..." />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.root}>
        {header}
        <ErrorView message={error} onRetry={() => { setLoading(true); load(); }} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* ── Passo principal ── */}
        <TouchableOpacity onPress={() => navigation.navigate('Denunciar')} activeOpacity={0.9}>
          <LinearGradient
            colors={['#0C3322', '#0E4C33', '#166B44']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.eyebrow}>COMO AJUDAR</Text>
            <Text style={styles.ctaTitle}>Encontrou uma área sem árvores?</Text>
            <Text style={styles.ctaSub}>
              Registre em menos de um minuto. As ONGs parceiras recebem sua denúncia e agem no local.
            </Text>
            <View style={styles.ctaButton}>
              <Ionicons name="warning" size={16} color="#0E4C33" />
              <Text style={styles.ctaButtonText}>Denunciar agora</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Números ── */}
        <View style={styles.stats}>
          <StatCard value={data?.areas ?? 0} label="Áreas" icon="leaf" onPress={() => navigation.navigate('Mapa')} />
          <StatCard value={abertas.length} label="Abertas" icon="alert-circle" onPress={() => navigation.navigate('Denunciar')} />
          <StatCard value={data?.ongs ?? 0} label="ONGs" icon="people" onPress={() => navigation.navigate('ONGs')} />
          <StatCard value={data?.projetos ?? 0} label="Projetos" icon="folder-open" onPress={() => navigation.navigate('ONGs')} />
        </View>

        {/* ── Alertas em aberto ── */}
        {abertas.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Alertas em aberto</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Mapa')} hitSlop={8}>
                <Text style={styles.cardHeaderLink}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {abertas.slice(0, 4).map((d, i) => (
              <TouchableOpacity
                key={d.idDenuncia}
                style={[styles.alertRow, i > 0 && styles.alertRowBorder]}
                onPress={() => navigation.navigate('Mapa')}
                activeOpacity={0.7}
              >
                <View style={[styles.dot, { backgroundColor: denColor(d.statusDenuncia) }]} />
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle} numberOfLines={1}>{d.titulo}</Text>
                  <Text style={styles.alertSub} numberOfLines={1}>
                    {d.area?.rua || d.area?.bairro || 'Cidade Tiradentes'} · {d.dataDenuncia}
                  </Text>
                </View>
                <Text style={styles.alertStatus}>{d.statusDenuncia}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Educação ── */}
        <TouchableOpacity
          style={styles.eduCard}
          onPress={() => navigation.navigate('Educacao')}
          activeOpacity={0.85}
        >
          <View style={styles.eduIcon}>
            <Ionicons name="book-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.eduInfo}>
            <Text style={styles.eduTitle}>Educação Ambiental</Text>
            <Text style={styles.eduSub}>Artigos, vídeos e dados sobre a arborização.</Text>
          </View>
          <Ionicons name="arrow-forward" size={17} color={COLORS.muted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatCard({ value, label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.stat} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
      <Text style={styles.statNumber}>{num(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
