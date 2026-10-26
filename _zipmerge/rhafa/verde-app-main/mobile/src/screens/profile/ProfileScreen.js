import { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { COLORS, denColor, DEN_LABELS } from '../../theme';
import { StatusBadge } from '../../components/ui';
import { styles } from './ProfileStyle.js';

const NUM = (n) => {
  try { return (n ?? 0).toLocaleString('pt-BR'); } catch { return String(n ?? 0); }
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { user, tipo, signOut } = useAuth();
  const [counts, setCounts] = useState({ denuncias: 0, areas: 0, projetos: 0 });
  const [mine, setMine] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [d, a, p] = await Promise.all([
        api.get('/denuncias'),
        api.get('/areas'),
        api.get('/projetos'),
      ]);
      const denuncias = d.data.denuncias ?? [];
      const my = denuncias.filter((x) => x.idUsuario === user?.idUsuario);
      setMine(my);
      setCounts({
        denuncias: my.length,
        areas: (a.data.areas ?? []).length,
        projetos: (p.data.projetos ?? []).length,
      });
    } catch {
      // perfil não trava sem rede
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.idUsuario]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          // Encerrar a sessão já move o AppNavigator para a tela de Login:
          // as rotas do stack são renderizadas conforme `user` (null = Login).
          // Não navegar manualmente aqui — 'Login' não existe no navigator de
          // abas, então o navigate viraria uma ação não tratada.
          signOut();
        },
      },
    ]);
  };

  const initials = (user?.nome ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const isAdmin = tipo === 'admin';
  const isComum = tipo === 'comum';

  const configItems = [
    { Icon: 'warning-outline', label: 'Notificações', sub: 'Alertas de denúncias e mutirões' },
    { Icon: 'lock-closed-outline', label: 'Privacidade', sub: 'Seus dados e permissões' },
    { Icon: 'book-outline', label: 'Sobre o +Verde', sub: 'Proposta, equipe e parceiros' },
    { Icon: 'information-circle-outline', label: 'Termos e uso', sub: 'Política da plataforma' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
      }
    >
      {/* ── Cover (espelha a web) ── */}
      <View style={styles.cover}>
        <LinearGradient
          colors={['#0C3322', '#0E4C33', '#166B44']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.coverContent}>
          <Text style={styles.coverEyebrow}>+Verde · Perfil</Text>
          <View style={styles.coverRow}>
            <View style={[styles.avatarCover, { backgroundColor: '#1A6B44' }]}>
              <Text style={styles.avatarTextCover}>{initials}</Text>
            </View>
            {isAdmin && (
              <TouchableOpacity style={styles.adminLink} onPress={() => navigation.navigate('Admin')}>
                <Ionicons name="shield-outline" size={13} color="#fff" />
                <Text style={styles.adminLinkText}>Painel da ONG</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ── Identidade ── */}
      <View style={styles.identityCard}>
        <Text style={styles.nome}>{user?.nome}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.localPill}>
          <Ionicons name="map-pin-outline" size={11} color={COLORS.primary} />
          <Text style={styles.localText}>Cidade Tiradentes · zona leste</Text>
        </View>
        <View style={styles.statsGrid}>
          {[

            { label: 'Minhas denúncias', value: NUM(counts.denuncias) },
            { label: 'Áreas mapeadas', value: NUM(counts.areas) },
            { label: 'Projetos', value: NUM(counts.projetos) },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Minhas denúncias ── */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Minhas denúncias</Text>
        {loading ? (
          <View style={styles.centerPad}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : mine.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}> 
              <Ionicons name="file-tray-outline" size={22} color={COLORS.muted}/>
            </View>
            <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
            <Text style={styles.emptyHint}>Quando você denunciar uma área, ela aparece aqui com o andamento.</Text>
          </View>
        ) : (
          <View style={styles.denunciaList}>
            {mine.map((d) => (
              <TouchableOpacity key={d.idDenuncia} style={styles.denunciaCard} activeOpacity={0.85}>
                <View style={styles.denunciaInfo}>
                  <Text style={styles.denunciaTitle} numberOfLines={1}>{d.titulo}</Text>
                  <Text style={styles.denunciaSub} numberOfLines={1}>
                    {d.area?.rua || d.area?.bairro || 'Cidade Tiradentes'} · {d.dataDenuncia}
                  </Text>
                </View>
                <StatusBadge color={denColor(d.statusDenuncia)} label={DEN_LABELS[d.statusDenuncia] ?? d.statusDenuncia} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ── Cadastrar sua ONG (somente comum) ── */}
      {isComum && (
        <TouchableOpacity
          style={styles.ongCta}
          onPress={() => navigation.navigate('CreateONGsScreen')}
          activeOpacity={0.85}
        >
          <View style={styles.ongIcon}>
            <Ionicons name="people-outline" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.ongContent}>
            <Text style={styles.ongTitle}>Cadastrar sua ONG</Text>
            <Text style={styles.ongSubtitle}>Envie sua organização para análise</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* ── Configurações ── */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.configCard}>
          {configItems.map(({ Icon, label, sub }) => (
            <TouchableOpacity
              key={label}
              style={styles.configItem}
              onPress={() => Alert.alert(label, 'Funcionalidade em breve no mobile.')}
            >
              <View style={styles.configIcon}>
                <Ionicons name={Icon} size={16} color={COLORS.muted} />
              </View>
              <View style={styles.configText}>
                <Text style={styles.configLabel}>{label}</Text>
                <Text style={styles.configSub}>{sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>+Verde · Cidade Tiradentes — arborização urbana comunitária</Text>
      </View>
    </ScrollView>
  );
}
