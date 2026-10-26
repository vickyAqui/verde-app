
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
  },

  intro: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F1E9',
    marginBottom: 12,
  },

  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1C241F',
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 6,
    color: '#5F6B64',
    fontSize: 13,
    lineHeight: 20,
  },

  label: {
    marginTop: 15,
    marginBottom: 7,
    color: '#1C241F',
    fontSize: 12,
    fontWeight: '700',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(20, 36, 27, 0.12)',
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    color: '#1C241F',
    fontSize: 13,
  },

  textArea: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#166B44',
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    marginTop: 22,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  cancel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 2,
  },

  cancelText: {
    color: '#5F6B64',
    fontSize: 13,
    fontWeight: '600',
  },
});
