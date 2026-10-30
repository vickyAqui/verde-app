import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { BackLink, Card, Eyebrow, TabBar } from '../../components/ui';
import { COLORS } from '../../theme';
import { styles } from './EducationStyle';

const TABS = [
  { key: 'artigos', label: 'Artigos' },
  { key: 'videos', label: 'Vídeos' },
  { key: 'dados', label: 'Curiosidades' },
];

const GRADIENT = ['#0C3322', '#0E4C33', '#166B44'];

const ARTICLES = [
  {
    id: 1,
    category: 'Benefícios',
    icon: 'cloud-outline',
    text: COLORS.primary,
    tint: COLORS.primarySoft,
    readTime: '4 min',
    title: 'Por que cada árvore equivale a 3 aparelhos de ar?',
    full: 'A evapotranspiração das árvores refresca o ambiente e reduz ilhas de calor urbanas em até 8°C. Em Cidade Tiradentes, onde a temperatura média no verão chega a 34°C, esse dado é crítico para a saúde de todos.',
  },
  {
    id: 2,
    category: 'Preservação',
    icon: 'leaf-outline',
    text: COLORS.success,
    tint: COLORS.successSoft,
    readTime: '3 min',
    title: 'Como denunciar o corte ilegal em São Paulo',
    full: 'Use o +Verde para registrar ocorrências diretamente com as ONGs parceiras. Você também pode acionar o canal 156 da Prefeitura de SP para crimes ambientais urbanos. Guarde fotos com data e localização.',
  },
  {
    id: 3,
    category: 'Dicas',
    icon: 'sunny-outline',
    text: COLORS.warning,
    tint: COLORS.warningSoft,
    readTime: '6 min',
    title: '5 espécies nativas ideais para calçadas',
    full: 'Ipê-amarelo, Quaresmeira, Embaúba, Pau-Jacaré e Ingá são espécies nativas adaptadas ao clima de SP. Elas exigem menos manutenção e oferecem mais benefícios ecológicos do que espécies exóticas.',
  },
  {
    id: 4,
    category: 'Dados',
    icon: 'water-outline',
    text: COLORS.info,
    tint: COLORS.infoSoft,
    readTime: '5 min',
    title: 'CT tem o menor índice arbóreo da capital',
    full: 'Com cobertura bem abaixo da recomendada pela OMS, Cidade Tiradentes precisa de ao menos 12 mil novas árvores. O bairro enfrenta temperaturas mais altas que a média e índices de enchente maiores do que as zonas arborizadas.',
  },
];

const VIDEOS = [
  {
    id: 1,
    title: 'Como plantar uma muda em 7 passos',
    duration: '8:24',
    views: '12 mil',
  },
  {
    id: 2,
    title: 'Cidade Tiradentes Verde: o projeto',
    duration: '14:02',
    views: '4,3 mil',
  },
  {
    id: 3,
    title: 'Benefícios da arborização urbana',
    duration: '5:47',
    views: '28 mil',
  },
];

const FACTS = [
  { value: '7×', desc: 'mais chuvas absorvidas em áreas arborizadas' },
  { value: '30%', desc: 'menos energia consumida com sombreamento' },
  { value: '8°C', desc: 'temperatura menor em ruas com árvores' },
];

export default function EducationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('artigos');
  const [reading, setReading] = useState(null);

  // ── Leitura de um artigo ──
  if (reading) {
    return (
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.readingScroll}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.readingHead,
              {
                backgroundColor: reading.tint,
                paddingTop: Math.max(insets.top, 12) + 12,
              },
            ]}
          >
            <BackLink onPress={() => setReading(null)} label="Voltar" />

            <View style={styles.readingTitleWrap}>
              <Eyebrow>
                {reading.category} · {reading.readTime} de leitura
              </Eyebrow>
              <Text style={styles.readingTitle}>{reading.title}</Text>
            </View>
          </View>

          <View style={styles.readingBody}>
            <Text style={styles.readingFull}>{reading.full}</Text>

            <View style={styles.helpBox}>
              <Text style={styles.helpTitle}>Você pode ajudar</Text>
              <Text style={styles.helpText}>
                Participe dos mutirões de plantio das ONGs parceiras na aba{' '}
                <Text style={styles.helpStrong}>ONGs e Projetos</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Lista (Artigos / Vídeos / Curiosidades) ──
  return (
    <View style={styles.root}>
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      >
        <BackLink onPress={() => navigation.goBack()} label="Voltar" />
        <Text style={styles.headerEyebrow}>Aprender para reflorestar</Text>

        <View style={styles.headerTitleRow}>
          <Ionicons name="book" size={19} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Educação Ambiental</Text>
        </View>

        <TabBar tabs={TABS} value={tab} onChange={setTab} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'artigos' &&
          ARTICLES.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => setReading(a)}
              activeOpacity={0.85}
            >
              <Card style={styles.articleCard}>
                <View style={[styles.articleIcon, { backgroundColor: a.tint }]}>
                  <Ionicons name={a.icon} size={19} color={a.text} />
                </View>
                <View style={styles.articleInfo}>
                  <Text style={[styles.articleCat, { color: a.text }]}>
                    {a.category}
                  </Text>
                  <Text style={styles.articleTitle}>{a.title}</Text>
                  <Text style={styles.articleMeta}>
                    {a.readTime} de leitura
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}

        {tab === 'videos' &&
          VIDEOS.map((v) => (
            <Card key={v.id} style={styles.videoCard}>
              <LinearGradient
                colors={GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.videoThumb}
              >
                <View style={styles.playBtn}>
                  <Ionicons
                    name="play"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginLeft: 2 }}
                  />
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{v.duration}</Text>
                </View>
              </LinearGradient>
              <View style={styles.videoBody}>
                <Text style={styles.videoTitle}>{v.title}</Text>
                <Text style={styles.videoMeta}>
                  {v.views} visualizações
                </Text>
              </View>
            </Card>
          ))}

        {tab === 'dados' && (
          <>
            <View style={styles.factsGrid}>
              {FACTS.map((f) => (
                <Card key={f.value} style={styles.factCard}>
                  <Text style={styles.factValue}>{f.value}</Text>
                  <Text style={styles.factDesc}>{f.desc}</Text>
                </Card>
              ))}
            </View>

            <LinearGradient
              colors={GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipGradient}
            >
              <Text style={styles.tipEyebrow}>Dica da semana</Text>
              <Text style={styles.tipText}>
                Ao podar uma árvore, nunca remova mais de 30% da copa. Podas
                severas estressam a planta e a deixam vulnerável a pragas.
              </Text>
            </LinearGradient>
          </>
        )}
      </ScrollView>
    </View>
  );
}
