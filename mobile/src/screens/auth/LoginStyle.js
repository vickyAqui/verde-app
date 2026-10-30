import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, shadow } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1 },

  hero: {
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: FONTS.display,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  title: {
    marginTop: 40,
    fontFamily: FONTS.display,
    fontSize: 32,
    fontWeight: '500',
    lineHeight: 35,
    letterSpacing: -0.6,
    color: COLORS.white,
  },
  titleAccent: { color: '#A7D7B8' },
  subtitle: {
    marginTop: 16,
    maxWidth: 320,
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.65)',
  },

  card: {
    marginHorizontal: 20,
    marginTop: -48,
    padding: 20,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: COLORS.white,
    ...shadow(10),
  },
  cardTitle: {
    marginBottom: 16,
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(179,64,42,0.25)',
    backgroundColor: COLORS.errorSoft,
  },
  errorText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.error,
  },

  submit: { marginTop: 16 },

  signup: {
    marginTop: 16,
    textAlign: 'center',
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.muted,
  },
  signupLink: { fontWeight: '700', color: COLORS.primary },

  footer: {
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 32,
    textAlign: 'center',
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.muted,
  },
  footerStrong: { color: COLORS.text, fontWeight: '600' },
});
