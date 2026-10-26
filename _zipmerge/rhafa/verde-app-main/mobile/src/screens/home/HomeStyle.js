import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Cabeçalho ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },

  headerEyebrow: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },

  headerTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: COLORS.text,
    marginTop: 2,
  },

  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,107,68,0.1)',
  },

  // ── Conteúdo ──
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 14,
  },

  // ── Cartão principal (CTA) ──
  cta: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },

  eyebrow: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  ctaTitle: {
    color: '#FFFFFF',
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 23,
    fontWeight: '600',
    lineHeight: 27,
    letterSpacing: -0.3,
    marginTop: 8,
  },

  ctaSub: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },

  ctaButtonText: {
    color: '#0E4C33',
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Números ──
  stats: {
    flexDirection: 'row',
    gap: 8,
  },

  stat: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(20,36,27,0.06)',
    paddingVertical: 12,
    paddingHorizontal: 2,
    alignItems: 'center',
    gap: 4,
  },

  statNumber: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    color: COLORS.text,
  },

  statLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 10,
    color: COLORS.muted,
    textAlign: 'center',
  },

  // ── Cartões ──
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  cardHeaderTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },

  cardHeaderLink: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── Alertas em aberto ──
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  alertRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  alertInfo: {
    flex: 1,
    minWidth: 0,
  },

  alertTitle: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },

  alertSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },

  alertStatus: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.muted,
    textTransform: 'capitalize',
  },

  // ── Educação Ambiental ──
  eduCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  eduIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,107,68,0.1)',
  },

  eduInfo: {
    flex: 1,
  },

  eduTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  eduSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
    marginTop: 2,
  },
});
