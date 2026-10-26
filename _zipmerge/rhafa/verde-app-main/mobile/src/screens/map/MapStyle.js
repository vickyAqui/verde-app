import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // ── Cabeçalho ──
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 36, 27, 0.06)',
  },
  headerText: { gap: 2 },
  headerEyebrow: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 0.14, fontStyle: 'italic',
  },
  headerTitle: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 22, fontWeight: '600',
    color: COLORS.text,
  },
  searchWrap: {
    marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.07)',
    backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 11,
  },
  searchInput: {
    flex: 1, fontSize: 13, color: COLORS.text,
    backgroundColor: 'transparent',
  },

  // ── Camada + filtros ──
  layerBar: {
    paddingHorizontal: 16, paddingVertical: 8, marginBottom: 4,
    backgroundColor: COLORS.bg,
  },
  layerToggle: {
    flexDirection: 'row', gap: 6, marginBottom: 8,
  },
  layerTab: {
    flex: 1, alignItems: 'center', paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.07)',
    backgroundColor: '#FFFFFF',
  },
  layerTabActive: {
    borderColor: COLORS.primary, backgroundColor: 'rgba(22, 107, 68, 0.1)',
  },
  layerTabText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  layerTabTextActive: { color: COLORS.primary },

  filterChips: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: 'rgba(242, 244, 242, 0.7)', borderWidth: 1,
    borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  chipActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  chipTextActive: { color: '#FFFFFF' },

  // ── Mapa ──
  mapWrap: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  topBar: { position: 'absolute', right: 12, top: 54, gap: 8 },
  sideBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 5, elevation: 4,
  },
  userPill: {
    position: 'absolute', left: 12, top: 112,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  userPillDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' },
  userPillText: { fontSize: 11, fontWeight: '700', color: COLORS.text },

  legend: {
    position: 'absolute', left: 12, bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 8,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, fontWeight: '700', color: COLORS.text },
  legendCount: { fontSize: 11, fontWeight: '800', color: COLORS.primary, marginLeft: 8 },

  locError: {
    position: 'absolute', left: 12, right: 12, bottom: 88,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(179, 64, 42, 0.1)', borderWidth: 1,
    borderColor: 'rgba(179, 64, 42, 0.25)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  locErrorText: { fontSize: 11, color: COLORS.error, fontWeight: '600' },

  unmapped: {
    position: 'absolute', left: 12, right: 12, bottom: 88,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(201, 115, 29, 0.1)', borderWidth: 1,
    borderColor: 'rgba(201, 115, 29, 0.25)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  unmappedText: { fontSize: 11, color: COLORS.warning, fontWeight: '600' },

  pin: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 3, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, elevation: 4,
  },
  userPin: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: '#2563EB',
    borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, elevation: 4,
  },

  // ── Lista ──
  listContainer: {
    paddingHorizontal: 16, paddingBottom: 24, backgroundColor: COLORS.bg,
  },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 0.14,
  },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapLinkText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  listContent: { paddingBottom: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  rowActive: {
    borderColor: 'rgba(22, 107, 68, 0.3)', backgroundColor: 'rgba(22, 107, 68, 0.04)',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  rowSub: {
    fontSize: 11, color: COLORS.muted, marginTop: 2, flex: 1, flexWrap: 'wrap',
  },
  rowSubMuted: { color: COLORS.muted },
  rowDist: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  // ── Cartão selecionado ──
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18,
    padding: 16, paddingBottom: 34,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 12,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetDot: { width: 10, height: 10, borderRadius: 5 },
  sheetInfo: { flex: 1 },
  sheetTitle: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.12 },
  sheetSub: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  sheetMeta: { fontSize: 11, color: COLORS.muted, marginTop: 6 },
  sheetBtn: {
    marginTop: 12, backgroundColor: COLORS.primary, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', paddingVertical: 12,
  },
  sheetBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
