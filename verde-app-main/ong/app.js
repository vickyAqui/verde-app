const API_URL = '/api';

const state = {
  token: localStorage.getItem('verde_ong_token') || null,
  usuario: null,
  view: 'dashboard',
};

const $ = (sel) => document.querySelector(sel);

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(String(value).replace(/-/g, '/'));
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('pt-BR');
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '-';
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

function initials(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  return ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro na requisição');
  }

  return res.json();
}

/* ---------- Login ---------- */
function showLogin() {
  state.token = null;
  state.usuario = null;
  localStorage.removeItem('verde_ong_token');
  $('#view-app').classList.add('hidden');
  $('#view-login').classList.remove('hidden');
}

function showApp() {
  $('#view-login').classList.add('hidden');
  $('#view-app').classList.remove('hidden');
  navigate('dashboard');
}

async function handleLogin(e) {
  e.preventDefault();
  const errorEl = $('#login-error');
  const btn = $('#login-btn');
  errorEl.classList.add('hidden');

  const email = $('#login-email').value.trim();
  const senha = $('#login-senha').value;

  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });

    if (data.tipo !== 'ong' && data.tipo !== 'comum') {
      errorEl.textContent = 'Acesso restrito: apenas ongs e usuários comuns podem entrar.';
      errorEl.classList.remove('hidden');
      return;
    }

    state.token = data.token;
    state.usuario = data.usuario || null;
    localStorage.setItem('verde_ong_token', data.token);
    showApp();
  } catch (err) {
    errorEl.textContent = err.message || 'Não foi possível entrar.';
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
}

function logout() {
  showLogin();
}

/* ---------- Navegação ---------- */
function navigate(view) {
  state.view = view;

  document.querySelectorAll('.nav-link').forEach((el) => {
    el.classList.toggle('active', el.dataset.view === view);
  });

  document.querySelectorAll('.page').forEach((el) => {
    el.classList.toggle('active', el.id === `view-${view}`);
  });

  const titles = {
    dashboard: 'Dashboard',
    usuarios: 'Meus dados',
    campanhas: 'Denúncias',
    projetos: 'Projetos',
  };
  $('#page-title').textContent = titles[view];

  if (view === 'dashboard') loadDashboard();
  if (view === 'usuarios') loadUsuarios();
  if (view === 'campanhas') loadDenuncias();
  if (view === 'projetos') loadProjetos();
  if (view === 'cadastro') showCadastroOng();
}

/* ---------- Dashboard ---------- */
async function loadDashboard() {
  try {
    const [areasRes, denunciasRes, ongsRes, projetosRes, followingRes] = await Promise.all([
      api('/areas'),
      api('/denuncias'),
      api('/ongs'),
      api('/projetos'),
      api('/ongs/following'),
    ]);

    const areas = areasRes.areas || [];
    const denuncias = denunciasRes.denuncias || [];
    const ongs = ongsRes.ongs || [];
    const projetos = projetosRes.projetos || [];
    const ongsSeguidas = followingRes.ongs || [];
    const ongDaSessao = ongsSeguidas[0];

    /*------ Projetos criados pelas ONGs que esta ONG acompanha ------------*/
    const ongIds = new Set(ongsSeguidas.map((o) => String(o.idOng)));
    const projetosDaOng = projetos.filter((p) =>
      ongIds.has(String(p.ong?.idOng))
    );

    const membrosRes = await api(`/ongs/${ongDaSessao.idOng}/membros`);

    // Denúncias em aberto apenas deste usuário (esta ONG)
    const denunciasAbertasDoUsuario = denuncias.filter(
      (d) => d.statusDenuncia === 'aberta' && d.usuario?.idUsuario === state.usuario?.idUsuario
    );

    $('#stat-membros').textContent = membrosRes.membros.length;
    $('#stat-areas').textContent = areas.length;
    $('#stat-abertas').textContent = denunciasAbertasDoUsuario.length;
    $('#stat-ongs').textContent = ongs.length;
    $('#stat-projetos').textContent = projetosDaOng.length;

  } catch (err) {
    console.error(err);
  }
}

