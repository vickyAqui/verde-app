
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  hero: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 76,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandTitle: {
    color: '#FFFFFF',
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },

  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 35,
    letterSpacing: -0.5,
    marginTop: 28,
  },

  heroHighlight: {
    color: '#A7D7B8',
  },

  heroSubtitle: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    maxWidth: 310,
  },

  // Área do formulário
  formArea: {
    paddingHorizontal: 20,
    marginTop: -48,
  },

  form: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(20,36,27,0.06)',
    padding: 16,
    shadowColor: '#0C3322',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 5,
  },

  formTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 14,
  },

  field: {
    marginBottom: 10,
  },

  label: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 5,
  },

  inputContainer: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3ED',
    borderWidth: 1,
    borderColor: 'rgba(20,36,27,0.04)',
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  inputIcon: {
    marginRight: 9,
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 0,
    fontSize: 12,
    color: COLORS.text,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: '#FBEAE5',
    borderColor: 'rgba(179,64,42,0.25)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },

  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 17,
  },

  button: {
    minHeight: 42,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  link: {
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 11,
  },

  linkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Rodapé da página
  footer: {
    paddingHorizontal: 30,
    paddingTop: 18,
    paddingBottom: 12,
    alignItems: 'center',
  },

  footerText: {
    color: COLORS.muted,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
  },

  footerHighlight: {
    color: COLORS.text,
    fontWeight: '500',
  },
});
