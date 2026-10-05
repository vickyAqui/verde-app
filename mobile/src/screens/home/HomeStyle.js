import {StyleSheet} from'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  body: { padding: 16, paddingBottom: 32 },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 18,
  },
  ctaTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ctaSub: { color: '#D8F3DC', fontSize: 13, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 14 },
  stat: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', gap: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.muted },
  alert: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FDECEA', borderRadius: 12, padding: 14, marginTop: 14,
  },
  alertText: { flex: 1, color: COLORS.error, fontSize: 14, fontWeight: '600' },
  mapCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginTop: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  mapTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  mapSub: { fontSize: 13, color: COLORS.muted, marginTop: 1 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  rowSub: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  empty: { color: COLORS.faint, textAlign: 'center', padding: 20 },
});
