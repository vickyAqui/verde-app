
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './RegisterStyles.js';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    if (nome.trim().length < 2) {
      setError('Digite seu nome completo.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    const digits = cpf.replace(/\D/g, '');

    if (cpf && digits.length !== 11) {
      setError('O CPF precisa ter 11 números.');
      return;
    }

    // Converte DD/MM/AAAA para AAAA-MM-DD
    let dataFormatada;

    if (dataNasc.trim()) {
      const match = dataNasc.trim().match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
      );

      if (!match) {
        setError('Digite a data no formato DD/MM/AAAA.');
        return;
      }

      const [, dia, mes, ano] = match;
      const data = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia)
      );

      if (
        data.getFullYear() !== Number(ano) ||
        data.getMonth() !== Number(mes) - 1 ||
        data.getDate() !== Number(dia)
      ) {
        setError('Digite uma data de nascimento válida.');
        return;
      }

      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signUp({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cpf: digits || undefined,
        dataNasc: dataFormatada || undefined,
      });

      if (!result.success) {
        setError(result.error || 'Não foi possível criar a conta.');
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Não foi possível criar a conta.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={15}
              color={COLORS.muted}
            />

            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons
                name="leaf-outline"
                size={17}
                color="#FFFFFF"
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </View>

            <Text style={styles.brandTitle}>+Verde</Text>
          </View>

          <Text style={styles.title}>
            Faça parte da rede.
          </Text>

          <Text style={styles.subtitle}>
            Crie sua conta para denunciar áreas sem
            arborização e acompanhar projetos das ONGs
            parceiras.
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formArea}>
          <View style={styles.form}>
            {/* Nome */}
            <View style={styles.field}>
              <Text style={styles.label}>Nome completo</Text>

              <TextInput
                style={styles.input}
                placeholder="Maria Rodrigues"
                placeholderTextColor={COLORS.faint}
                value={nome}
                onChangeText={(value) => {
                  setNome(value);
                  setError('');
                }}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* E-mail */}
            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>

              <TextInput
                style={styles.input}
                placeholder="voce@email.com"
                placeholderTextColor={COLORS.faint}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            {/* Senha */}
            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>

              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={COLORS.faint}
                value={senha}
                onChangeText={(value) => {
                  setSenha(value);
                  setError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="next"
              />
            </View>

            {/* CPF e nascimento */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>CPF</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Opcional"
                  placeholderTextColor={COLORS.faint}
                  value={cpf}
                  onChangeText={(value) => {
                    setCpf(value.replace(/\D/g, '').slice(0, 11));
                    setError('');
                  }}
                  keyboardType="number-pad"
                  maxLength={11}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>Nascimento</Text>

                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={COLORS.faint}
                  value={dataNasc}
                  onChangeText={(value) => {
                    setDataNasc(value);
                    setError('');
                  }}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Erros */}
            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="warning-outline"
                  size={15}
                  color={COLORS.error}
                />

                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}

            {/* Botão */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />
              ) : (
                <Text style={styles.buttonText}>
                  Criar conta
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
