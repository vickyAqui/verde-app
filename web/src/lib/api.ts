export type Usuario = {
  idUsuario: number;
  idNivel_Usuario: number;
  nome: string;
  email: string;
  cpf: string | null;
  dataNasc: Date | null 
};

export type Area = {
  idArea: number;
  cidade: string;
  bairro: string;
  rua: string;
  statusArea: string;
  latitude: number | null;
  longitude: number | null;
  raio?: number | null;
  poligono?: string | [number, number][] | null;
};

export type Denuncia = {
  idDenuncia: number;
  idUsuario: number;
  idArea: number;
  titulo: string;
  dataDenuncia: string;
  statusDenuncia: string;
  descricao: string | null;
  fotos: string[] | null;
  usuario?: Pick<Usuario, "idUsuario" | "nome">;
  area?: Pick<Area, "idArea" | "cidade" | "bairro" | "rua" | "latitude" | "longitude" | "raio" | "poligono" | "statusArea">;
};

export function getDenunciaFotos(denuncia: Pick<Denuncia, "fotos">): string[] {
  return denuncia.fotos?.filter((url) => typeof url === "string" && url.trim().length > 0) ?? [];
}

export type Ong = {
  idOng: number;
  idUsuario: number;
  nome: string;
  regiao: string;
  cnpj: string;
  telefone: string;
  descricao: string;
  statusOng: string;
  usuario?: Pick<Usuario, "idUsuario" | "nome" | "email">;
};

export type Projeto = {
  idProjeto: number;
  idUsuario: number;
  objetivo: string;
  descricao: string;
  percentualConclusao: number;
  ong?: Pick<Ong, "idOng" | "nome" | "regiao">
};

export type OngMembro = {
  idOng_Usuario: number;
  idOng: number;
  idUsuario: number;
  usuario?: Pick<Usuario, "idUsuario" | "nome" | "email">;
};

export type OngDashboard = {
  ong: Ong;
  stats: {
    totalProjetos: number;
    totalMembros: number;
    totalDenuncias: number;
    denunciasAbertas: number;
    percentualMedio: number;
  };
  projetos: Projeto[];
  membros: OngMembro[];
  denuncias: Denuncia[];
};

const API_BASE = "https://verde-app-backend.onrender.com/api"
const API_BASE_LOCAL = "http://localhost:3333/api"
const TOKEN_KEY = "@verde:token";
const USER_KEY = "@verde:user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

type StoredUser = { usuario: Usuario; tipo: "admin" | "comum" | "ong" };

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(data: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    delete headers["Content-Type"];
    requestBody = body;
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body);
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: requestBody,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* sem corpo */
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearAuth();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    const msg =
      data?.error ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      `Erro ${res.status}`;
    throw new ApiError(msg, res.status);
  }

  return data as T;
}

export const api = {
  get: <T = any>(path: string, params?: Record<string, string>) =>
    request<T>("GET", path, undefined, params),
  post: <T = any>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T = any>(path: string, body?: unknown) => request<T>("PUT", path, body),
  del: <T = any>(path: string) => request<T>("DELETE", path),
};
