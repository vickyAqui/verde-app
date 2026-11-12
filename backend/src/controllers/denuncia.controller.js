const { Denuncia, Area, Usuario } = require('../models');
const MAX_FOTOS_POR_DENUNCIA = 3;

const listDenuncias = async (req, res) => {
  try {
    const { idArea, statusDenuncia } = req.query;

    const where = {};
    if (idArea) where.idArea = idArea;
    if (statusDenuncia) where.statusDenuncia = statusDenuncia;

    const denuncias = await Denuncia.findAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome'] },
        { model: Area, as: 'area', attributes: ['idArea', 'cidade', 'bairro', 'rua', 'latitude', 'longitude', 'raio', 'poligono', 'statusArea'] },
      ],
      order: [['idDenuncia', 'DESC']],
    });

    return res.json({ denuncias });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar denúncias' });
  }
};

const getDenuncia = async (req, res) => {
  try {
    const denuncia = await Denuncia.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['idUsuario', 'nome'] },
        { model: Area, as: 'area' },
      ],
    });

    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    return res.json({ denuncia });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar denúncia' });
  }
};

const createDenuncia = async (req, res) => {
  try {
    const { idArea, titulo, descricao, fotos } = req.body;
    const idUsuario = req.user.idUsuario
    const dataDenuncia = new Date()
    const statusDenuncia = 'aberta'

    if (fotos !== undefined && (!Array.isArray(fotos) || fotos.some((url) => typeof url !== 'string'))) {
      return res.status(400).json({ error: 'A lista de fotos é inválida' });
    }

    const fotosDenuncia = (fotos ?? [])
      .map((url) => url.trim())
      .filter(Boolean);
    if (fotosDenuncia.length > MAX_FOTOS_POR_DENUNCIA) {
      return res.status(400).json({ error: `A denúncia pode ter no máximo ${MAX_FOTOS_POR_DENUNCIA} fotos` });
    }
    console.log(idArea)
    const area = await Area.findByPk(idArea);
    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    const denuncia = await Denuncia.create({
      idUsuario,
      idArea,
      titulo,
      dataDenuncia,
      statusDenuncia,
      descricao: descricao || null,
      fotos: fotosDenuncia.length > 0 ? fotosDenuncia : null,
    });

    return res.status(201).json({ denuncia });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar denúncia' });
  }
};

const updateDenuncia = async (req, res) => {
  try {
    const denuncia = await Denuncia.findByPk(req.params.id);

    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    const updates = { ...req.body };
    if (updates.fotos !== undefined) {
      if (!Array.isArray(updates.fotos) || updates.fotos.some((url) => typeof url !== 'string')) {
        return res.status(400).json({ error: 'A lista de fotos é inválida' });
      }
      updates.fotos = updates.fotos.map((url) => url.trim()).filter(Boolean);
      if (updates.fotos.length > MAX_FOTOS_POR_DENUNCIA) {
        return res.status(400).json({ error: `A denúncia pode ter no máximo ${MAX_FOTOS_POR_DENUNCIA} fotos` });
      }
      if (updates.fotos.length === 0) updates.fotos = null;
    }

    await denuncia.update(updates);

    return res.json({ denuncia });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar denúncia' });
  }
};

const deleteDenuncia = async (req, res) => {
  try {
    const denuncia = await Denuncia.findByPk(req.params.id);

    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }

    await denuncia.destroy();

    return res.json({ message: 'Denúncia removida com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover denúncia' });
  }
};

module.exports = { listDenuncias, getDenuncia, createDenuncia, updateDenuncia, deleteDenuncia };
