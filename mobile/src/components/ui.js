import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, shadow } from '../theme';

// ── Estrutura ────────────────────────────────────────────────────────────
export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Eyebrow({ children, style }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

/**
 * Cabeçalho de tela. `subtitle` vira o "eyebrow" em itálico (Fraunces),
 * igual ao cabeçalho das telas web.
 */
export function AppHeader({ title, subtitle, right, icon, children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          {subtitle ? <Text style={styles.headerEyebrow}>{subtitle}</Text> : null}
          <View style={styles.headerTitleRow}>
            {icon ? <Ionicons name={icon} size={19} color={COLORS.primary} style={styles.headerIcon} /> : null}
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

export function BackLink({ onPress, label = 'Voltar', color = COLORS.muted }) {
  return (
    <TouchableOpacity style={styles.backLink} onPress={onPress} hitSlop={8} activeOpacity={0.7}>
      <Ionicons name="arrow-back" size={15} color={color} />
      <Text style={[styles.backLinkText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function TabBar({ tabs, value, onChange, style }) {
  return (
    <View style={[styles.tabs, style]}>
      {tabs.map((tab) => {
        const active = value === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function SectionLabel({ children, style }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

// ── Formulários ──────────────────────────────────────────────────────────
export function Field({ label, hint, children, style }) {
  return (
    <View style={[styles.field, style]}>
      {label ? (
        <Text style={styles.fieldLabel}>
          {label}
          {hint ? <Text style={styles.fieldHint}> {hint}</Text> : null}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function Input({ icon, multiline, style, inputStyle, ...props }) {
  return (
    <View style={[styles.inputWrap, multiline && styles.inputWrapMulti, style]}>
      {icon ? <Ionicons name={icon} size={16} color={COLORS.primary} style={styles.inputIcon} /> : null}
      <TextInput
        style={[styles.input, multiline && styles.inputMulti, inputStyle]}
        placeholderTextColor={COLORS.faint}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
}

export function SearchField({ value, onChangeText, placeholder, style }) {
  return (
    <View style={[styles.search, style]}>
      <Ionicons name="search" size={15} color={COLORS.muted} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.faint}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={16} color={COLORS.faint} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── Botões ───────────────────────────────────────────────────────────────
const BUTTON_VARIANTS = {
  primary: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, text: COLORS.onPrimary },
  secondary: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary, text: COLORS.onSecondary },
  white: { backgroundColor: COLORS.white, borderColor: COLORS.white, text: COLORS.primaryDark },
  outline: { backgroundColor: 'transparent', borderColor: COLORS.border, text: COLORS.text },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent', text: COLORS.muted },
  soft: { backgroundColor: COLORS.primarySoft, borderColor: 'transparent', text: COLORS.primary },
  warning: { backgroundColor: COLORS.warning, borderColor: COLORS.warning, text: COLORS.white },
  success: { backgroundColor: COLORS.success, borderColor: COLORS.success, text: COLORS.white },
  error: { backgroundColor: COLORS.error, borderColor: COLORS.error, text: COLORS.white },
  errorSoft: { backgroundColor: COLORS.errorSoft, borderColor: 'rgba(179,64,42,0.20)', text: COLORS.error },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  iconRight,
  style,
  textStyle,
  compact,
}) {
  const palette = BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.primary;
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        compact && styles.buttonCompact,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.text} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={16} color={palette.text} /> : null}
          <Text style={[styles.buttonText, { color: palette.text }, textStyle]}>{label}</Text>
          {iconRight ? <Ionicons name={iconRight} size={16} color={palette.text} /> : null}
        </>
      )}
    </TouchableOpacity>
  );
}

// ── Estados ──────────────────────────────────────────────────────────────
export function StatusBadge({ status, map, color, label }) {
  const cfg = map && status ? map[status] : null;
  const bg = color ?? cfg?.color ?? COLORS.muted;
  const text = label ?? cfg?.label ?? status ?? '—';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

export function Loading({ label = 'Carregando…' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="small" color={COLORS.primary} />
      <Text style={styles.centerText}>{label}</Text>
    </View>
  );
}

export function EmptyState({ icon = 'leaf-outline', title, hint, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={20} color={COLORS.muted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {hint ? <Text style={styles.emptyHint}>{hint}</Text> : null}
      {action}
    </View>
  );
}

export function ErrorNote({ message = 'Não foi possível carregar os dados.', onRetry }) {
  return (
    <View style={styles.errorNote}>
      <Ionicons name="warning-outline" size={17} color={COLORS.error} style={styles.errorIcon} />
      <View style={styles.errorBody}>
        <Text style={styles.errorText}>{message}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} hitSlop={8}>
            <Text style={styles.errorRetry}>Tentar novamente</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// ── Aliases mantidos para telas antigas ─────────────────────────────────
export const LoadingView = Loading;
export const ErrorView = ({ message, onRetry }) => <ErrorNote message={message} onRetry={onRetry} />;
export const EmptyView = EmptyState;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    ...shadow(1),
  },

  eyebrow: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  headerText: { flex: 1, minWidth: 0 },
  headerEyebrow: {
    fontFamily: FONTS.display,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.muted,
    marginBottom: 3,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: 8 },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: COLORS.text,
  },

  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 2 },
  backLinkText: { fontFamily: FONTS.sans, fontSize: 13, fontWeight: '600' },

  tabs: { flexDirection: 'row', marginTop: 12 },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontFamily: FONTS.sans, fontSize: 14, fontWeight: '500', color: COLORS.muted },
  tabTextActive: { fontWeight: '700', color: COLORS.text },

  sectionLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },

  field: { marginBottom: 12 },
  fieldLabel: { fontFamily: FONTS.sans, fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 7 },
  fieldHint: { fontWeight: '400', color: COLORS.faint },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.card,
  },
  inputWrapMulti: { alignItems: 'flex-start', paddingVertical: 10, minHeight: 86 },
  inputIcon: { marginTop: 1 },
  input: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 10,
  },
  inputMulti: { minHeight: 64, paddingVertical: 0, lineHeight: 20 },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 12,
    minHeight: 42,
  },
  searchIcon: {},
  searchInput: { flex: 1, fontFamily: FONTS.sans, fontSize: 14, color: COLORS.text, paddingVertical: 8 },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  buttonCompact: { minHeight: 34, paddingHorizontal: 12, borderRadius: RADIUS.full },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { fontFamily: FONTS.sans, fontSize: 14, fontWeight: '700' },

  badge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
    maxWidth: 150,
  },
  badgeText: { fontFamily: FONTS.sans, fontSize: 11, fontWeight: '700', color: COLORS.white },

  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 56, paddingHorizontal: 24 },
  centerText: { marginTop: 10, fontFamily: FONTS.sans, fontSize: 14, color: COLORS.muted },

  empty: { alignItems: 'center', paddingHorizontal: 28, paddingVertical: 44 },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.mutedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { fontFamily: FONTS.sans, fontSize: 14, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  emptyHint: {
    marginTop: 4,
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    textAlign: 'center',
  },

  errorNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 4,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(179,64,42,0.25)',
    backgroundColor: COLORS.errorSoft,
  },
  errorIcon: { marginTop: 1 },
  errorBody: { flex: 1 },
  errorText: { fontFamily: FONTS.sans, fontSize: 13, lineHeight: 19, color: COLORS.error },
  errorRetry: {
    marginTop: 6,
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export { styles as uiStyles };
