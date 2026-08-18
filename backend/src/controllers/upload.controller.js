const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const fileUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3333'}/uploads/${req.file.filename}`;

    return res.json({ url: fileUrl, filename: req.file.filename });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer upload' });
  }
};

module.exports = { uploadFile };
