import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // ── Cabeçalho ──
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerEyebrow: {
    marginTop: 10,
    marginBottom: 4,
    fontFamily: FONTS.display,
    fontStyle: 'italic',
    fontSize: 13,
    color: COLORS.muted,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 23,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: COLORS.text,
  },

  // ── Conteúdo ──
  content: { padding: 16, paddingBottom: 40, gap: 10 },

  // ── Artigos ──
  articleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  articleIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleInfo: { flex: 1, minWidth: 0 },
  articleCat: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  articleTitle: {
    marginTop: 4,
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    color: COLORS.text,
  },
  articleMeta: {
    marginTop: 6,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },

  // ── Vídeos ──
  videoCard: { overflow: 'hidden' },
  videoThumb: { height: 144, alignItems: 'center', justifyContent: 'center' },
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
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  videoBody: { paddingHorizontal: 16, paddingVertical: 12 },
  videoTitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  videoMeta: {
    marginTop: 2,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },

  // ── Curiosidades ──
  factsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  factCard: {
    flexBasis: '47%',
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  factValue: {
    fontFamily: FONTS.display,
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 32,
    color: COLORS.primary,
  },
  factDesc: {
    marginTop: 8,
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.muted,
  },
  tipGradient: { borderRadius: RADIUS.lg, padding: 16 },
  tipEyebrow: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.60)',
  },
  tipText: {
    marginTop: 8,
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.90)',
  },

  // ── Leitura de artigo ──
  readingScroll: { paddingBottom: 40 },
  readingHead: { paddingHorizontal: 20, paddingBottom: 32 },
  readingTitleWrap: { marginTop: 28, maxWidth: 320 },
  readingTitle: {
    marginTop: 12,
    fontFamily: FONTS.display,
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 33,
    letterSpacing: -0.4,
    color: COLORS.text,
  },
  readingBody: { paddingHorizontal: 20, paddingTop: 20 },
  readingFull: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    lineHeight: 26,
    color: 'rgba(28,36,31,0.80)',
  },
  helpBox: {
    marginTop: 24,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(22,107,68,0.15)',
    backgroundColor: 'rgba(22,107,68,0.07)',
    padding: 16,
  },
  helpTitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  helpText: {
    marginTop: 4,
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(28,36,31,0.75)',
  },
  helpStrong: {
    fontFamily: FONTS.sans,
    fontWeight: '700',
    color: COLORS.text,
  },
});
