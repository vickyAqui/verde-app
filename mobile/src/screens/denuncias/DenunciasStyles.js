import {StyleSheet} from'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  fab: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,.22)',
    alignItems: 'center', justifyContent: 'center',
  },

  chips: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 16 },
  chip: { backgroundColor: '#E5E7EB', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  chipTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 4, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  cardInfo: { color: COLORS.primary, marginTop: 6, fontSize: 14, fontWeight: '600' },
  cardDesc: { color: COLORS.muted, marginTop: 4, fontSize: 14 },
  cardDate: { color: COLORS.faint, marginTop: 8, fontSize: 12 },
  cta: { marginTop: 14, backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  ctaText: { color: '#fff', fontWeight: 'bold' },
  modalRoot: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 50 },
  modalHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  modalBody: { padding: 20, paddingBottom: 48 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginTop: 12 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cat: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff',
  },
  catActive: { borderColor: COLORS.primary, backgroundColor: '#E3F2E9' },
  catText: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  catTextActive: { color: COLORS.primary },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: COLORS.text,
  },
  areaInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locBtn: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  areaOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 8,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  areaOptActive: { borderColor: COLORS.primary },
  areaOptTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  areaOptSub: { fontSize: 12, color: COLORS.muted },
  send: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  sendDisabled: { opacity: 0.7 },
  sendText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
