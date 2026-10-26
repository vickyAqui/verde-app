
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

const BG = COLORS.bg || '#F7F5EF';
const PRIMARY = COLORS.primary || '#166B44';
const SECONDARY = '#0C3322';
const TEXT = COLORS.text || '#1C241F';
const MUTED = COLORS.muted || '#5F6B64';
const FAINT = COLORS.faint || '#929B94';
const BORDER = 'rgba(20, 36, 27, 0.10)';
const CARD = '#FFFFFF';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Abas
  tabBar: {
    flexDirection: 'row',
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 8,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: PRIMARY,
  },

  tabText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '500',
  },

  tabTextActive: {
    color: SECONDARY,
    fontWeight: '700',
  },

  // Área principal
  content: {
    flex: 1,
    minHeight: 0,
  },

  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 24,
  },

  // Cartões de ONG
  card: {
    backgroundColor: CARD,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(20, 36, 27, 0.07)',
    marginBottom: 10,
    overflow: 'hidden',
  },

  cardMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    paddingBottom: 10,
    gap: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  cardInfo: {
    flex: 1,
    minWidth: 0,
  },

  ongHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 5,
  },

  cardTitle: {
    flex: 1,
    minWidth: 0,
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },

  followBtn: {
    minHeight: 27,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
  },

  followBtnInactive: {
    backgroundColor: CARD,
    borderColor: SECONDARY,
  },

  followBtnActive: {
    backgroundColor: SECONDARY,
    borderColor: SECONDARY,
  },

  followText: {
    fontSize: 10,
    fontWeight: '700',
  },

  followTextInactive: {
    color: SECONDARY,
  },

  followTextActive: {
    color: '#FFFFFF',
  },

  ongMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },

  metaText: {
    flex: 1,
    minWidth: 0,
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
  },

  cardDescription: {
    marginTop: 6,
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
  },

  // Rodapé separado: CNPJ e telefone
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FCFBF8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(20, 36, 27, 0.06)',
    gap: 8,
  },

  footerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },

  footerMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    minWidth: 0,
  },

  footerText: {
    flex: 1,
    minWidth: 0,
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    flexWrap: 'wrap',
  },

  expandBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Botão para criar projeto, abaixo das abas
  createProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 2,
    minHeight: 38,
    backgroundColor: PRIMARY,
    borderRadius: 9,
  },

  createProjectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  fabCreate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cartões de projeto
  projetoCard: {
    backgroundColor: CARD,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(20, 36, 27, 0.07)',
    padding: 13,
    marginBottom: 10,
  },

  projetoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  projetoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F1E9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  projetoInfo: {
    flex: 1,
    minWidth: 0,
  },

  projetoTitle: {
    color: TEXT,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },

  projetoOng: {
    marginTop: 3,
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
  },

  projetoPct: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 2,
  },

  projetoDesc: {
    marginTop: 12,
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
  },

  progressContainer: {
    marginTop: 12,
  },

  progressBar: {
    height: 4,
    backgroundColor: '#EEECE3',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },

  projetoMeta: {
    marginTop: 8,
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
  },

  // Modal de criação
  modalRoot: {
    flex: 1,
    backgroundColor: BG,
  },

  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  modalEyebrow: {
    color: MUTED,
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 5,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '700',
  },

  modalBody: {
    padding: 20,
  },

  label: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
  },

  modalInput: {
    minHeight: 46,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 13,
  },

  modalTextArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FCEBE7',
    borderRadius: 9,
    padding: 11,
    marginTop: 14,
  },

  errorText: {
    flex: 1,
    color: COLORS.error || '#B3402A',
    fontSize: 12,
    lineHeight: 17,
  },

  send: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    marginTop: 22,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 16,
  },

  sendDisabled: {
    opacity: 0.55,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
