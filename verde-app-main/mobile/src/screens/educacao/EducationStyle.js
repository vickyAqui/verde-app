import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Cabeçalho ──
  header: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  backText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },

  headerEyebrow: {
    fontFamily: 'Fraunces_600SemiBold',
    fontStyle: 'italic',
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
  },

  // ── Abas ──
  tabs: {
    flexDirection: 'row',
    marginTop: 12,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: COLORS.primary,
  },

  tabText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.muted,
  },

  tabTextActive: {
    fontFamily: 'DMSans_600SemiBold',
    fontWeight: '600',
    color: COLORS.text,
  },

  // ── Conteúdo ──
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },

  // ── Artigos ──
  articleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  articleIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  articleInfo: {
    flex: 1,
    minWidth: 0,
  },

  articleCat: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  articleTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    color: COLORS.text,
    marginTop: 4,
  },

  articleMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },

  // ── Vídeos ──
  videoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },

  videoThumb: {
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
  },

  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  durationBadge: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  durationText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },

  videoBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  videoTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  videoMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },

  // ── Curiosidades ──
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  factCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  factValue: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 32,
    color: COLORS.primary,
  },

  factDesc: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
    marginTop: 8,
  },

  tipGradient: {
    borderRadius: 16,
    padding: 16,
  },

  tipEyebrow: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  tipText: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },

  // ── Leitura de artigo ──
  readingScroll: {
    paddingBottom: 40,
  },

  readingHead: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  readingTitleWrap: {
    marginTop: 28,
    maxWidth: 320,
  },

  eyebrow: {
    color: COLORS.muted,
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  readingTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 33,
    letterSpacing: -0.4,
    color: COLORS.text,
    marginTop: 12,
  },

  readingBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  readingFull: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 26,
    color: 'rgba(28,36,31,0.8)',
  },

  helpBox: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(22,107,68,0.15)',
    backgroundColor: 'rgba(22,107,68,0.07)',
    padding: 16,
  },

  helpTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  helpText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(28,36,31,0.75)',
    marginTop: 4,
  },

  helpStrong: {
    fontFamily: 'DMSans_700Bold',
    fontWeight: '700',
    color: COLORS.text,
  },
});
