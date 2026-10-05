import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { COLORS } from '../../theme';
import { API_BASE_URL } from '../../api';
import {} from './ProfileStyle.js';

export default function ProfileScreen() {
  const navigation = useNavigation();
  
  const { user, tipo, signOut } = useAuth();
  const [counts, setCounts] = useState({ denuncias: 0, projetos: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [d, p] = await Promise.all([api.get('/denuncias'), api.get('/projetos')]);
      const mine = (d.data.denuncias ?? []).filter((x) => x.idUsuario === user?.idUsuario);
      setCounts({ denuncias: mine.length, projetos: (p.data.projetos ?? []).length });
    } catch {
      // perfil não trava sem rede
    } finally {
      setRefreshing(false);
    }
  }, [user?.idUsuario]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Deseja sair da conta?');
      if (confirmed) {signOut();}

      return;
    }

    Alert.alert('Sair', 'Deseja sair da conta?', [
      {text: 'Cancelar', style: 'cancel',},
      {text: 'Sair', style: 'destructive', onPress: signOut},
    ]);
  };

  const initials = (user?.nome ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.nome ?? 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{tipo === 'admin' ? 'Administrador' : 'Usuário'}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{counts.denuncias}</Text>
          <Text style={styles.statLabel}>Denúncias</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{counts.projetos}</Text>
          <Text style={styles.statLabel}>Projetos</Text>
        </View>
      </View>

      <View style={styles.menu}>
        
        {tipo === 'comum' && (
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
            <Text style={styles.ongSubtitle}>
              Envie sua organização para análise
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
        
        <MenuItem icon="server-outline" label={`Servidor: ${API_BASE_URL}`} />
        <MenuItem icon="leaf-outline" label="Cidade Tiradentes · São Paulo" />
        
        <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, label }) {
  return (
    <View style={styles.menuItem}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
      <Text style={styles.menuText} numberOfLines={1}>{label}</Text>
    </View>
  );
}
