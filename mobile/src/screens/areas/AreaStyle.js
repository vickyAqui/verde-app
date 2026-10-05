import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchBox: { paddingHorizontal: 16, paddingTop: 12 },
  search: {
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: COLORS.text, borderWidth: 1, borderColor: '#E5E7EB',
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
  cardInfo: { color: COLORS.muted, marginTop: 6, fontSize: 14 },
  cardMeta: { color: COLORS.primary, marginTop: 4, fontSize: 13, fontWeight: '600' },
});
