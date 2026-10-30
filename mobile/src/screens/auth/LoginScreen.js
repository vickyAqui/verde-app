import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../../components/ui';
import { COLORS, FONTS } from '../../theme';
import { styles } from './LoginStyle';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError(null);
    if (!email.trim() || !senha) {
      setError('Informe seu e-mail e sua senha.');
      return;
    }
    setBusy(true);
    try {
      const res = await signIn(email.trim(), senha);
      if (!res?.success) {
        setError(res?.error || 'Não foi possível entrar.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[COLORS.secondary, '#0E4C33', COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.hero,
              { paddingTop: Math.max(insets.top, 16) + 32 },
            ]}
          >
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <Ionicons name="leaf" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.brand}>+Verde</Text>
            </View>

            <Text style={styles.title}>
              Cidade Tiradentes,{'\n'}mais verde
              <Text style={styles.titleAccent}>.</Text>
            </Text>

            <Text style={styles.subtitle}>
              Mapeie áreas sem arborização, denuncie e conecte-se com ONGs que
              reforestam a zona leste de São Paulo.
            </Text>
          </LinearGradient>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar na sua conta</Text>

            <Text style={labelStyle}>E-mail</Text>
            <Input
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <View style={{ height: 12 }} />

            <Text style={labelStyle}>Senha</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Input
                style={{ flex: 1 }}
                icon="lock-closed-outline"
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••"
                secureTextEntry={!showPass}
                autoCapitalize="none"
                autoComplete="password"
              />
              <Pressable
                onPress={() => setShowPass((v) => !v)}
                hitSlop={10}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={17}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="warning"
                  size={15}
                  color={COLORS.error}
                  style={{ marginTop: 1 }}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              label="Entrar"
              onPress={onSubmit}
              loading={busy}
              style={styles.submit}
            />

            <Text style={styles.signup}>
              Ainda não tem conta?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate('Register')}
              >
                Cadastre-se
              </Text>
            </Text>
          </View>

          <Text style={styles.footer}>
            Rede comunitária de arborização urbana de{' '}
            <Text style={styles.footerStrong}>Cidade Tiradentes</Text> —
            concebida em parceria com ONGs e moradores da região.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const labelStyle = {
  marginBottom: 7,
  fontFamily: FONTS.sans,
  fontSize: 12,
  fontWeight: '700',
  color: COLORS.muted,
};
