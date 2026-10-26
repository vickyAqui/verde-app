import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // ── Cover ──
  cover: { paddingTop: 30, paddingHorizontal: 16, paddingBottom: 10 },
  coverContent: { paddingBottom: 12 },
  coverEyebrow: {
    fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase', letterSpacing: 0.16, marginBottom: 10,
  },
  coverRow: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
  },
  avatarCover: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarTextCover: { color: '#fff', fontSize: 22, fontWeight: '700' },
  adminLink: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 6,
  },
  adminLinkText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // ── Identidade ──
  identityCard: {
    marginTop: -10, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  nome: { fontFamily: 'Fraunces_600SemiBold', fontSize: 18, fontWeight: '700', color: COLORS.text },
  email: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  localPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, backgroundColor: '#F2F4F2', paddingHorizontal: 10, paddingVertical: 6,
    marginTop: 12, width: 'fit-content',
  },
  localText: { fontSize: 11, fontWeight: '600', color: COLORS.muted },
  statsGrid: { flexDirection: 'row', gap: 8, marginTop: 14 },
  statCard: {
    flex: 1, backgroundColor: '#F2F4F2', borderRadius: 12, paddingVertical: 10, alignItems: 'center',
  },
  statValue: { fontFamily: 'Fraunces_600SemiBold', fontSize: 20, fontWeight: '700', color: COLORS.text },
  statLabel: { fontSize: 10, fontWeight: '600', color: COLORS.muted, marginTop: 2 },

  // ── Seções ──
  sectionBlock: { paddingHorizontal: 16, marginTop: 18 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 0.14, marginBottom: 10,
  },
  centerPad: { paddingVertical: 24, alignItems: 'center' },
  emptyCard: {
    alignItems: 'center', paddingVertical: 22, backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  emptyIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0EDE3',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  emptyHint: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginTop: 4 },
  denunciaList: { gap: 8 },
  denunciaCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.06)',
  },
  denunciaInfo: { flex: 1 },
  denunciaTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  denunciaSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },

  // ── Cadastrar ONG ──
  ongCta: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(22, 107, 68, 0.08)', borderWidth: 1, borderColor: 'rgba(22, 107, 68, 0.2)',
    borderRadius: 14, padding: 12, marginHorizontal: 16, marginTop: 4, marginBottom: 4,
  },
  ongIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary },
  ongContent: { flex: 1, marginLeft: 10 },
  ongTitle: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  ongSubtitle: { marginTop: 2, color: COLORS.muted, fontSize: 12 },

  // ── Configurações ──
  configCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(20, 36, 27, 0.05)' },
  configItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderColor: 'rgba(20, 36, 27, 0.05)',
  },
  configIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F2F4F2', alignItems: 'center', justifyContent: 'center' },
  configText: { flex: 1 },
  configLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  configSub: { fontSize: 12, color: COLORS.muted, marginTop: 1 },

  // ── Logout ──
  logout: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(179, 64, 42, 0.2)',
    backgroundColor: 'rgba(179, 64, 42, 0.06)', paddingHorizontal: 14, paddingVertical: 11,
    marginHorizontal: 16, marginTop: 14,
  },
  logoutText: { fontSize: 14, color: COLORS.error, fontWeight: '700' },

  // ── Rodapé ──
  footer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24, alignItems: 'center' },
  footerText: { fontSize: 11, color: 'rgba(28, 36, 31, 0.5)', textAlign: 'center' },
});
