// Tema central do app +Verde (mobile). Importe daqui em vez de
// espalhar hex codes pelas screens.
export const COLORS = {
  primary: '#166B44',
  primaryDark: '#0C3322',
  bg: '#F7F5EF',
  card: '#FFFFFF',
  text: '#1C241F',
  muted: '#5F6B64',
  faint: '#89938C',
  border: 'rgba(20, 36, 27, 0.1)',
  error: '#B3402A',
  warning: '#C9731D',
  success: '#2E8B57',
  info: '#3B6E9F',
};

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

export const DEN_COLORS = {
  aberta: '#B3402A',
  'em tratamento': '#DB9E36',
  resolvido: '#2E8B57',
};

export const DEN_LABELS = {
  aberta: 'Aberta',
  'em tratamento': 'Em tratamento',
  resolvido: 'Resolvida',
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
  try { return (n ?? 0).toLocaleString('pt-BR'); } catch { return String(n ?? 0); }
}
