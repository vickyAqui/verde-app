import { StyleSheet } from 'react-native';

export 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingTop: 70, paddingBottom: 28, backgroundColor: COLORS.primary },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,.22)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: '#D8F3DC', marginTop: 2 },
  rolePill: {
    marginTop: 10, backgroundColor: 'rgba(255,255,255,.22)',
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6,
  },
  roleText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  stats: { flexDirection: 'row', gap: 12, padding: 16 },
  stat: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 18,
    alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
  },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  menu: { paddingHorizontal: 16, gap: 8 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
  },
  menuText: { flex: 1, fontSize: 14, color: COLORS.text },
  logout: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 4,
  },
  logoutText: { fontSize: 16, color: COLORS.error, fontWeight: '600' },
  ongCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2E9',
    borderWidth: 1,
    borderColor: '#B7DEC4',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  ongIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ongContent: {
    flex: 1,
    marginLeft: 12,
  },
  ongTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  ongSubtitle: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 12,
  },
});
