import { StyleSheet } from 'react-native';

export 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  fab: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  cardDescription: { color: COLORS.muted, marginTop: 6, fontSize: 14 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14, minWidth: 44, textAlign: 'right' },
  modalRoot: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 50 },
  modalHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  modalBody: { padding: 20 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: COLORS.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  send: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  sendDisabled: { opacity: 0.7 },
  sendText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ongName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
