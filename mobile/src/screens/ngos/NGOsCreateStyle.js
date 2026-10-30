import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  eyebrow: {
    marginTop: 10,
    marginBottom: 3,
    fontFamily: FONTS.display,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.muted,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 23,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: COLORS.text,
  },

  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  intro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(22,107,68,0.05)',
  },
  introText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
  },

  textAreaInput: { minHeight: 88, lineHeight: 20 },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(179,64,42,0.25)',
    backgroundColor: COLORS.errorSoft,
  },
  errorText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.error,
  },

  submit: { marginTop: 8 },

  cancel: { alignItems: 'center', paddingVertical: 14 },
  cancelText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
  },

  successRoot: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 32,
    backgroundColor: COLORS.bg,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successSoft,
  },
  successTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
  },
  successSub: {
    marginTop: 8,
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: COLORS.muted,
  },
});
