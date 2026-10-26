import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 24 },

  // ── Cover ──
  cover: { position: 'relative', height: 160, paddingHorizontal: 16, paddingTop: 30 },
  coverContent: { paddingBottom: 12 },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  backText: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  coverTitle: { marginTop: 28 },
  coverEyebrow: {
    fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase', letterSpacing: 0.16, marginBottom: 6,
  },
  coverTitleText: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 22, fontWeight: '600',
    color: '#FFFFFF', letterSpacing: -0.3,
  },

  // ── Stats ──
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 10 },
  statCard: {
    flex: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center',
  },
  statValue: { fontFamily: 'Fraunces_600SemiBold', fontSize: 20, fontWeight: '700', color: COLORS.text },
  statLabel: { fontSize: 10, fontWeight: '600', color: COLORS.muted, marginTop: 2 },

  // ── Abas ──
  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(20, 36, 27, 0.06)',
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.bg,
  },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  tabTextActive: { color: COLORS.primary },

  // ── Blocos ──
  detailBlock: { paddingHorizontal: 16, paddingTop: 10 },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  overviewBlock: { paddingHorizontal: 16, paddingTop: 10 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12,
  },
  statOverview: {
    flex: 1, minWidth: '48%', flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff',
  },

  // ── Card ──
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginTop: 10,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  badgeWrap: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  cardMeta: { marginTop: 6 },
  metaText: { fontSize: 11, color: COLORS.muted },
  descBlock: { marginTop: 10 },
  descText: { fontSize: 13, color: COLORS.text, lineHeight: 19 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: 10, paddingVertical: 10,
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  // ── Listas ──
  denunciaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  denunciaInfo: { flex: 1, minWidth: 0 },
  denunciaTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  denunciaSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },

  ongRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  ongInfo: { flex: 1, minWidth: 0 },
  ongTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  ongSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },

  areaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  areaInfo: { flex: 1, minWidth: 0 },
  areaTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  areaSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },

  ongListRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(20, 36, 27, 0.05)',
  },
  ongListTitle: { fontSize: 13, color: COLORS.text },

  // ── Visão geral ──
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.14, marginBottom: 8 },
  sectionSub: { fontSize: 12, color: COLORS.muted, marginBottom: 10 },
  deficitRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(20, 36, 27, 0.05)',
  },
  deficitTitle: { fontSize: 13, color: COLORS.text },
  emptyHint: { fontSize: 12, color: COLORS.muted, textAlign: 'center', marginVertical: 10 },
});
