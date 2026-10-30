import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, shadow } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingBottom: 32 },

  header: { paddingHorizontal: 20, paddingBottom: 4 },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: FONTS.display,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },

  title: {
    marginTop: 20,
    fontFamily: FONTS.display,
    fontSize: 27,
    fontWeight: '500',
    lineHeight: 31,
    letterSpacing: -0.4,
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: COLORS.white,
    ...shadow(4),
  },
  row: { flexDirection: 'row', gap: 12 },
  rowItem: { flex: 1 },

  label: {
    marginBottom: 7,
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
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

  loginText: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.muted,
  },
  loginLink: { fontWeight: '700', color: COLORS.primary },
});