/* ---------- Meus dados ---------- */
function badgePerfil(valor) {
  const perfil = String(valor || '').toLowerCase();

  if (perfil === 'admin') { return '<span class="badge badge-admin">Admin</span>'; }

  if (perfil === 'comum') { return '<span class="badge badge-comum">Comum</span>'; }

  return `<span class="badge">${escapeHtml(valor || 'Desconhecido')}</span>`;
}

async function loadUsuarios() {
  const tbody = $('#usuarios-tbody');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="3">Carregando...</td></tr>';

  try {
    const { usuario, tipo } = await api('/usuarios/profile');

    tbody.innerHTML = `
      <tr>
        <td><div class="user-cell"><span class="avatar">${escapeHtml(initials(usuario.nome))}</span>${escapeHtml(usuario.nome)}</div></td>
        <td>${escapeHtml(usuario.email)}</td>
        <td>${badgePerfil(tipo)}</td>
      </tr>
    `;
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- Denúncias ---------- */
function badgeDenuncia(status) {
  const key = String(status || '').toLowerCase();
  const cls = key === 'aberta' ? 'badge-aberta' : key.includes('tratamento') ? 'badge-tratamento' : 'badge-outros';
  return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
}

async function loadDenuncias() {
  const tbody = $('#denuncias-tbody');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Carregando...</td></tr>';

  try {
    const { denuncias } = await api('/denuncias');
    // Mostra apenas as denúncias feitas pelo usuário logado (esta ONG)
    const denunciasDoUsuario = denuncias.filter(
      (d) => d.usuario?.idUsuario === state.usuario?.idUsuario
    );
    if (!denunciasDoUsuario.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhuma denúncia encontrada.</td></tr>';
      return;
    }

    const areaLabel = (a) =>
      a ? `${escapeHtml(a.cidade)}, ${escapeHtml(a.bairro)}` : '-';
    tbody.innerHTML = denunciasDoUsuario
      .map((d) => `
        <tr>
          <td>${d.idDenuncia}</td>
          <td>${escapeHtml(d.titulo)}</td>
          <td>${badgeDenuncia(d.statusDenuncia)}</td>
          <td>${d.area ? areaLabel(d.area) : '-'}</td>
          <td>${d.usuario ? escapeHtml(d.usuario.nome) : '-'}</td>
          <td>${formatDate(d.dataDenuncia)}</td>
          <td>${escapeHtml(d.descricao)}</td>
        </tr>
      `)
      .join('');
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- Projetos ---------- */
function badgeProjetoPercentual(pct) {
  const valor = Number(pct || 0);
  if (valor === 0) return '<span class="badge badge-outros">Não iniciado</span>';
  if (valor < 50) return '<span class="badge badge-aberta">Em andamento</span>';
  if (valor < 100) return '<span class="badge badge-tratamento">Quase concluído</span>';
  return '<span class="badge badge-comum">Concluído</span>';
}

async function loadProjetos() {
  const tbody = $('#projetos-tbody');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Carregando...</td></tr>';

  try {
    const [projetosRes, followingRes] = await Promise.all([
      api('/projetos'),
      api('/ongs/following'),
    ]);

    const projetos = projetosRes.projetos || [];
    const ongsSeguidas = followingRes.ongs || [];

    const ongIds = new Set(ongsSeguidas.map((o) => String(o.idOng)));
    const projetosDaOng = projetos.filter((p) =>
      ongIds.has(String(p.ong?.idOng))
    );

    if (!projetosDaOng.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Nenhum projeto encontrado para esta ONG.</td></tr>';
      return;
    }

    tbody.innerHTML = projetosDaOng
      .map((p) => `
        <tr>
          <td>${p.idProjeto}</td>
          <td>${p.ong?.nome || '-'}</td>
          <td>${escapeHtml(p.objetivo)}</td>
          <td>${escapeHtml(p.descricao)}</td>
          <td>${badgeProjetoPercentual(p.percentualConclusao)}</td>
        </tr>
      `)
      .join('');
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- Cadastro de ONG ---------- */
function showCadastroOng() {
  $('#view-app').classList.add('hidden');
  $('#view-login').classList.add('hidden');
  $('#view-cadastro-ong').classList.remove('hidden');
  $('#cadastro-sucesso').classList.add('hidden');
  $('#cadastro-error').classList.add('hidden');
  $('#cadastro-ong-form').reset();
}

async function handleCadastroOng(e) {
  e.preventDefault();
  const errorEl = $('#cadastro-error');
  const successEl = $('#cadastro-sucesso');
  const btn = $('#cadastro-ong-submit');
  errorEl.classList.add('hidden');
  successEl.classList.add('hidden');

  const nome = $('#cad-nome').value.trim();
  const email = $('#cad-email').value.trim();
  const senha = $('#cad-senha').value;
  const cnpj = $('#cad-cnpj').value.trim().replace(/\D/g, '');
  const telefone = $('#cad-telefone').value.trim().replace(/\D/g, '');
  const regiao = $('#cad-regiao').value.trim();
  const descricao = $('#cad-descricao').value.trim();

  if (!nome || !email || !senha || !cnpj || !telefone || !regiao || !descricao) {
    errorEl.textContent = 'Preencha todos os campos.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (cnpj.length !== 14) {
    errorEl.textContent = 'Informe um CNPJ válido com 14 dígitos.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (telefone.length < 10 || telefone.length > 11) {
    errorEl.textContent = 'Informe um telefone válido.';
    errorEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Cadastrando...';

  try {
    // 1) cria o usuário comum (cpf e dataNasc são opcionais)
    const userRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, cpf: null, dataNasc: null }),
    });

    if (!userRes.ok) {
      const data = await userRes.json().catch(() => ({}));
      throw new Error(data.error || 'Não foi possível criar o usuário.');
    }

    const { token } = await userRes.json();
    state.token = token;
    localStorage.setItem('verde_ong_token', token);

    // 2) cria a ONG vinculada ao usuário
    const ongRes = await api('/ongs', {
      method: 'POST',
      body: JSON.stringify({ nome, regiao, cnpj, telefone, descricao }),
    });

    if (!ongRes.ok) {
      const ongData = await ongRes.json().catch(() => ({}));
      throw new Error(ongData.error || 'Não foi possível criar a ONG.');
    }

    successEl.classList.remove('hidden');
    $('#cadastro-ong-form').reset();
  } catch (err) {
    errorEl.textContent = err.message || 'Não foi possível cadastrar a ONG.';
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Cadastrar ONG';
  }
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  // Se há token salvo mas não há dados do usuário, busca o perfil
  if (state.token && !state.usuario) {
    try {
      const { usuario, tipo } = await api('/usuarios/profile');
      state.usuario = usuario || null;
    } catch (err) {
      console.error('Erro ao recuperar sessão:', err);
      state.token = null;
      state.usuario = null;
      localStorage.removeItem('verde_ong_token');
    }
  }

  $('#login-form').addEventListener('submit', handleLogin);
  $('#logout-btn').addEventListener('click', logout);
  $('#cadastro-ong-btn').addEventListener('click', () => navigate('cadastro'));
  $('#voltar-login-btn').addEventListener('click', () => {
    $('#view-cadastro-ong').classList.add('hidden');
    $('#view-login').classList.remove('hidden');
  });
  $('#cadastro-ong-form').addEventListener('submit', handleCadastroOng);
  document.querySelectorAll('.nav-link').forEach((el) => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });

  if (state.token) {
    showApp();
  } else {
    showLogin();
  }
});