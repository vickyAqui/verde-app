import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { getCurrentCoords } from '../../utils/location';
import { Button, Card, EmptyState, Loading, StatusBadge } from '../../components/ui';
import { COLORS, DEN_STATUS, FONTS, numFmt } from '../../theme';
import { styles } from './DenunciarStyle';

const CATEGORIES = [
  { key: 'sem-arvores', label: 'Local sem árvores', icon: 'leaf' },
  { key: 'corte-irregular', label: 'Corte irregular', icon: 'close-circle-outline' },
  { key: 'poda-inadequada', label: 'Poda inadequada', icon: 'cut-outline' },
  { key: 'area-degradada', label: 'Área degradada', icon: 'warning-outline' },
];

function parseAddress(raw) {
  const [first, ...rest] = raw.split(',').map((s) => s.trim());
  return {
    rua: first || 'Área não nomeada',
    bairro: rest.join(' ').trim() || undefined,
  };
}

export default function DenunciarScreen({ navigation }) {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [tab, setTab] = useState('nova');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [foto, setFoto] = useState('');
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [protocol, setProtocol] = useState(null);

  const areas = useFetch(() =>
    api.get('/areas').then((r) => r.data.areas ?? []),
  );
  const denuncias = useFetch(() =>
    api.get('/denuncias').then((r) => r.data.denuncias ?? []),
  );

  useEffect(() => {
    const incoming = route.params?.address;
    if (incoming) {
      setAddress(incoming);
      setTab('nova');
      setProtocol(null);
      setError(null);
      navigation.setParams({ address: undefined });
    }
  }, [route.params?.address, navigation]);

  useEffect(() => {
    const incoming = route.params?.denunciaId;
    if (incoming) {
      setTab('minhas');
      setProtocol(null);
      setError(null);
      navigation.setParams({ denunciaId: undefined });
    }
  }, [route.params?.denunciaId, navigation]);

  const myReports = useMemo(
    () =>
      (denuncias.data ?? []).filter(
        (d) =>
          (d.usuario?.idUsuario ?? d.idUsuario) === user?.idUsuario,
      ),
    [denuncias.data, user?.idUsuario],
  );

  const canSubmit = !!category && address.trim().length > 0 && !busy;

  const reset = () => {
    setCategory('');
    setAddress('');
    setDescription('');
    setFoto('');
    setProtocol(null);
    setError(null);
  };

  const useMyLocation = useCallback(async () => {
    setError(null);
    setLocating(true);
    try {
      const coords = await getCurrentCoords();
      let rua = '';
      let bairro = '';

      if (Platform.OS === 'web') {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
        );
        const data = await res.json();
        const a = data.address ?? {};
        rua = a.road || a.pedestrian || a.street || '';
        bairro =
          a.suburb || a.neighbourhood || a.city_district || a.city || '';
      } else {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        rua = place?.street || place?.name || '';
        bairro =
          place?.suburb ||
          place?.district ||
          place?.city ||
          '';
      }

      const texto = [rua, bairro].filter(Boolean).join(', ');
      if (texto) setAddress(texto);
      else setError('Não foi possível identificar o endereço.');
    } catch (e) {
      setError(
        e?.message ||
          'Não foi possível obter sua localização. Permita o acesso à localização.',
      );
    } finally {
      setLocating(false);
    }
  }, []);

  async function onSubmit() {
    if (!category || !address.trim()) return;

    setBusy(true);
    setError(null);

    try {
      const { rua, bairro } = parseAddress(address);

      let area = (areas.data ?? []).find((a) =>
        (a.rua || '').toLowerCase().includes(rua.toLowerCase()),
      );

      if (!area) {
        const created = await api.post('/areas', {
          cidade: 'Cidade Tiradentes',
          bairro: bairro ?? 'Cidade Tiradentes',
          rua,
          statusArea: 'identificada',
        });
        area = created.data.area;
        areas.reload();
      }

      const label =
        CATEGORIES.find((c) => c.key === category)?.label ?? 'Denúncia';

      const res = await api.post('/denuncias', {
        idArea: area.idArea,
        titulo: label,
        descricao: description.trim() || undefined,
        foto: foto.trim() || undefined,
      });

      setProtocol(res.data.denuncia?.idDenuncia ?? null);
      denuncias.reload();
      setTab('nova');
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.message ||
          'Não foi possível enviar a denúncia.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (protocol !== null && tab === 'nova') {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successIcon}>
          <Ionicons
            name="checkmark-circle"
            size={34}
            color={COLORS.success}
          />
        </View>
        <View>
          <Text style={styles.successTitle}>Denúncia registrada</Text>
          <Text style={styles.successSub}>
            Protocolo{' '}
            <Text style={styles.successBold}>#{protocol}</Text> encaminhado às
            ONGs parceiras da região.
          </Text>
        </View>
        <View style={styles.successActions}>
          <Button label="Nova denúncia" onPress={reset} compact />
          <Button
            label="Ver minhas"
            variant="ghost"
            onPress={() => setTab('minhas')}
            compact
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.root}>
        <View
          style={[
            styles.header,
            { paddingTop: Math.max(insets.top, 12) + 8 },
          ]}
        >
          <Text style={styles.eyebrow}>Área sem arborização?</Text>
          <Text style={styles.title}>Denúncias</Text>
          <View style={styles.tabsRow}>
            {[
              ['nova', 'Nova'],
              ['minhas', 'Minhas'],
            ].map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.tab, tab === key && styles.tabActive]}
                onPress={() => {
                  setTab(key);
                  setError(null);
                }}
              >
                <Text
                  style={[styles.tabText, tab === key && styles.tabTextActive]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {tab === 'nova' ? (
          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.intro}>
              A denúncia é encaminhada diretamente para as ONGs parceiras que
              atuam em Cidade Tiradentes.
            </Text>

            <View>
              <Text style={styles.sectionLabel}>Tipo de ocorrência</Text>
              <View style={styles.catGrid}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c.key}
                    style={[styles.cat, category === c.key && styles.catActive]}
                    onPress={() => setCategory(c.key)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={c.icon}
                      size={17}
                      color={category === c.key ? COLORS.primary : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.catText,
                        category === c.key && styles.catTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.sectionLabel}>
                Rua (bairro opcional)
              </Text>
              <View style={styles.addressRow}>
                <Ionicons
                  name="location"
                  size={16}
                  color={COLORS.primary}
                />
                <TextInput
                  style={styles.addressInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Ex.: Rua Iguaçu, 340 — Santa Etelvina"
                  placeholderTextColor={COLORS.faint}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.locateBtn}
                  onPress={useMyLocation}
                  disabled={locating}
                  hitSlop={8}
                >
                  {locating ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Ionicons
                      name="locate"
                      size={16}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={styles.sectionLabel}>
                Descrição <Text style={styles.optional}>(opcional)</Text>
              </Text>
              <View style={styles.textareaWrap}>
                <TextInput
                  style={styles.textarea}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descreva a situação…"
                  placeholderTextColor={COLORS.faint}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View>
              <Text style={styles.sectionLabel}>
                Foto (URL) <Text style={styles.optional}>(opcional)</Text>
              </Text>
              <View style={styles.addressRow}>
                <Ionicons
                  name="image-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <TextInput
                  style={styles.addressInput}
                  value={foto}
                  onChangeText={setFoto}
                  placeholder="https://…"
                  placeholderTextColor={COLORS.faint}
                  autoCapitalize="none"
                  keyboardType="url"
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

            <TouchableOpacity
              style={[
                styles.submitBtn,
                !canSubmit && styles.submitBtnDisabled,
              ]}
              onPress={onSubmit}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator size="small" color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.submitText}>Enviar denúncia</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {denuncias.loading ? (
              <Loading label="Carregando suas denúncias…" />
            ) : myReports.length === 0 ? (
              <EmptyState
                icon="file-tray-outline"
                title="Nenhuma denúncia ainda"
                hint="Suas denúncias vão aparecer aqui com o status de andamento."
              />
            ) : (
              <>
                <Text style={styles.countLabel}>
                  {numFmt(myReports.length)}{' '}
                  {myReports.length === 1 ? 'denúncia' : 'denúncias'}
                </Text>
                <View style={styles.reportList}>
                  {myReports.map((r) => (
                    <Card key={r.idDenuncia} style={styles.reportCard}>
                      <View style={styles.reportInfo}>
                        <Text style={styles.reportTitle} numberOfLines={1}>
                          {r.titulo}
                        </Text>
                        <View style={styles.reportSub}>
                          <Ionicons
                            name="location"
                            size={11}
                            color={COLORS.primary}
                          />
                          <Text
                            style={{
                              fontFamily: FONTS.sans,
                              fontSize: 12,
                              color: COLORS.muted,
                              flexShrink: 1,
                            }}
                            numberOfLines={1}
                          >
                            {r.area?.rua || r.area?.bairro || 'Cidade Tiradentes'}{' '}
                            · {r.dataDenuncia}
                          </Text>
                        </View>
                      </View>
                      <StatusBadge
                        status={r.statusDenuncia}
                        map={DEN_STATUS}
                      />
                    </Card>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
