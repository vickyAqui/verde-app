const API_URL = '/api';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('verde_admin_user') || 'null');
  } catch (err) {
    return null;
  }
}

const state = {
  token: localStorage.getItem('verde_admin_token') || null,
  usuario: readStoredUser(),
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

const RETRYABLE_STATUS = new Set([502, 503, 504]);
const RETRYABLE_METHODS = new Set(['GET', 'PUT', 'DELETE', 'PATCH']);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function api(path, options = {}, attempt = 0) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  const method = String(options.method || 'GET').toUpperCase();
  const canRetry = RETRYABLE_METHODS.has(method) && attempt < 2;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    if (canRetry) {
      await sleep(700 * (attempt + 1));
      return api(path, options, attempt + 1);
    }
    throw new Error('Sem conexão com o servidor. Verifique sua internet e tente novamente.');
  }

  if (RETRYABLE_STATUS.has(res.status) && canRetry) {
    await sleep(700 * (attempt + 1));
    return api(path, options, attempt + 1);
  }

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 429) {
      throw new Error('Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.');
    }
    if (res.status >= 500) {
      throw new Error(data.error || 'O servidor está instável no momento. Tente novamente em instantes.');
    }
    throw new Error(data.error || 'Erro na requisição');
  }

  return res.json();
}

/* ---------- Login ---------- */
function showLogin() {
  state.token = null;
  state.usuario = null;
  localStorage.removeItem('verde_admin_token');
  localStorage.removeItem('verde_admin_user');
  $('#view-app').classList.add('hidden');
  $('#view-login').classList.remove('hidden');
}

function renderSidebarUser() {
  const nome = state.usuario?.nome || 'Administrador';
  const avatar = $('#sidebar-avatar');
  const nameEl = $('#sidebar-user-name');
  if (avatar) avatar.textContent = initials(nome);
  if (nameEl) nameEl.textContent = nome;
}

