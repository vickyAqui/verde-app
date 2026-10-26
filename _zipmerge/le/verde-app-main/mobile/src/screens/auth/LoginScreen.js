
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './LoginStyle.js';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      setError('Preencha seu e-mail e sua senha.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signIn(email.trim(), senha);

      if (!result.success) {
        setError(result.error || 'Não foi possível entrar.');
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Não foi possível entrar.'
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
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho verde */}
        <LinearGradient
          colors={['#0C3322', '#0E4C33', '#166B44']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons
                name="leaf-outline"
                size={20}
                color="#FFFFFF"
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </View>
            <Text style={styles.brandTitle}>+Verde</Text>
          </View>

          <Text style={styles.heroTitle}>
            Cidade Tiradentes,{'\n'}
            mais verde
            <Text style={styles.heroHighlight}>.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Mapeie áreas sem arborização, denuncie e
            conecte-se com ONGs que reforestam a zona
            leste de São Paulo.
          </Text>
        </LinearGradient>

        {/*Cartão do formulário */}
        <View style={styles.formArea}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Entrar na sua conta
            </Text>

            {/* E-mail */}
            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={15}
                  color={COLORS.muted}
                  style={styles.inputIcon}
                />

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
            </View>

            {/* Senha */}
            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={15}
                  color={COLORS.muted}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.faint}
                  value={senha}
                  onChangeText={(value) => {
                    setSenha(value);
                    setError('');
                  }}
                  secureTextEntry
                  autoComplete="current-password"
                  autoCapitalize="none"
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                />
              </View>
            </View>

            {/* Erro de login */}
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

            {/* Botão entrar */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Cadastro */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>
                Ainda não tem conta?{' '}
                <Text style={styles.linkBold}>
                  Cadastre-se
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Rede comunitária de arborização urbana de{' '}
              <Text style={styles.footerHighlight}>
                Cidade Tiradentes
              </Text>
              {' '}— concebida em parceria com ONGs e
              moradores da região.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
