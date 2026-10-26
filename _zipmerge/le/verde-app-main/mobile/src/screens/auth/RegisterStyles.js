
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF',
  },

  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // Cabeçalho
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 20,
  },

  backText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 16,
  },

  logo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandTitle: {
    color: COLORS.text,
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    color: COLORS.text,
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    letterSpacing: -0.4,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  // Cartão do formulário
  formArea: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },

  form: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(20,36,27,0.05)',
    padding: 16,
    shadowColor: '#0C3322',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },

  field: {
    marginBottom: 9,
  },

  label: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 5,
  },

  input: {
    minHeight: 40,
    backgroundColor: '#F5F3ED',
    borderWidth: 1,
    borderColor: 'rgba(20,36,27,0.04)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.text,
  },

  // CPF e nascimento na mesma linha
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },

  halfField: {
    flex: 1,
    minWidth: 0,
  },

  dateInput: {
    minHeight: 40,
    backgroundColor: '#F5F3ED',
    borderWidth: 1,
    borderColor: 'rgba(20,36,27,0.04)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 11,
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
    marginTop: 8,
  },

  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 17,
  },

  button: {
    minHeight: 41,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
