const { Ong, Usuario, Ong_Usuario, Projeto, Denuncia, Area } = require('../models');
const { Op } = require('sequelize');

// Validações de CNPJ e telefone removidas temporariamente para demonstração.
const listONGs = async (req, res) => {
  try {
    const { regiao, statusOng } = req.query;

    const where = {};
    if (regiao) where.regiao = regiao;
    if (statusOng) where.statusOng = statusOng;
    
    const ongs = await Ong.findAll({
      where,
      include: [{ model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] }],
      order: [['idOng', 'DESC']],
    });

    return res.json({ ongs });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar ONGs' });
  }
};

const getONG = async (req, res) => {
  try {
    const ong = await Ong.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] }],
    });

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    return res.json({ ong });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar ONG' });
  }
};

const createONG = async (req, res) => {
  try {
    const { nome, regiao, cnpj, telefone, descricao } = req.body;
    const idUsuario = req.user.idUsuario
    const statusOng = 'pendente'

    if (req.user.tipo != 'comum') {
      return res.status(403).json({ error: 'Somente usuários comuns podem cadastrar ONGs.' });
    }

    const existing = await Ong.findOne({
      where: {
        idUsuario: req.user.idUsuario,
        statusOng: { [Op.in]: ['pendente', 'aprovada'] },
      },
    });
    
    if (existing) {
      return res.status(409).json({ error: 'ONG já inserida no sistema' });
    }

    const cnpjValue = String(cnpj ?? '').trim();
    const telefoneValue = String(telefone ?? '').trim();

    if (!nome || !regiao || !cnpjValue || !telefoneValue || !descricao) {
      return res.status(400).json({
        error: 'Preencha o nome, a região, o CNPJ, o telefone e a descrição da ONG.',
      });
    }

    const ong = await Ong.create({
      idUsuario,
      nome,
      regiao,
      cnpj: cnpjValue,
      telefone: telefoneValue,
      descricao,
      statusOng,
    });

    return res.status(201).json({ ong });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar ONG' });
  }
};

const updateOng = async (req, res) => {
  try {
    
    const ong = await Ong.findByPk(req.params.id);

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    const isAdmin = req.user.tipo === 'admin';
    const isOwner = String(ong.idUsuario) === String(req.user.idUsuario);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Sem permissão para atualizar esta ONG' });
    }
    
    await ong.update(req.body);

    return res.json({ ong });
  } catch (err) {

    return res.status(500).json({ error: 'Erro ao atualizar ONG' });
  }
}

const deleteOng = async (req, res) => {
  try {
    const ong = await Ong.findByPk(req.params.id);

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    const isAdmin = req.user.tipo === 'admin';
    const isOwner = String(ong.idUsuario) === String(req.user.idUsuario);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Sem permissão para deletar esta ONG' });
    }

    await ong.destroy();

    return res.json({ message: 'ONG removida com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover ONG' });
  }
}

const followONG = async (req, res) => {
  try {
    const { id } = req.params;

    const ong = await Ong.findByPk(id);
    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' }) 
    }

    if (ong.statusOng !== 'aprovada') {
      return res.status(400).json({
        error: 'Só é possível seguir ONGs aprovadas',
      });
    }

    const existing = await Ong_Usuario.findOne({
      where: { idOng: id, idUsuario: req.user.idUsuario },
    });

    if (existing) {
      return res.status(409).json({ error: 'Você já segue esta ONG' });
    }

    const following = await Ong_Usuario.create({ idOng: id, idUsuario: req.user.idUsuario });

    return res.status(201).json({ following });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao seguir ONG' });
  }
};

const unfollowONG = async (req, res) => {
  try {
    const { id } = req.params;

    const ong = await Ong.findByPk(id);
    if (!ong) { 
      return res.status(404).json({ error: 'ONG não encontrada' }) 
    }

    const existing = await Ong_Usuario.findOne({
      where: { idOng: id, idUsuario: req.user.idUsuario }
    });

    if (!existing) {
      return res.status(409).json({ error: 'Você não segue esta ONG' });
    }

    const deleted = await Ong_Usuario.destroy({
      where: { idOng: id, idUsuario: req.user.idUsuario },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Você não segue esta ONG' });
    }

    return res.json({ message: 'Você deixou de seguir a ONG' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deixar de seguir ONG' });
  }
};

const listFollowingONGs = async (req, res) => {
  try {
    const following = await Ong_Usuario.findAll({
      where: { idUsuario: req.user.idUsuario, },
      include: [{
          model: Ong, as: 'ong', where: { statusOng: 'aprovada',},
          include: [ {model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email']} ],
        }],
      order: [['idOng_Usuario', 'DESC']],
    });

    return res.json({ ongs: following.map((item) => item.ong) });
  } catch (err) {
    return res.status(500).json({error: 'Erro ao listar ONGs seguidas'});
  }
};

async function findMyOng(idUsuario) {
  return Ong.findOne({
    where: { idUsuario },
    include: [
      { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] },
    ],
    order: [['idOng', 'DESC']],
  });
}

const getMyOng = async (req, res) => {
  try {
    const ong = await findMyOng(req.user.idUsuario);

    if (!ong) {
      return res.status(404).json({ error: 'Você ainda não cadastrou uma ONG.' });
    }

    return res.json({ ong });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar sua ONG' });
  }
};

const getMyOngDashboard = async (req, res) => {
  try {
    const ong = await findMyOng(req.user.idUsuario);

    if (!ong) {
      return res.status(404).json({ error: 'Você ainda não cadastrou uma ONG.' });
    }

    const [projetos, membros, denuncias] = await Promise.all([
      Projeto.findAll({
        where: { idOng: ong.idOng },
        order: [['idProjeto', 'DESC']],
      }),
      Ong_Usuario.findAll({
        where: { idOng: ong.idOng },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] },
        ],
        order: [['idOng_Usuario', 'DESC']],
      }),
      Denuncia.findAll({
        where: { idUsuario: ong.idUsuario },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome'] },
          {
            model: Area,
            as: 'area',
            attributes: ['idArea', 'cidade', 'bairro', 'rua', 'latitude', 'longitude', 'raio', 'poligono', 'statusArea'],
          },
        ],
        order: [['idDenuncia', 'DESC']],
      }),
    ]);

    const percentualMedio = projetos.length
      ? Math.round(
          projetos.reduce(
            (total, projeto) => total + Number(projeto.percentualConclusao || 0),
            0,
          ) / projetos.length,
        )
      : 0;

    return res.json({
      ong,
      stats: {
        totalProjetos: projetos.length,
        totalMembros: membros.length,
        totalDenuncias: denuncias.length,
        denunciasAbertas: denuncias.filter((d) => d.statusDenuncia === 'aberta').length,
        percentualMedio,
      },
      projetos,
      membros,
      denuncias,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar o painel da ONG' });
  }
};

const listMembros = async (req, res) => {
  try {
    const ong = await Ong.findByPk(req.params.id);

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    const isAdmin = req.user.tipo === 'admin';
    const isOwner = String(ong.idUsuario) === String(req.user.idUsuario);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Sem permissão para listar os membros desta ONG' });
    }

    const membros = await Ong_Usuario.findAll({
      where: { idOng: ong.idOng },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome', 'email'] },
      ],
      order: [['idOng_Usuario', 'DESC']],
    });

    return res.json({ membros });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar membros' });
  }
};

module.exports = {
  listONGs,
  getONG,
  createONG,
  updateOng,
  deleteOng,
  followONG,
  unfollowONG,
  listFollowingONGs,
  getMyOng,
  getMyOngDashboard,
  listMembros,
};
