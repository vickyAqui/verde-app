import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  mapWrap: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  topBar: { position: 'absolute', top: 54, left: 12, right: 12 },
  chips: { flexDirection: 'row', gap: 6 },
  chip: {
    backgroundColor: 'rgba(255,255,255,.95)', borderRadius: 18,
    paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  chipTextActive: { color: '#fff' },
  sideBtns: { position: 'absolute', right: 12, top: 110, gap: 8 },
  sideBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 4,
  },
  legend: {
    position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,.95)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontWeight: '600', color: COLORS.text },
  legendCount: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  loadingPill: {
    position: 'absolute', top: 110, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, elevation: 3,
  },
  loadingText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  pin: {
    width: 26, height: 26, borderRadius: 13, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, elevation: 4,
  },
  sheet: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', padding: 14, paddingHorizontal: 16,
    borderTopLeftRadius: 18, borderTopRightRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 8,
  },
  sheetDot: { width: 12, height: 12, borderRadius: 6 },
  sheetTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  sheetSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  sheetBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  sheetBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  hint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#fff', padding: 12,
  },
  hintText: { fontSize: 13, color: COLORS.muted },
});
