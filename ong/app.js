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
  const subtitles = {
    dashboard: 'Acompanhe denúncias, projetos e a comunidade da sua ONG.',
    usuarios: 'Sua conta e perfil no +Verde.',
    campanhas: 'Denúncias registradas pela sua ONG.',
    projetos: 'Projetos e percentual de conclusão.',
  };

  $('#page-title').textContent = titles[view] || '';
  $('#page-subtitle').textContent = subtitles[view] || '';

  const headerMeta = document.querySelector('.header-meta');
  if (headerMeta) headerMeta.classList.toggle('hidden', view !== 'dashboard');

  if (view === 'dashboard') loadDashboard();
  if (view === 'usuarios') loadUsuarios();
  if (view === 'campanhas') loadDenuncias();
  if (view === 'projetos') loadProjetos();
  if (view === 'cadastro') showCadastroOng();
}

/* ---------- Dashboard ---------- */
function formatCnpj(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length !== 14) return value || '-';
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function formatTelefone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 11) return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  if (digits.length === 10) return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  return value || '-';
}

function statusKey(status) {
  const key = String(status || '').toLowerCase();
  if (key.startsWith('aberta')) return 'aberta';
  if (key.includes('tratamento')) return 'tratamento';
  if (key.startsWith('resolvid')) return 'resolvida';
  return 'outros';
}

const DONUT_COLORS = {
  aberta: '#DC2626',
  tratamento: '#2563EB',
  resolvida: '#16A34A',
  outros: '#94A3B8',
};

const DONUT_LABELS = {
  aberta: 'Abertas',
  tratamento: 'Em tratamento',
  resolvida: 'Resolvidas',
  outros: 'Outras',
};

