const { Conteudo, Tipo_Conteudo } = require('../models');
const { extractYoutubeVideoId, getYoutubeVideoMetadata } = require('../services/youtube');

const listContentTypes = async (req, res) => {
  try {
    const tiposConteudo = await Tipo_Conteudo.findAll({
      order: [['idTipo_Conteudo', 'ASC']],
    });
    return res.json({ tiposConteudo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar tipos de conteúdo' });
  }
};

const listConteudos = async (req, res) => {
  try {
    const where = {};
    if (req.query.categoria) where.categoria = req.query.categoria;

    const include = {
      model: Tipo_Conteudo,
      as: 'tipoConteudo',
      attributes: ['idTipo_Conteudo', 'tipo'],
    };
    if (req.query.tipo) {
      include.where = { tipo: req.query.tipo };
      include.required = true;
    }

    let conteudos = await Conteudo.findAll({
      where,
      include: [include],
      order: [['idConteudo', 'DESC']],
    });

    if (req.query.tipo === 'video') {
      const metadata = await getYoutubeVideoMetadata(conteudos.map(({ link }) => link));
      conteudos = conteudos.map((conteudo) => {
        const content = conteudo.toJSON();
        const videoId = extractYoutubeVideoId(content.link);
        return {
          ...content,
          youtube: videoId ? metadata.get(videoId) ?? null : null,
        };
      });
    }

    return res.json({ conteudos });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar conteúdos' });
  }
};

const getConteudo = async (req, res) => {
  try {
    const conteudo = await Conteudo.findByPk(req.params.id, {
      include: [{
        model: Tipo_Conteudo,
        as: 'tipoConteudo',
        attributes: ['idTipo_Conteudo', 'tipo'],
      }],
    });
    if (!conteudo) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }
    return res.json({ conteudo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
};

const createConteudo = async (req, res) => {
  try {
    const conteudo = await Conteudo.create(req.body);
    await conteudo.reload({ include: [{ model: Tipo_Conteudo, as: 'tipoConteudo' }] });
    return res.status(201).json({ conteudo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar conteúdo' });
  }
};

const updateConteudo = async (req, res) => {
  try {
    const conteudo = await Conteudo.findByPk(req.params.id);
    if (!conteudo) return res.status(404).json({ error: 'Conteúdo não encontrado' });

    await conteudo.update(req.body);
    await conteudo.reload({ include: [{ model: Tipo_Conteudo, as: 'tipoConteudo' }] });
    return res.json({ conteudo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar conteúdo' });
  }
};

const deleteConteudo = async (req, res) => {
  try {
    const conteudo = await Conteudo.findByPk(req.params.id);
    if (!conteudo) return res.status(404).json({ error: 'Conteúdo não encontrado' });

    await conteudo.destroy();
    return res.json({ message: 'Conteúdo removido com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover conteúdo' });
  }
};

module.exports = {
  listContentTypes,
  listConteudos,
  getConteudo,
  createConteudo,
  updateConteudo,
  deleteConteudo,
};
