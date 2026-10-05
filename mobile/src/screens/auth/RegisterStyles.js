import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 30, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 15, color: COLORS.muted, marginTop: 4, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.muted, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 15, fontSize: 16, color: COLORS.text, marginBottom: 8,
  },
  button: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 12,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: COLORS.muted, textAlign: 'center', marginTop: 18, fontSize: 14 },
  linkBold: { color: COLORS.primary, fontWeight: 'bold' },
});
