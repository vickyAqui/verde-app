import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../../theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // ── Capa ──
  cover: { paddingHorizontal: 20, paddingBottom: 20 },
  coverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  coverTitleWrap: { alignItems: 'flex-end' },
  coverEyebrow: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  },
  coverTitle: {
    fontFamily: FONTS.display,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },

  statsSkeleton: {
    height: 56,
    marginTop: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  statValue: {
    fontFamily: FONTS.display,
    fontSize: 23,
    fontWeight: '600',
    lineHeight: 26,
  },
  statLabel: {
    marginTop: 2,
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.60)',
  },

  // ── Abas ──
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: COLORS.bg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabTextActive: { color: COLORS.primary },

  content: { padding: 16, paddingBottom: 36 },

  // ── Detalhes ──
  detail: { gap: 12 },
  detailCard: { padding: 16 },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  detailTitleWrap: { flex: 1, minWidth: 0 },
  detailTitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  metaText: {
    flexShrink: 1,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  descBox: {
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(240,237,227,0.50)',
  },
  descText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },
  actions: { gap: 8 },

  // ── Listas ──
  list: { gap: 8 },
  countLabel: { marginBottom: 2 },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDot: { width: 8, height: 8, borderRadius: 4 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
  },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowSub: {
    marginTop: 2,
    flexShrink: 1,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  emptyCard: { padding: 16, alignItems: 'center' },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },

  // ── Visão geral ──
  overview: { gap: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  overviewStat: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: RADIUS.lg,
  },
  overviewValue: {
    fontFamily: FONTS.display,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    color: COLORS.text,
  },
  overviewLabel: {
    marginTop: 3,
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.muted,
  },
  overviewCard: { padding: 16 },
  overviewTitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  overviewSub: {
    marginTop: 2,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  overviewList: { marginTop: 10 },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 10,
  },
  inlineRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inlineText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.muted,
  },
});
