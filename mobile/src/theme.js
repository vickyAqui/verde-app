// Tema central do app +Verde (mobile).
// Os tokens abaixo espelham a interface web (web/src/styles/theme.css)
// para que as telas nativas tenham a mesma linguagem visual.
import { Platform } from 'react-native';

export const COLORS = {
  // Base
  bg: '#F7F5EF',
  background: '#F7F5EF',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1C241F',
  foreground: '#1C241F',
  muted: '#5F6B64',
  faint: '#8A938D',
  border: 'rgba(20, 36, 27, 0.10)',
  borderSoft: 'rgba(20, 36, 27, 0.07)',

  // Marca
  primary: '#166B44',
  primaryDark: '#0C3322',
  primarySoft: 'rgba(22, 107, 68, 0.10)',
  onPrimary: '#F0F8F2',
  secondary: '#0C3322',
  onSecondary: '#D9EDE1',
  accent: '#DB9E36',

  // Estados
  warning: '#C9731D',
  warningSoft: 'rgba(201, 115, 29, 0.12)',
  success: '#2E8B57',
  successSoft: 'rgba(46, 139, 87, 0.12)',
  error: '#B3402A',
  errorSoft: 'rgba(179, 64, 42, 0.10)',
  info: '#3B6E9F',
  infoSoft: 'rgba(59, 110, 159, 0.10)',

  // Superfícies auxiliares
  mutedBg: '#F0EDE3',
  inputBg: 'rgba(240, 237, 227, 0.60)',
  white: '#FFFFFF',
  black: '#000000',
};

// DM Sans + Fraunces são as fontes da versão web. No nativo usamos as
// famílias de sistema equivalentes para não depender de download de fontes.
export const FONTS = {
  sans:
    Platform.OS === 'web'
      ? '"DM Sans", -apple-system, system-ui, sans-serif'
      : Platform.OS === 'ios'
        ? 'System'
        : 'sans-serif',
  display:
    Platform.OS === 'web'
      ? 'Fraunces, Georgia, "Times New Roman", serif'
      : Platform.OS === 'ios'
        ? 'Georgia'
        : 'serif',
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  full: 999,
};

export function shadow(elevation = 2) {
  return Platform.select({
    android: { elevation },
    ios: {
      shadowColor: '#14241B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    web: { boxShadow: '0 2px 12px rgba(20, 36, 27, 0.08)' },
    default: {},
  });
}

// ── Áreas ────────────────────────────────────────────────────────────────
export const AREA_COLORS = {
  identificada: '#B3402A',
  'em tratamento': '#DB9E36',
  reflorestada: '#2E8B57',
};

export const AREA_LABELS = {
  identificada: 'Déficit de arborização',
  'em tratamento': 'Em tratamento',
  reflorestada: 'Reflorestada',
};

export const AREA_STATUS = {
  identificada: { label: 'Déficit de arborização', color: COLORS.error },
  'em tratamento': { label: 'Em tratamento', color: COLORS.warning },
  reflorestada: { label: 'Reflorestada', color: COLORS.success },
};

// ── Denúncias ────────────────────────────────────────────────────────────
export const DEN_COLORS = {
  aberta: '#B3402A',
  'em tratamento': '#DB9E36',
  resolvido: '#2E8B57',
  resolvida: '#2E8B57',
};

export const DEN_LABELS = {
  aberta: 'Aberta',
  'em tratamento': 'Em tratamento',
  resolvido: 'Resolvida',
  resolvida: 'Resolvida',
};

export const DEN_STATUS = {
  aberta: { label: 'Aberta', color: COLORS.error },
  'em tratamento': { label: 'Em tratamento', color: COLORS.warning },
  resolvido: { label: 'Resolvida', color: COLORS.success },
  resolvida: { label: 'Resolvida', color: COLORS.success },
};

// ── ONGs ─────────────────────────────────────────────────────────────────
export const ONG_STATUS = {
  pendente: { label: 'Pendente', color: COLORS.warning },
  aprovada: { label: 'Aprovada', color: COLORS.success },
  rejeitada: { label: 'Rejeitada', color: COLORS.error },
};

export const CT_CENTER = { latitude: -23.569, longitude: -46.419 };

export const DEFAULT_RAIO = {
  identificada: 220,
  'em tratamento': 170,
  reflorestada: 280,
};

export function areaColor(status) {
  return AREA_COLORS[status] ?? '#6B7280';
}

export function denColor(status) {
  return DEN_COLORS[status] ?? '#6B7280';
}

export function raioOf(status, raio) {
  if (typeof raio === 'number' && Number.isFinite(raio) && raio > 0) return raio;
  return DEFAULT_RAIO[status] ?? 180;
}

/** Polígono pode vir como string JSON ou array. Retorna [[lat,lng],...] ou null. */
export function parsePoligono(raw) {
  if (!raw) return null;
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr) || arr.length < 3) return null;
    const clean = [];
    for (const p of arr) {
      if (!Array.isArray(p) || p.length < 2) return null;
      const lat = Number(p[0]);
      const lng = Number(p[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      clean.push({ latitude: lat, longitude: lng });
    }
    return clean;
  } catch {
    return null;
  }
}

export function fmtAreaM2(raioM) {
  const m2 = Math.PI * raioM * raioM;
  if (m2 >= 1000000) return `${(m2 / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km²`;
  if (m2 >= 10000) return `${(m2 / 10000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ha`;
  return `~${Math.round(m2).toLocaleString('pt-BR')} m²`;
}

export function numFmt(n) {
  return Number(n ?? 0).toLocaleString('pt-BR');
}

export function initials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function fmtDist(m) {
  if (m === null || m === undefined) return '';
  if (m < 1000) return `a ${Math.round(m)} m`;
  return `a ${(m / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
}
