import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import {
  Card,
  Loading,
  SectionLabel,
  StatusBadge,
} from '../../components/ui';
import { COLORS, DEN_STATUS, initials, numFmt } from '../../theme';
import { styles } from './ProfileStyle';

const SETTINGS = [
  {
    icon: 'warning-outline',
    label: 'Notificações',
    sub: 'Alertas de denúncias e mutirões',
  },
  {
    icon: 'lock-closed-outline',
    label: 'Privacidade',
    sub: 'Seus dados e permissões',
  },
  {
    icon: 'book-outline',
    label: 'Sobre o +Verde',
    sub: 'Proposta, equipe e parceiros',
  },
  {
    icon: 'information-circle-outline',
    label: 'Termos e uso',
    sub: 'Política da plataforma',
  },
];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, tipo, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const denuncias = useFetch(() =>
    api.get('/denuncias').then((r) => r.denuncias ?? []),
  );
  const areas = useFetch(() => api.get('/areas').then((r) => r.areas ?? []));
  const projetos = useFetch(() =>
    api.get('/projetos').then((r) => r.projetos ?? []),
  );

  const mine = useMemo(
    () =>
      (denuncias.data ?? []).filter(
        (d) =>
          (d.usuario?.idUsuario ?? d.idUsuario) === user?.idUsuario,
      ),
    [denuncias.data, user?.idUsuario],
  );

  const isAdmin = tipo === 'admin';

  const stats = [
    { label: 'Minhas denúncias', value: numFmt(mine.length) },
    { label: 'Áreas mapeadas', value: numFmt(areas.data?.length) },
    { label: 'Projetos', value: numFmt(projetos.data?.length) },
  ];

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([denuncias.reload(), areas.reload(), projetos.reload()]);
    setRefreshing(false);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm('Deseja sair da conta?')
          : true;
      if (confirmed) signOut();
      return;
    }

    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshAll}
          colors={[COLORS.primary]}
        />
      }
    >
      {/* Capa */}
      <LinearGradient
        colors={['#0C3322', '#0E4C33', '#166B44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cover,
          { paddingTop: Math.max(insets.top, 12) + 12 },
        ]}
      >
        <Text style={styles.coverEyebrow}>+Verde · Perfil</Text>

        <View style={styles.coverTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials(user?.nome ?? '?')}
            </Text>
          </View>

          {isAdmin && (
            <TouchableOpacity
              style={styles.adminLink}
              onPress={() => navigation.navigate('Admin')}
              activeOpacity={0.8}
            >
              <Ionicons name="shield" size={13} color={COLORS.white} />
              <Text style={styles.adminLinkText}>Painel da ONG</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Identidade */}
      <View style={styles.identityWrap}>
        <View style={styles.identityCard}>
          <Text style={styles.name}>{user?.nome}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.locationPill}>
            <Ionicons name="location" size={11} color={COLORS.primary} />
            <Text style={styles.locationText}>
              Cidade Tiradentes · zona leste
            </Text>
          </View>

          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Minhas denúncias */}
      <View style={styles.section}>
        <SectionLabel style={styles.sectionLabel}>Minhas denúncias</SectionLabel>

        {denuncias.loading ? (
          <Loading />
        ) : mine.length === 0 ? (
          <Card>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
              <Text style={styles.emptyHint}>
                Quando você denunciar uma área, ela aparece aqui com o
                andamento.
              </Text>
            </View>
          </Card>
        ) : (
          <View style={styles.denList}>
            {mine.map((d) => (
              <Card key={d.idDenuncia} style={styles.denCard}>
                <View style={styles.denInfo}>
                  <Text style={styles.denTitle} numberOfLines={1}>
                    {d.titulo}
                  </Text>
                  <View style={styles.denSubRow}>
                    <Ionicons
                      name="location"
                      size={11}
                      color={COLORS.primary}
                    />
                    <Text style={styles.denSub} numberOfLines={1}>
                      {d.area?.rua ||
                        d.area?.bairro ||
                        'Cidade Tiradentes'}{' '}
                      · {d.dataDenuncia}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={d.statusDenuncia} map={DEN_STATUS} />
              </Card>
            ))}
          </View>
        )}
      </View>

      {/* CTA ONG */}
      {tipo === 'comum' && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.ongCta}
            onPress={() => navigation.navigate('CreateONGsScreen')}
            activeOpacity={0.85}
          >
            <View style={styles.ongIcon}>
              <Ionicons name="people" size={18} color={COLORS.onPrimary} />
            </View>

            <View style={styles.ongTextWrap}>
              <Text style={styles.ongTitle}>Cadastrar sua ONG</Text>
              <Text style={styles.ongSubtitle}>
                Envie sua organização para análise
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Configurações */}
      <View style={styles.section}>
        <SectionLabel style={styles.sectionLabel}>Configurações</SectionLabel>

        <Card style={styles.settingsCard}>
          {SETTINGS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.settingRow,
                index > 0 && styles.settingRowBorder,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={COLORS.muted}
                />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.label}</Text>
                <Text style={styles.settingSub}>{item.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          style={styles.signOut}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={15} color={COLORS.error} />
          <Text style={styles.signOutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          +Verde · Cidade Tiradentes — arborização urbana comunitária
        </Text>
      </View>
    </ScrollView>
  );
}
