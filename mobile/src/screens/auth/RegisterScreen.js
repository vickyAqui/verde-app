import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { BackLink, Button, Input } from '../../components/ui';
import { COLORS } from '../../theme';
import { styles } from './RegisterStyles';

function formatCpf(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length > 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  return digits;
}

function formatDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 4) {
    const rest = digits.slice(4);
    if (rest.length > 2) {
      return `${digits.slice(0, 4)}-${rest.slice(0, 2)}-${rest.slice(2)}`;
    }
    return `${digits.slice(0, 4)}-${rest}`;
  }
  return digits;
}

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    dataNasc: '',
  });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function onSubmit() {
    setError(null);

    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    if (form.senha.length < 6) {
      setError('A senha precisa ter ao menos 6 caracteres.');
      return;
    }

    setBusy(true);
    try {
      const res = await signUp({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        cpf: form.cpf || undefined,
        dataNasc: form.dataNasc || undefined,
      });
      if (!res?.success) {
        setError(res?.error || 'Não foi possível criar a conta.');
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
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: Math.max(insets.top, 12) + 8 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <BackLink onPress={() => navigation.goBack()} />

            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <Ionicons name="leaf" size={17} color={COLORS.white} />
              </View>
              <Text style={styles.brand}>+Verde</Text>
            </View>

            <Text style={styles.title}>Faça parte da rede.</Text>
            <Text style={styles.subtitle}>
              Crie sua conta para denunciar áreas sem arborização e acompanhar
              projetos das ONGs parceiras.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nome completo</Text>
            <Input
              value={form.nome}
              onChangeText={set('nome')}
              placeholder="Maria Rodrigues"
              autoCapitalize="words"
            />

            <View style={{ height: 12 }} />

            <Text style={styles.label}>E-mail</Text>
            <Input
              value={form.email}
              onChangeText={set('email')}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <View style={{ height: 12 }} />

            <Text style={styles.label}>Senha</Text>
            <Input
              value={form.senha}
              onChangeText={set('senha')}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
            />

            <View style={{ height: 12 }} />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>CPF</Text>
                <Input
                  value={form.cpf}
                  onChangeText={(v) => set('cpf')(formatCpf(v))}
                  placeholder="Opcional"
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Nascimento</Text>
                <Input
                  value={form.dataNasc}
                  onChangeText={(v) => set('dataNasc')(formatDate(v))}
                  placeholder="AAAA-MM-DD"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
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
              label="Criar conta"
              onPress={onSubmit}
              loading={busy}
              style={styles.submit}
            />

            <Text style={styles.loginText}>
              Já tem uma conta?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.goBack()}
              >
                Entrar
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
