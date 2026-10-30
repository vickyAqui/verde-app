import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from '../../api';
import { BackLink, Button, Field, Input } from '../../components/ui';
import { COLORS, FONTS } from '../../theme';
import { styles } from './NGOsCreateStyle';

function formatCnpj(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatTelefone(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export default function NGOsCreateScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
  const [regiao, setRegiao] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async () => {
    setError(null);

    if (
      !nome.trim() ||
      !regiao.trim() ||
      !cnpj.trim() ||
      !telefone.trim() ||
      !descricao.trim()
    ) {
      setError(
        'Preencha o nome, a região, o CNPJ, o telefone e a descrição da ONG.',
      );
      return;
    }

    const cnpjDigits = cnpj.replace(/\D/g, '');
    const telefoneDigits = telefone.replace(/\D/g, '');

    if (cnpjDigits.length !== 14) {
      setError('Informe um CNPJ válido com 14 dígitos.');
      return;
    }

    if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
      setError('Informe um telefone válido.');
      return;
    }

    setBusy(true);
    try {
      await api.post('/ongs', {
        nome: nome.trim(),
        regiao: regiao.trim(),
        cnpj: cnpjDigits,
        telefone: telefoneDigits,
        descricao: descricao.trim(),
      });
      setSubmitted(true);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.message ||
          'Não foi possível enviar a solicitação.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <View
        style={[
          styles.successRoot,
          { paddingTop: Math.max(insets.top, 12) + 40 },
        ]}
      >
        <View style={styles.successIcon}>
          <Ionicons
            name="checkmark-circle"
            size={34}
            color={COLORS.success}
          />
        </View>

        <View>
          <Text style={styles.successTitle}>Solicitação enviada</Text>
          <Text style={styles.successSub}>
            Sua solicitação de cadastro foi encaminhada para análise da
            administração.
          </Text>
        </View>

        <Button
          label="Voltar ao início"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      >
        <BackLink onPress={() => navigation.goBack()} label="Voltar" />
        <Text style={styles.eyebrow}>Faça parte da rede</Text>
        <Text style={styles.title}>Cadastrar ONG</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Ionicons
            name="people-outline"
            size={18}
            color={COLORS.primary}
            style={{ marginTop: 1 }}
          />
          <Text style={styles.introText}>
            Preencha os dados da organização. A solicitação será analisada pela
            administração antes da aprovação.
          </Text>
        </View>

        <Field label="Nome da ONG">
          <Input
            icon="people-outline"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Instituto Verde"
            autoCapitalize="words"
          />
        </Field>

        <Field label="Região de atuação">
          <Input
            icon="location-outline"
            value={regiao}
            onChangeText={setRegiao}
            placeholder="Ex.: Cidade Tiradentes"
            autoCapitalize="words"
          />
        </Field>

        <Field label="CNPJ">
          <Input
            value={cnpj}
            onChangeText={(v) => setCnpj(formatCnpj(v))}
            placeholder="00.000.000/0000-00"
            keyboardType="numeric"
            maxLength={18}
          />
        </Field>

        <Field label="Telefone">
          <Input
            icon="call-outline"
            value={telefone}
            onChangeText={(v) => setTelefone(formatTelefone(v))}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            maxLength={15}
          />
        </Field>

        <Field label="Descrição">
          <Input
            multiline
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva a ONG e seu trabalho..."
            inputStyle={styles.textAreaInput}
          />
        </Field>

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-triangle"
              size={15}
              color={COLORS.error}
              style={{ marginTop: 1 }}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button
          label={busy ? 'Enviando…' : 'Enviar solicitação'}
          iconRight={busy ? undefined : 'send-outline'}
          onPress={onSubmit}
          loading={busy}
          style={styles.submit}
        />

        <TouchableOpacity
          style={styles.cancel}
          onPress={() => navigation.goBack()}
          disabled={busy}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
