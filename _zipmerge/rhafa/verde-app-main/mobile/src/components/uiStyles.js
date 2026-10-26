import { StyleSheet } from 'react-native';
import { COLORS } from '../theme.js';

export const uiStyles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.bg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },

  eyebrow: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 4,
  },

  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 25,
    fontWeight: '600',
    color: COLORS.text,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  centerText: {
    marginTop: 12,
    color: COLORS.muted,
    fontSize: 15,
  },

  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    marginTop: 12,
    color: COLORS.error,
    fontSize: 15,
    textAlign: 'center',
  },

  retryBtn: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  emptyHint: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
  },

  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 140,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