function renderDonut(denuncias) {
  const counts = { aberta: 0, tratamento: 0, resolvida: 0, outros: 0 };
  denuncias.forEach((d) => {
    counts[statusKey(d.statusDenuncia)] += 1;
  });

  const total = denuncias.length;
  const segments = $('#dash-donut-segments');
  const circumference = 2 * Math.PI * 42;

  segments.innerHTML = '';

  if (total === 0) {
    segments.innerHTML =
      '<circle cx="60" cy="60" r="42" fill="none" stroke="#E8EFEA" stroke-width="14"></circle>';
  } else {
    let offset = 0;

    Object.entries(counts).forEach(([key, value]) => {
      if (!value) return;
      const length = (value / total) * circumference;

      segments.insertAdjacentHTML(
        'beforeend',
        `<circle cx="60" cy="60" r="42" fill="none" stroke="${DONUT_COLORS[key]}" stroke-width="14" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}"></circle>`,
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
          <span class="legend-dot" style="background:${DONUT_COLORS[key]}"></span>
          <span class="legend-label">${DONUT_LABELS[key]}</span>
          <span class="legend-value">${value}</span>
        </li>`,
    )
    .join('');

  $('#dash-donut-legend').innerHTML =
    legend || '<li class="legend-empty">Nenhuma denúncia registrada.</li>';
}

function renderProjetos(projetos, percentualMedio) {
  const container = $('#dash-projetos');

  if (!projetos.length) {
    $('#dash-projetos-resumo').textContent = 'Nenhum projeto cadastrado ainda';
    container.innerHTML = '<p class="empty-inline">Nenhum projeto em andamento.</p>';
    return;
  }

  $('#dash-projetos-resumo').textContent = `${projetos.length} projeto(s) • média de ${percentualMedio}% concluído`;

  container.innerHTML = projetos
    .slice(0, 4)
    .map((projeto) => {
      const pct = Math.max(0, Math.min(100, Number(projeto.percentualConclusao || 0)));

      return `
        <div class="project-item">
          <div class="project-top">
            <span class="project-name">${escapeHtml(projeto.objetivo)}</span>
            <span class="project-pct">${pct}%</span>
          </div>
          <div class="project-bar"><span style="width:${pct}%"></span></div>
          <p class="project-desc">${escapeHtml(projeto.descricao || 'Sem descrição')}</p>
        </div>`;
    })
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
      const local = denuncia.area
        ? `${denuncia.area.cidade || ''}${denuncia.area.bairro ? `, ${denuncia.area.bairro}` : ''}`
        : 'Local não informado';

      return `
        <div class="recent-item">
          <span class="recent-dot ${statusKey(denuncia.statusDenuncia)}"></span>
          <div class="recent-body">
            <p class="recent-title">${escapeHtml(denuncia.titulo)}</p>
            <p class="recent-meta">${escapeHtml(local)} • ${formatDate(denuncia.dataDenuncia)}</p>
          </div>
          ${badgeDenuncia(denuncia.statusDenuncia)}
        </div>`;
    })
    .join('');
}

function renderOngInfo(ong) {
  $('#dash-ong-info').innerHTML = `
    <div class="ong-info-head">
      <span class="avatar">${escapeHtml(initials(ong.nome))}</span>
      <div>
        <strong>${escapeHtml(ong.nome)}</strong>
        <small>${escapeHtml(ong.regiao)}</small>
      </div>
    </div>
    <dl class="ong-info-grid">
      <div>
        <dt>CNPJ</dt>
        <dd>${escapeHtml(formatCnpj(ong.cnpj))}</dd>
      </div>
      <div>
        <dt>Telefone</dt>
        <dd>${escapeHtml(formatTelefone(ong.telefone))}</dd>
      </div>
    </dl>`;
}

async function loadDashboard() {
  const emptyEl = $('#dash-empty');
  const contentEl = $('#dash-content');
  const statusEl = $('#dash-status');
  const dateEl = $('#dash-date');

  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  emptyEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  let dashboard = null;

  try {
    dashboard = await api('/ongs/me/dashboard');
  } catch (err) {
    if (!/cadastrou uma ONG/i.test(err.message || '')) {
      console.error(err);
    }
  }

  if (!dashboard) {
    contentEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    statusEl.textContent = 'Sem ONG';
    statusEl.className = 'badge badge-outros';
    $('#page-subtitle').textContent = `Olá, ${state.usuario?.nome || 'visitante'} — cadastre sua ONG para começar.`;
    return;
  }

  const { ong, stats, projetos = [], denuncias = [] } = dashboard;

  let areas = [];
  let ongs = [];

  try {
    const [areasRes, ongsRes] = await Promise.all([api('/areas'), api('/ongs')]);
    areas = areasRes.areas || [];
    ongs = ongsRes.ongs || [];
  } catch (err) {
    console.error(err);
  }

  $('#page-subtitle').textContent = `Olá, ${ong.nome} — aqui está o resumo da sua ONG hoje.`;

  const aprovada = String(ong.statusOng || '').toLowerCase() === 'aprovada';
  statusEl.textContent = aprovada ? 'ONG aprovada' : 'ONG em análise';
  statusEl.className = `badge ${aprovada ? 'badge-comum' : 'badge-identificada'}`;

  $('#stat-abertas').textContent = stats.denunciasAbertas;
  $('#stat-abertas-hint').textContent = `de ${stats.totalDenuncias} denúncia(s) no total`;

  $('#stat-projetos').textContent = stats.totalProjetos;
  $('#stat-projetos-hint').textContent = `${stats.percentualMedio}% de conclusão média`;

  $('#stat-areas').textContent = areas.length;
  $('#stat-areas-hint').textContent = 'mapeadas na rede +Verde';

  $('#stat-ongs').textContent = ongs.length;
  $('#stat-ongs-hint').textContent = 'parceiras cadastradas';

  $('#stat-membros').textContent = stats.totalMembros;
  $('#stat-membros-hint').textContent = 'na sua equipe';

  renderProjetos(projetos, stats.percentualMedio);
  renderDonut(denuncias);
  renderUltimas(denuncias);
  renderOngInfo(ong);
}

/* ---------- Meus dados ---------- */
function badgePerfil(valor) {
  const perfil = String(valor || '').toLowerCase();

  if (perfil === 'admin') { return '<span class="badge badge-admin">Admin</span>'; }

  if (perfil === 'comum') { return '<span class="badge badge-comum">Comum</span>'; }

  if (perfil === 'ong') { return '<span class="badge badge-ong">ONG</span>'; }

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
function formatCnpjInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  let formatted = digits.slice(0, 2);

  if (digits.length > 2) formatted += `.${digits.slice(2, 5)}`;
  if (digits.length > 5) formatted += `.${digits.slice(5, 8)}`;
  if (digits.length > 8) formatted += `/${digits.slice(8, 12)}`;
  if (digits.length > 12) formatted += `-${digits.slice(12, 14)}`;

  return formatted;
}

function formatTelefoneInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;

  const ddd = digits.slice(0, 2);
  const local = digits.slice(2);
  const isMobile = digits.length === 11;
  const firstPartLength = isMobile ? 5 : 4;
  const firstPart = local.slice(0, firstPartLength);
  const secondPart = local.slice(firstPartLength);

  return `(${ddd}) ${firstPart}${secondPart ? `-${secondPart}` : ''}`;
}

function applyInputMask(input, formatter) {
  input.addEventListener('input', () => {
    const cursor = input.selectionStart ?? input.value.length;
    const digitsBeforeCursor = input.value.slice(0, cursor).replace(/\D/g, '').length;
    input.value = formatter(input.value);

    let digitCount = 0;
    let nextCursor = digitsBeforeCursor === 0 ? 0 : input.value.length;
    for (let index = 0; index < input.value.length; index += 1) {
      if (/\d/.test(input.value[index])) digitCount += 1;
      if (digitsBeforeCursor > 0 && digitCount === digitsBeforeCursor) {
        nextCursor = index + 1;
        break;
      }
    }

    input.setSelectionRange(nextCursor, nextCursor);
  });
}

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
  const cnpj = $('#cad-cnpj').value.trim();
  const telefone = $('#cad-telefone').value.trim();
  const regiao = $('#cad-regiao').value.trim();
  const descricao = $('#cad-descricao').value.trim();

  if (!nome || !email || !senha || !cnpj || !telefone || !regiao || !descricao) {
    errorEl.textContent = 'Preencha todos os campos.';
    errorEl.classList.remove('hidden');
    return;
  }

  // Validação de formato de CNPJ/telefone removida temporariamente
  // para demonstração: qualquer valor preenchido é aceito.
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
    await api('/ongs', {
      method: 'POST',
      body: JSON.stringify({ nome, regiao, cnpj, telefone, descricao }),
    });

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
  applyInputMask($('#cad-cnpj'), formatCnpjInput);
  applyInputMask($('#cad-telefone'), formatTelefoneInput);
  document.querySelectorAll('.nav-link').forEach((el) => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });
  document.querySelectorAll('.quick-action, .link-btn, .btn[data-view]').forEach((el) => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });

  if (state.token) {
    showApp();
  } else {
    showLogin();
  }
});