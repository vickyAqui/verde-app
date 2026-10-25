import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../theme.js';
import { uiStyles } from './uiStyles.js';

export function AppHeader({ title, subtitle, right }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        uiStyles.header,
        { paddingTop: Math.max(insets.top, 16) + 12 },
      ]}
    >
      <View style={{ flex: 1 }}>
        {subtitle ? (
          <Text style={uiStyles.eyebrow}>{subtitle}</Text>
        ) : null}

        <Text style={uiStyles.title}>{title}</Text>
      </View>

      {right}
    </View>
  );
}

export function LoadingView({ label = 'Carregando...' }) {
  return (
    <View style={uiStyles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={uiStyles.centerText}>{label}</Text>
    </View>
  );
}

export function ErrorView({
  message = 'Não foi possível carregar.',
  onRetry,
}) {
  return (
    <View style={uiStyles.center}>
      <View style={uiStyles.errorIcon}>
        <Ionicons
          name="alert-circle-outline"
          size={28}
          color={COLORS.error}
        />
      </View>

      <Text style={uiStyles.errorText}>{message}</Text>

      {onRetry ? (
        <TouchableOpacity
          style={uiStyles.retryBtn}
          onPress={onRetry}
        >
          <Text style={uiStyles.retryText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function EmptyView({
  icon = 'leaf-outline',
  title,
  hint,
  action,
}) {
  return (
    <View style={uiStyles.center}>
      <View style={uiStyles.emptyIcon}>
        <Ionicons
          name={icon}
          size={26}
          color={COLORS.muted}
        />
      </View>

      <Text style={uiStyles.emptyTitle}>{title}</Text>

      {hint ? (
        <Text style={uiStyles.emptyHint}>{hint}</Text>
      ) : null}

      {action}
    </View>
  );
}

export function StatusBadge({ color, label }) {
  return (
    <View style={[uiStyles.badge, { backgroundColor: color }]}>
      <Text style={uiStyles.badgeText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