function showApp() {
  $('#view-login').classList.add('hidden');
  $('#view-app').classList.remove('hidden');
  renderSidebarUser();
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

    if (data.tipo !== 'admin') {
      errorEl.textContent = 'Acesso restrito: apenas administradores podem entrar.';
      errorEl.classList.remove('hidden');
      return;
    }

    state.token = data.token;
    state.usuario = data.usuario || null;
    localStorage.setItem('verde_admin_token', data.token);
    if (state.usuario) {
      localStorage.setItem('verde_admin_user', JSON.stringify(state.usuario));
    }
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
const VIEW_META = {
  dashboard: {
    eyebrow: 'Visão geral',
    title: 'Dashboard',
    subtitle: 'Acompanhe a rede +Verde em um só lugar.',
  },
  usuarios: {
    eyebrow: 'Gestão',
    title: 'Usuários',
    subtitle: 'Todos os perfis cadastrados na plataforma.',
  },
  areas: {
    eyebrow: 'Gestão',
    title: 'Áreas',
    subtitle: 'Regiões monitoradas e seus status.',
  },
  ongs: {
    eyebrow: 'Gestão',
    title: 'ONGs',
    subtitle: 'Solicitações pendentes e organizações parceiras.',
  },
  denuncias: {
    eyebrow: 'Gestão',
    title: 'Denúncias',
    subtitle: 'Chamados registrados pela comunidade.',
  },
};

function navigate(view) {
  state.view = view;

  document.querySelectorAll('.nav-link').forEach((el) => {
    el.classList.toggle('active', el.dataset.view === view);
  });

  document.querySelectorAll('.page').forEach((el) => {
    el.classList.toggle('active', el.id === `view-${view}`);
  });

  const meta = VIEW_META[view] || VIEW_META.dashboard;
  $('#page-eyebrow').textContent = meta.eyebrow;
  $('#page-title').textContent = meta.title;
  $('#page-subtitle').textContent = meta.subtitle;

  if (view === 'dashboard') loadDashboard();
  if (view === 'usuarios') loadUsuarios();
  if (view === 'areas') loadAreas();
  if (view === 'ongs') loadOngs();
  if (view === 'denuncias') loadDenuncias();
}

/* ---------- Dashboard ---------- */
const STATUS_META = {
  aberta: { label: 'Abertas', color: '#B3402A' },
  tratamento: { label: 'Em tratamento', color: '#2563EB' },
  resolvida: { label: 'Resolvidas', color: '#166B44' },
  outros: { label: 'Outras', color: '#94A3B8' },
};

function statusKey(status) {
  const key = String(status || '').toLowerCase();
  if (key.includes('aberta')) return 'aberta';
  if (key.includes('tratamento')) return 'tratamento';
  if (key.includes('resolv')) return 'resolvida';
  return 'outros';
}

function renderDonut(denuncias) {
  const counts = { aberta: 0, tratamento: 0, resolvida: 0, outros: 0 };
  denuncias.forEach((d) => {
    counts[statusKey(d.statusDenuncia)] += 1;
  });

  const total = denuncias.length;
  const segments = $('#dash-donut-segments');
  const circumference = 2 * Math.PI * 42;
  let offset = 0;

  segments.innerHTML = '';

  if (total === 0) {
    segments.innerHTML = `<circle cx="60" cy="60" r="42" fill="none" stroke="#EFE9DC" stroke-width="14"></circle>`;
  } else {
    Object.entries(counts).forEach(([key, value]) => {
      if (!value) return;
      const length = (value / total) * circumference;
      segments.insertAdjacentHTML(
        'beforeend',
        `<circle cx="60" cy="60" r="42" fill="none" stroke="${STATUS_META[key].color}" stroke-width="14" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}"></circle>`,
      );
      offset += length;
    });
  }

  $('#dash-donut-total').textContent = total;

  const legend = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(
      ([key, value]) => `
        <li>
          <span class="legend-dot" style="background:${STATUS_META[key].color}"></span>
          <span class="legend-label">${STATUS_META[key].label}</span>
          <span class="legend-value">${value}</span>
        </li>`,
    )
    .join('');

  $('#dash-donut-legend').innerHTML =
    legend || '<li class="legend-empty">Nenhuma denúncia registrada.</li>';
}

function renderPendentes(ongs) {
  const pendentes = ongs.filter((o) => o.statusOng === 'pendente');
  const resumo = $('#dash-pendentes-resumo');
  const container = $('#dash-pendentes');

  resumo.textContent = pendentes.length
    ? `${pendentes.length} aguardando análise`
    : 'Nenhuma pendência no momento';

  if (!pendentes.length) {
    container.innerHTML =
      '<p class="empty-inline">Nenhuma solicitação pendente. Tudo em dia!</p>';
    return;
  }

  container.innerHTML = pendentes
    .slice(0, 4)
    .map(
      (ong) => `
        <div class="pending-item">
          <span class="avatar">${escapeHtml(initials(ong.nome))}</span>
          <div class="pending-body">
            <p class="pending-name">${escapeHtml(ong.nome)}</p>
            <p class="pending-meta">${escapeHtml(ong.regiao)} · ${escapeHtml(ong.usuario?.nome || 'sem responsável')}</p>
          </div>
          <div class="pending-actions">
            <button type="button" class="pending-action approve" data-action="approve" data-id="${ong.idOng}" data-name="${escapeHtml(ong.nome)}">Aprovar</button>
            <button type="button" class="pending-action reject" data-action="reject" data-id="${ong.idOng}" data-name="${escapeHtml(ong.nome)}">Reprovar</button>
          </div>
        </div>`,
    )
    .join('');
}

function renderUltimas(denuncias) {
  const container = $('#dash-ultimas');

  if (!denuncias.length) {
    container.innerHTML = '<p class="empty-inline">Nenhuma denúncia registrada.</p>';
    return;
  }

  container.innerHTML = denuncias
    .slice(0, 5)
    .map((denuncia) => {
      const area = denuncia.area;
      const local = area
        ? [area.bairro, area.cidade].filter(Boolean).join(' · ') || 'Área'
        : 'Local não informado';

      return `
        <div class="recent-item">
          <span class="recent-dot ${statusKey(denuncia.statusDenuncia)}"></span>
          <div class="recent-body">
            <p class="recent-title">${escapeHtml(denuncia.titulo)}</p>
            <p class="recent-meta">${escapeHtml(local)} · ${formatDate(denuncia.dataDenuncia)}</p>
          </div>
          ${badgeDenuncia(denuncia.statusDenuncia)}
        </div>`;
    })
    .join('');
}

function renderComposicao(stats) {
  const rows = [
    { key: 'admin', label: 'Administradores', value: stats.totalAdmins || 0 },
    { key: 'comum', label: 'Usuários comuns', value: stats.totalComuns || 0 },
    { key: 'ong', label: 'ONGs parceiras', value: stats.totalONGs || 0 },
  ];
  const max = Math.max(...rows.map((r) => r.value), 1);

  $('#dash-composicao').innerHTML = rows
    .map(
      (row) => `
        <div class="comp-row">
          <div class="comp-head">
            <span>${row.label}</span>
            <strong>${row.value}</strong>
          </div>
          <div class="comp-bar">
            <span class="comp-fill ${row.key}" style="width:${row.value ? Math.max((row.value / max) * 100, 4) : 0}%"></span>
          </div>
        </div>`,
    )
    .join('');
}

async function loadDashboard() {
  const dateEl = $('#dash-date');
  if (dateEl) {
    const label = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
    dateEl.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  }

  try {
    const [dashRes, denRes, ongRes] = await Promise.all([
      api('/admin/dashboard'),
      api('/admin/denuncias'),
      api('/admin/ongs'),
    ]);

    const stats = dashRes.stats;
    const denuncias = denRes.denuncias || [];
    const ongs = ongRes.ongs || [];
    const pendentes = ongs.filter((o) => o.statusOng === 'pendente').length;
    const resolvidas = denuncias.filter(
      (d) => statusKey(d.statusDenuncia) === 'resolvida',
    ).length;

    $('#stat-usuarios').textContent = stats.totalUsuarios;
    $('#stat-usuarios-hint').textContent = `${stats.totalAdmins} admin(s) · ${stats.totalComuns} comum(ns)`;

    $('#stat-ongs').textContent = stats.totalONGs;
    $('#stat-ongs-hint').textContent = pendentes
      ? `${pendentes} aguardando aprovação`
      : 'todas aprovadas';

    $('#stat-projetos').textContent = stats.totalProjetos;
    $('#stat-projetos-hint').textContent = 'em andamento na rede';

    $('#stat-areas').textContent = stats.totalAreas;
    $('#stat-areas-hint').textContent = 'mapeadas na rede +Verde';

    $('#stat-denuncias').textContent = stats.totalDenuncias;
    $('#stat-denuncias-hint').textContent = `${resolvidas} resolvida(s)`;

    $('#stat-denuncias-abertas').textContent = stats.denunciasAbertas;
    $('#stat-denuncias-abertas-hint').textContent = `de ${stats.totalDenuncias} denúncia(s) no total`;

    const statusEl = $('#dash-status');
    statusEl.textContent = `${stats.denunciasAbertas} denúncia(s) aberta(s)`;
    statusEl.className = `badge ${stats.denunciasAbertas > 0 ? 'badge-aberta' : 'badge-aprovada'}`;

    renderDonut(denuncias);
    renderPendentes(ongs);
    renderUltimas(denuncias);
    renderComposicao(stats);
  } catch (err) {
    console.error(err);
    const statusEl = $('#dash-status');
    if (statusEl) {
      statusEl.textContent = 'Erro ao carregar';
      statusEl.className = 'badge badge-outros';
    }
    ['#dash-pendentes', '#dash-ultimas'].forEach((sel) => {
      const el = $(sel);
      if (el) el.innerHTML = `<p class="empty-inline">${escapeHtml(err.message)}</p>`;
    });
  }
}

/* ---------- Ações de ONG ---------- */
async function handleOngAction(button, approve) {
  const id = button.dataset.id;
  const nome = button.dataset.name || 'esta ONG';

  if (!approve && !confirm(`Reprovar e excluir a solicitação de "${nome}"?`)) {
    return;
  }

  const item = button.closest('.pending-item') || button.closest('tr');
  if (item) {
    item.querySelectorAll('button').forEach((b) => {
      b.disabled = true;
    });
  }
  button.textContent = approve ? 'Aprovando...' : 'Reprovando...';

  try {
    await api(`/admin/ong/${id}/approve`, {
      method: approve ? 'PUT' : 'DELETE',
    });

    if (state.view === 'dashboard') loadDashboard();
    else if (state.view === 'ongs') loadOngs();
  } catch (err) {
    alert(err.message);
    if (state.view === 'ongs') loadOngs();
    else loadDashboard();
  }
}

/* ---------- Usuários ---------- */
function badgePerfil(valor) {
  const perfil = String(valor || '').toLowerCase();

  if (perfil === 'admin') { return '<span class="badge badge-admin">Admin</span>'; }

  if (perfil === 'ong') { return '<span class="badge badge-ong">ONG</span>'; }

  if (perfil === 'comum') { return '<span class="badge badge-comum">Comum</span>'; }

  return `<span class="badge">${escapeHtml(valor || 'Desconhecido')}</span>`;
}

async function loadUsuarios() {
  const tbody = $('#usuarios-tbody');
  const count = $('#usuarios-count');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Carregando...</td></tr>';

  try {
    const { usuarios } = await api('/admin/usuarios');
    count.textContent = `${usuarios.length} usuário(s) cadastrado(s)`;

    if (!usuarios.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhum usuário encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = usuarios
      .map((u) => `
        <tr>
          <td>${u.idUsuario}</td>
          <td><div class="user-cell"><span class="avatar">${escapeHtml(initials(u.nome))}</span><span class="cell-name">${escapeHtml(u.nome)}</span></div></td>
          <td>${escapeHtml(u.email)}</td>
          <td>${badgePerfil(u.nivel?.descricao)}</td>
        </tr>
      `)
      .join('');
  } catch (err) {
    count.textContent = 'Não foi possível carregar';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- Áreas ---------- */
function badgeStatus(status) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '-');
  if (key.includes('identific') || key.includes('em-tratamento')) {
    const cls = key.includes('tratamento') ? 'badge-tratamento' : 'badge-identificada';
    return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
  }
  return `<span class="badge badge-outros">${escapeHtml(status)}</span>`;
}

async function loadAreas() {
  const tbody = $('#areas-tbody');
  const count = $('#areas-count');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Carregando...</td></tr>';

  try {
    const { areas } = await api('/admin/areas');
    count.textContent = `${areas.length} área(s) monitorada(s)`;

    if (!areas.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Nenhuma área encontrada.</td></tr>';
      return;
    }
    tbody.innerHTML = areas
      .map((a) => `
        <tr>
          <td>${a.idArea}</td>
          <td>${escapeHtml(a.cidade)}</td>
          <td>${escapeHtml(a.bairro)}</td>
          <td>${escapeHtml(a.rua)}</td>
          <td>${badgeStatus(a.statusArea)}</td>
        </tr>
      `)
      .join('');
  } catch (err) {
    count.textContent = 'Não foi possível carregar';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- ONGs ---------- */
function badgeOng(status) {
  const key = String(status || '').toLowerCase();
  if (key === 'aprovada') return '<span class="badge badge-aprovada">Aprovada</span>';
  return '<span class="badge badge-pendente">Pendente</span>';
}

function ongActions(ong) {
  if (ong.statusOng !== 'pendente') {
    return '<span class="cell-muted">—</span>';
  }
  return `
    <div class="row-actions">
      <button type="button" class="row-action approve" data-action="approve" data-id="${ong.idOng}" data-name="${escapeHtml(ong.nome)}">Aprovar</button>
      <button type="button" class="row-action reject" data-action="reject" data-id="${ong.idOng}" data-name="${escapeHtml(ong.nome)}">Reprovar</button>
    </div>`;
}

async function loadOngs() {
  const tbody = $('#ongs-tbody');
  const count = $('#ongs-count');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Carregando...</td></tr>';

  try {
    const { ongs } = await api('/admin/ongs');
    const pendentes = ongs.filter((o) => o.statusOng === 'pendente').length;
    count.textContent = `${ongs.length} ONG(s) · ${pendentes} pendente(s)`;

    if (!ongs.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Nenhuma ONG encontrada.</td></tr>';
      return;
    }
    tbody.innerHTML = ongs
      .map((o) => `
        <tr>
          <td>${o.idOng}</td>
          <td>
            <div class="user-cell">
              <span class="avatar">${escapeHtml(initials(o.nome))}</span>
              <div>
                <strong>${escapeHtml(o.nome)}</strong>
                <span class="cell-sub">${escapeHtml(o.descricao)}</span>
              </div>
            </div>
          </td>
          <td>${escapeHtml(o.regiao)}</td>
          <td>${escapeHtml(o.cnpj)}</td>
          <td>${escapeHtml(o.telefone)}</td>
          <td>${o.usuario ? escapeHtml(o.usuario.nome) : '-'}</td>
          <td>${badgeOng(o.statusOng)}</td>
          <td>${ongActions(o)}</td>
        </tr>
      `)
      .join('');
  } catch (err) {
    count.textContent = 'Não foi possível carregar';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- Denúncias ---------- */
function badgeDenuncia(status) {
  const key = (status || '').toLowerCase();
  const cls = key === 'aberta' ? 'badge-aberta' : key.includes('tratamento') ? 'badge-tratamento' : key.includes('resolv') ? 'badge-aprovada' : 'badge-outros';
  return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
}

async function loadDenuncias() {
  const tbody = $('#denuncias-tbody');
  const count = $('#denuncias-count');
  tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Carregando...</td></tr>';

  try {
    const { denuncias } = await api('/admin/denuncias');
    const abertas = denuncias.filter((d) => statusKey(d.statusDenuncia) === 'aberta').length;
    count.textContent = `${denuncias.length} denúncia(s) · ${abertas} aberta(s)`;

    if (!denuncias.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhuma denúncia encontrada.</td></tr>';
      return;
    }

    const areaLabel = (a) =>
      a ? `${escapeHtml(a.cidade)}, ${escapeHtml(a.bairro)}` : '-';
    tbody.innerHTML = denuncias
      .map((d) => `
        <tr>
          <td>${d.idDenuncia}</td>
          <td>${escapeHtml(d.titulo)}</td>
          <td>${badgeDenuncia(d.statusDenuncia)}</td>
          <td>${d.area ? areaLabel(d.area) : '-'}</td>
          <td>${d.usuario ? escapeHtml(d.usuario.nome) : '-'}</td>
          <td>${formatDate(d.dataDenuncia)}</td>
          <td><span class="cell-desc">${escapeHtml(d.descricao)}</span></td>
        </tr>
      `)
      .join('');
  } catch (err) {
    count.textContent = 'Não foi possível carregar';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">${escapeHtml(err.message)}</td></tr>`;
  }
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  $('#login-form').addEventListener('submit', handleLogin);
  $('#logout-btn').addEventListener('click', logout);

  document.querySelectorAll('.nav-link').forEach((el) => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });

  document.querySelectorAll('[data-view]').forEach((el) => {
    if (el.classList.contains('nav-link')) return;
    el.addEventListener('click', () => navigate(el.dataset.view));
  });

  ['#dash-pendentes', '#ongs-tbody'].forEach((sel) => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-action]');
      if (!btn) return;
      handleOngAction(btn, btn.dataset.action === 'approve');
    });
  });

  if (state.token) {
    showApp();
  } else {
    showLogin();
  }
});
