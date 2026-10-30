import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { Card, Eyebrow, ErrorNote, Loading } from '../../components/ui';
import { COLORS, denColor, numFmt } from '../../theme';
import { styles } from './HomeStyle';

const MAP_BLOCKS = [
  { left: '2.9%', top: '4.7%', width: '17.6%', height: '26%', tone: 'base' },
  { left: '27%', top: '4.7%', width: '23.5%', height: '26%', tone: 'bad' },
  { left: '57.6%', top: '4.7%', width: '24.7%', height: '26%', tone: 'base' },
  { left: '2.9%', top: '38.8%', width: '17.6%', height: '27%', tone: 'base' },
  { left: '27%', top: '38.8%', width: '23.5%', height: '27%', tone: 'base' },
  { left: '57.6%', top: '38.8%', width: '24.7%', height: '27%', tone: 'warn' },
  { left: '2.9%', top: '73%', width: '17.6%', height: '24.7%', tone: 'bad' },
  { left: '27%', top: '73%', width: '23.5%', height: '24.7%', tone: 'base' },
  { left: '57.6%', top: '73%', width: '24.7%', height: '24.7%', tone: 'base' },
];

function CoverageMiniMap() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.mapGridLines}>
        <View style={[styles.mapVLine, { left: '23%' }]} />
        <View style={[styles.mapVLine, { left: '54%' }]} />
        <View style={[styles.mapVLine, { left: '86%' }]} />
        <View style={[styles.mapHLine, { top: '35%' }]} />
        <View style={[styles.mapHLine, { top: '69%' }]} />

        {MAP_BLOCKS.map((b, i) => (
          <View
            key={i}
            style={[
              styles.mapBlock,
              {
                left: b.left,
                top: b.top,
                width: b.width,
                height: b.height,
              },
              b.tone === 'bad' && styles.mapBlockBad,
              b.tone === 'warn' && styles.mapBlockWarn,
            ]}
          />
        ))}

        <View style={[styles.mapDotRing, { left: '34%', top: '12%' }]} />
        <View style={[styles.mapDot, { left: '38.8%', top: '17.6%' }]} />
        <View style={[styles.mapDot, { left: '9%', top: '82%' }]} />
        <View style={[styles.mapDot, { left: '68%', top: '50%' }]} />
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const areas = useFetch(() => api.get('/areas').then((r) => r.areas ?? []));
  const denuncias = useFetch(() =>
    api.get('/denuncias').then((r) => r.denuncias ?? []),
  );
  const ongs = useFetch(() => api.get('/ongs').then((r) => r.ongs ?? []));
  const projetos = useFetch(() =>
    api.get('/projetos').then((r) => r.projetos ?? []),
  );

  const areaList = areas.data ?? [];
  const denList = denuncias.data ?? [];
  const ongList = ongs.data ?? [];
  const projList = projetos.data ?? [];

  const firstLoad =
    areas.loading && denuncias.loading && ongs.loading && projetos.loading;
  const hasData =
    areas.data != null ||
    denuncias.data != null ||
    ongs.data != null ||
    projetos.data != null;

  const loading = areas.loading || denuncias.loading || ongs.loading || projetos.loading;
  const errored = areas.error || denuncias.error || ongs.error || projetos.error;

  const deficit = areaList.filter((a) => a.statusArea !== 'reflorestada').length;
  const abertas = denList.filter((d) => d.statusDenuncia !== 'resolvido');
  const firstName = user?.nome?.split(/\s+/)[0] ?? '';

  const reloadAll = useCallback(() => {
    areas.reload();
    denuncias.reload();
    ongs.reload();
    projetos.reload();
  }, [areas.reload, denuncias.reload, ongs.reload, projetos.reload]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    reloadAll();
    setRefreshing(false);
  }, [reloadAll]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.hello}>
              {firstName ? `Olá, ${firstName}` : 'Bem-vindo(a)'}
            </Text>
            <Text style={styles.title}>+Verde Cidade Tiradentes</Text>
          </View>
          <View style={styles.leafBadge}>
            <Ionicons name="leaf" size={18} color={COLORS.primary} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {firstLoad && !hasData ? (
          <Loading label="Carregando…" />
        ) : (
          <>
            {errored && (
              <ErrorNote
                message="Não foi possível carregar os dados."
                onRetry={reloadAll}
              />
            )}

            <LinearGradient
              colors={[COLORS.secondary, '#0E4C33', COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Eyebrow style={styles.heroEyebrow}>Como ajudar</Eyebrow>
              <Text style={styles.heroTitle}>
                Encontrou uma área sem árvores?
              </Text>
              <Text style={styles.heroText}>
                Registre em menos de um minuto. As ONGs parceiras recebem sua
                denúncia e agem no local.
              </Text>
              <TouchableOpacity
                style={styles.heroBtn}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Denunciar')}
              >
                <Ionicons name="warning" size={16} color="#0E4C33" />
                <Text style={styles.heroBtnText}>Denunciar agora</Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.statsRow}>
              <MiniStat icon="leaf" label="Áreas" value={numFmt(areaList.length)} />
              <MiniStat
                icon="warning"
                label="Abertas"
                value={numFmt(abertas.length)}
              />
              <MiniStat icon="people" label="ONGs" value={numFmt(ongList.length)} />
              <MiniStat
                icon="leaf"
                label="Projetos"
                value={numFmt(projList.length)}
              />
            </View>

            <TouchableOpacity
              style={styles.mapCard}
              activeOpacity={0.92}
              onPress={() => navigation.navigate('Mapa')}
            >
              <CoverageMiniMap />
              <LinearGradient
                colors={['transparent', 'rgba(11,33,22,0.45)', 'rgba(11,33,22,0.95)']}
                style={styles.mapOverlay}
              />

              <View style={styles.mapTop}>
                <View style={styles.chip}>
                  <Ionicons name="location" size={10} color={COLORS.white} />
                  <Text style={styles.chipText}>Cidade Tiradentes</Text>
                </View>
                {deficit > 0 && (
                  <View style={[styles.chip, styles.deficitChip]}>
                    <Ionicons
                      name="warning"
                      size={10}
                      color={COLORS.white}
                    />
                    <Text style={styles.chipText}>
                      {numFmt(deficit)} com déficit
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.mapBottom}>
                <View>
                  <Text style={styles.mapLabel}>Áreas mapeadas</Text>
                  <Text style={styles.mapNumber}>{numFmt(areaList.length)}</Text>
                  <Text style={styles.mapSub}>
                    {numFmt(deficit)} precisam de arborização
                  </Text>
                </View>
                <View style={styles.mapCta}>
                  <Text style={styles.mapCtaText}>Ver mapa</Text>
                  <Ionicons name="arrow-forward" size={13} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>

            {abertas.length > 0 && (
              <Card style={styles.alertsCard}>
                <View style={styles.alertsHeader}>
                  <Text style={styles.alertsTitle}>Alertas em aberto</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
                    <Text style={styles.alertsLink}>Ver todas</Text>
                  </TouchableOpacity>
                </View>

                {abertas.slice(0, 4).map((d, i) => (
                  <TouchableOpacity
                    key={d.idDenuncia}
                    style={[styles.alertRow, i > 0 && styles.alertRowBorder]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Mapa')}
                  >
                    <View
                      style={[
                        styles.alertDot,
                        { backgroundColor: denColor(d.statusDenuncia) },
                      ]}
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.alertItemTitle} numberOfLines={1}>
                        {d.titulo}
                      </Text>
                      <Text style={styles.alertItemSub} numberOfLines={1}>
                        {d.area?.rua || d.area?.bairro || 'Cidade Tiradentes'} ·{' '}
                        {d.dataDenuncia}
                      </Text>
                    </View>
                    <Text style={styles.alertStatus}>{d.statusDenuncia}</Text>
                  </TouchableOpacity>
                ))}
              </Card>
            )}

            <TouchableOpacity
              style={styles.education}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Educacao')}
            >
              <View style={styles.educationIcon}>
                <Ionicons name="book" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.educationTitle}>Educação Ambiental</Text>
                <Text style={styles.educationText}>
                  Artigos, vídeos e dados sobre a arborização.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={17} color={COLORS.muted} />
            </TouchableOpacity>

            {loading && !firstLoad && (
              <Text
                style={{
                  textAlign: 'center',
                  color: COLORS.faint,
                  fontSize: 11,
                }}
              >
                Atualizando dados…
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
