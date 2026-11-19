const { app, request, getToken } = require('./helpers/http');
const { Denuncia } = require('../src/models');
describe('Admin', () => {
  let adminToken;

  beforeAll(async () => {
    adminToken = await getToken('admin@verde.com', '123456');
  });
  afterAll(async () => {
    await Denuncia.update(
      { statusDenuncia: 'aberta' },
      { where: { idDenuncia: 1 } },
    );
  });
  describe('Acesso', () => {
    it('rejeita acesso sem token (401)', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });

    it('rejeita acesso de usuário comum (403)', async () => {
      const comumToken = await getToken('maria@verde.com', '123456');
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${comumToken}`);

      expect(res.status).toBe(403);
    });

    it('aceita acesso de admin (200)', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
  describe('GET /api/admin/dashboard', () => {
    it('retorna estatísticas gerais', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const { stats } = res.body;
      expect(stats.totalUsuarios).toBeGreaterThanOrEqual(3);
      expect(stats.totalAdmins).toBeGreaterThanOrEqual(1);
      expect(stats.totalComuns).toBeGreaterThanOrEqual(1);
      expect(stats.totalAreas).toBeGreaterThanOrEqual(1);
      expect(stats.totalDenuncias).toBeGreaterThanOrEqual(1);
      expect(stats.denunciasAbertas).toBeGreaterThanOrEqual(0);
    });
  });

   describe('GET /api/admin/usuarios', () => {
    it('lista todos os usuários', async () => {
      const res = await request(app)
        .get('/api/admin/usuarios')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.usuarios)).toBe(true);
      expect(res.body.usuarios.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /api/admin/areas', () => {
    it('lista áreas com seus identificadores', async () => {
      const res = await request(app)
        .get('/api/admin/areas')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.areas)).toBe(true);
      expect(res.body.areas.length).toBeGreaterThan(0);

      res.body.areas.forEach((area) => {
        expect(area).toHaveProperty('idArea');
      });
    });
  });

  describe('PUT /api/admin/denuncia/:id/status', () => {
    it('permite ao admin alterar o status da denúncia', async () => {
      const res = await request(app)
        .put('/api/admin/denuncia/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ statusDenuncia: 'em tratamento' });

      expect(res.status).toBe(200);
      expect(res.body.denuncia.statusDenuncia).toBe('em tratamento');
    });

    it('rejeita um status inválido', async () => {
      const res = await request(app)
        .put('/api/admin/denuncia/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ statusDenuncia: 'cancelada' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/admin/denuncias', () => {
    it('lista todas as denúncias', async () => {
      const res = await request(app)
        .get('/api/admin/denuncias')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.denuncias)).toBe(true);
    });
  });

});