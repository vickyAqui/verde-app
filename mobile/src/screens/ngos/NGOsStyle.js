import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#E3F2E9', alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  cardDescription: { color: COLORS.muted, marginTop: 4, fontSize: 14 },
  info: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  infoText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },
});
