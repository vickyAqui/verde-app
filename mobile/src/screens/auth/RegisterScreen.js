import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme';
import {styles} from './RegisterStyles.js'; 

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha nome, email e senha');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa de ao menos 6 caracteres');
      return;
    }
    const digits = cpf.replace(/\D/g, '');
    if (cpf && digits.length !== 11) {
      Alert.alert('Atenção', 'CPF deve ter 11 dígitos (só números)');
      return;
    }

    setLoading(true);
    const result = await signUp({
      nome: nome.trim(),
      email: email.trim(),
      senha,
      cpf: digits || undefined,
      dataNasc: dataNasc.trim() || undefined, // AAAA-MM-DD
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Não consegui criar', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Leva menos de 1 minuto</Text>

        <Text style={styles.label}>Nome completo *</Text>
        <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={COLORS.faint}
          value={nome} onChangeText={setNome} autoCapitalize="words" />

        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} placeholder="voce@email.com" placeholderTextColor={COLORS.faint}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />

        <Text style={styles.label}>Senha * (mín. 6)</Text>
        <TextInput style={styles.input} placeholder="Crie uma senha" placeholderTextColor={COLORS.faint}
          value={senha} onChangeText={setSenha} secureTextEntry />

        <Text style={styles.label}>CPF (só números)</Text>
        <TextInput style={styles.input} placeholder="12345678901" placeholderTextColor={COLORS.faint}
          value={cpf} onChangeText={setCpf} keyboardType="number-pad" maxLength={11} />

        <Text style={styles.label}>Nascimento (AAAA-MM-DD)</Text>
        <TextInput style={styles.input} placeholder="1995-06-15" placeholderTextColor={COLORS.faint}
          value={dataNasc} onChangeText={setDataNasc} keyboardType="numbers-and-punctuation" maxLength={10} />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar conta</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Já tenho conta. <Text style={styles.linkBold}>Entrar</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
