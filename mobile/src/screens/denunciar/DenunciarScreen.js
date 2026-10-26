import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  RefreshControl, Modal, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { AppHeader, LoadingView, ErrorView, EmptyView, StatusBadge } from '../../components/ui';
import { COLORS, DEN_LABELS, denColor } from '../../theme';
import { styles } from './DenunciarStyle.js';

const CATEGORIES = [
  { key: 'sem-arvores', label: 'Local sem árvores', icon: 'tree-outline' },
  { key: 'corte-irregular', label: 'Corte irregular', icon: 'close-circle-outline' },
  { key: 'poda-inadequada', label: 'Poda inadequada', icon: 'scissors-outline' },
  { key: 'area-degradada', label: 'Área degradada', icon: 'warning-outline' },
];

export default function DenunciarScreen({ navigation }) {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [denuncias, setDenuncias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Tab nova / minhas
  const [tab, setTab] = useState('nova');

  // Form nova denúncia
  const [modal, setModal] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [address, setAddress] = useState(route.params?.address ?? '');
  const [description, setDescription] = useState('');
  const [foto, setFoto] = useState('');
  const [areaId, setAreaId] = useState(null);
  const [areaQuery, setAreaQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [locating, setLocating] = useState(false);
  const [protocol, setProtocol] = useState(null);

  const useMyLocation = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Ative a localização para usar sua posição.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const rua = place?.street || place?.pedestrian || '';
      const bairro = place?.suburb || place?.neighbourhood || place?.city_district || place?.city || '';
      const texto = [rua, bairro].filter(Boolean).join(', ');
      if (texto) setAddress(texto);
      else setError('Não foi possível identificar o endereço.');
    } catch {
      setError('Não foi possível obter sua localização.');
    } finally {
      setLocating(false);
    }
  };

  const load = useCallback(async () => {
    try {
      setError(null);
      const [d, a] = await Promise.all([api.get('/denuncias'), api.get('/areas')]);
      setDenuncias(d.data.denuncias ?? []);
      setAreas(a.data.areas ?? []);
    } catch (err) {
      setError(err.response?.data?.error || 'Sem conexão com o servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Abre o formulário vindo do mapa/home com o endereço pré-preenchido
  useEffect(() => {
    if (route.params?.address && !address) setAddress(route.params.address);
    if (route.params?.areaId) {
      setAreaId(route.params.areaId);
      setModal(true);
      navigation.setParams({ areaId: undefined });
    }
    if (route.params?.denunciaId) {
      setTab('minhas');
      navigation.setParams({ denunciaId: undefined });
    }
  }, [route.params?.address, route.params?.areaId, route.params?.denunciaId, address, navigation]);

  const list = useMemo(
    () => denuncias.filter((d) => (filter === 'all' ? true : d.statusDenuncia === filter)),
    [denuncias, filter],
  );

  const myReports = useMemo(
    () => denuncias.filter((d) => d.usuario?.idUsuario === user?.idUsuario),
    [denuncias, user?.idUsuario],
  );

  const areaOptions = useMemo(() => {
    const q = areaQuery.trim().toLowerCase();
    return areas
      .filter((a) => !q || a.rua?.toLowerCase().includes(q) || a.bairro?.toLowerCase().includes(q))
      .slice(0, 20);
  }, [areas, areaQuery]);

  const canSubmit = !!category && address.trim().length > 0 && !sending;

  const submit = async () => {
    if (!category || !address.trim()) {
      setError('Preencha a categoria e o endereço.');
      return;
    }
    setError(null);
    setSending(true);
    try {
      await api.post('/denuncias', {
        idArea: areaId || undefined,
        titulo: category,
        descricao: description.trim() || undefined,
        foto: foto.trim() || undefined,
      });
      setModal(false);
      setCategory(CATEGORIES[0].key);
      setAddress('');
      setDescription('');
      setFoto('');
      setAreaId(null);
      setAreaQuery('');
      setProtocol(Date.now());
      setTab('nova');
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível enviar a denúncia.');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setProtocol(null);
    setCategory(CATEGORIES[0].key);
    setAddress('');
    setDescription('');
    setFoto('');
    setAreaId(null);
    setAreaQuery('');
    setError(null);
  };

  if (protocol !== null && tab === 'nova') {
    return (
      <View style={styles.root}>
        <View style={styles.header} />
        <View style={styles.successRoot}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle-outline" size={34} color="#2E8B57" />
          </View>
          <Text style={styles.successTitle}>Denúncia registrada</Text>
          <Text style={styles.successSub}>
            Protocolo{' '}
            <Text style={{ fontWeight: '700', color: COLORS.text }}>#{protocol}</Text>{' '}
            encaminhado às ONGs parceiras da região.
          </Text>
          <View style={styles.successBtnRow}>
            <TouchableOpacity style={[styles.btnGhost, { backgroundColor: COLORS.primary }]} onPress={reset} activeOpacity={0.85}>
              <Ionicons name="warning-outline" size={14} color="#FFFFFF" />
              <Text style={[styles.btnGhostText, { color: '#FFFFFF' }]}>Nova denúncia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={() => setTab('minhas')} activeOpacity={0.85}>
              <Ionicons name="list-outline" size={14} color={COLORS.text} />
              <Text style={styles.btnGhostText}>Ver minhas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
          <Text style={styles.headerEyebrow}>Área sem arborização?</Text>
          <Text style={styles.headerTitle}>Denúncias</Text>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, tab === 'nova' && styles.tabActive]}
              onPress={() => { setTab('nova'); setError(null); }}
            >
              <Text style={[styles.tabText, tab === 'nova' && styles.tabTextActive]}>Nova</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'minhas' && styles.tabActive]}
              onPress={() => { setTab('minhas'); setError(null); }}
            >
              <Text style={[styles.tabText, tab === 'minhas' && styles.tabTextActive]}>Minhas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {tab === 'nova' ? (
          <>
            <Text style={styles.introText}>
              A denúncia é encaminhada diretamente para as ONGs parceiras que atuam em Cidade Tiradentes.
            </Text>

            {/* Categoria */}
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
                    <Ionicons name={c.icon} size={17} color={category === c.key ? COLORS.primary : COLORS.text} />
                    <Text style={[styles.catText, category === c.key && styles.catTextActive]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Endereço */}
            <View>
              <Text style={styles.sectionLabel}>Rua (bairro opcional)</Text>
              <View style={styles.inputRow}>
                <Ionicons name="map-pin-outline" size={16} color={COLORS.primary} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ex.: Rua Iguaçu, 340 — Santa Etelvina"
                  placeholderTextColor={COLORS.faint}
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.locateBtn} onPress={useMyLocation} disabled={locating}>
                  {locating ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="locate" size={16} color={COLORS.primary} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Descrição */}
            <View>
              <Text style={styles.sectionLabel}>Descrição <Text style={{ fontWeight: '400', color: COLORS.muted, fontSize: 11 }}>(opcional)</Text></Text>
              <TextInput
                style={[styles.textarea]}
                placeholder="Descreva a situação…"
                placeholderTextColor={COLORS.faint}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Foto URL */}
            <View>
              <Text style={styles.sectionLabel}>Foto (URL) <Text style={{ fontWeight: '400', color: COLORS.muted, fontSize: 11 }}>(opcional)</Text></Text>
              <TextInput
                style={[styles.inputRow]}
                placeholder="https://…"
                placeholderTextColor={COLORS.faint}
                value={foto}
                onChangeText={setFoto}
                autoCapitalize="none"
              />
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="warning-outline" size={15} color={COLORS.error} style={styles.errorIcon} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, canSubmit ? styles.buttonPrimary : styles.buttonDisabled, !canSubmit && { opacity: 0.6 }]}
              onPress={submit}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              {sending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Enviar denúncia</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.body}>
            {loading ? (
              <LoadingView label="Carregando suas denúncias…" />
            ) : error && denuncias.length === 0 ? (
              <ErrorView message={error} onRetry={() => { setLoading(true); load(); }} />
            ) : myReports.length === 0 ? (
              <EmptyView
                icon="inbox-outline"
                title="Nenhuma denúncia ainda"
                hint="Suas denúncias vão aparecer aqui com o andamento."
              />
            ) : (
              <>
                <Text style={styles.sectionTitle}>{myReports.length} {myReports.length === 1 ? 'denúncia' : 'denúncias'}</Text>
                <FlatList
                  data={myReports}
                  keyExtractor={(item) => String(item.idDenuncia)}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardRow} activeOpacity={0.85}>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                        <Text style={styles.cardSub} numberOfLines={1}>
                          {item.area?.rua || item.area?.bairro || 'Cidade Tiradentes'} · {item.dataDenuncia}
                        </Text>
                      </View>
                      <StatusBadge color={denColor(item.statusDenuncia)} label={DEN_LABELS[item.statusDenuncia] ?? item.statusDenuncia} />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal nova denúncia (fluxo alternativo vindo do mapa) */}
      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.modalRoot}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>Nova denúncia</Text>
            <TouchableOpacity onPress={() => setModal(false)} hitSlop={12}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Tipo de ocorrência</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.cat, category === c.key && styles.catActive]}
                  onPress={() => setCategory(c.key)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={c.icon} size={17} color={category === c.key ? COLORS.primary : COLORS.text} />
                  <Text style={[styles.catText, category === c.key && styles.catTextActive]}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Área *</Text>
            <View style={styles.areaInputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Buscar rua ou bairro..."
                placeholderTextColor={COLORS.faint}
                value={areaQuery}
                onChangeText={setAreaQuery}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.locateBtn} onPress={useMyLocation} disabled={locating}>
                {locating ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="locate" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            </View>
            {areaOptions.map((a) => (
              <TouchableOpacity
                key={a.idArea}
                style={[styles.areaOpt, areaId === a.idArea && styles.areaOptActive]}
                onPress={() => setAreaId(a.idArea)}
                activeOpacity={0.85}
              >
                <Ionicons name={areaId === a.idArea ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={areaId === a.idArea ? COLORS.primary : COLORS.faint} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.areaOptTitle} numberOfLines={1}>{a.rua}</Text>
                  <Text style={styles.areaOptSub} numberOfLines={1}>{a.bairro} · {a.statusArea}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva a situação..."
              placeholderTextColor={COLORS.faint}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.send, sending && styles.sendDisabled]}
              onPress={submit}
              disabled={sending || !canSubmit}
            >
              {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Enviar denúncia</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
