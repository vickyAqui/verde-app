const express = require('express');
const ImageKit = require('imagekit');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { authMiddleware } = require('../middlewares/auth');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const imagekitRouter = express.Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single('file');
const dailyImageLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => String(req.user.idUsuario),
  handler: (_req, res) => {
    res.status(429).json({ error: 'Limite diário de envio de 20 imagens atingido.' });
  },
});

imagekitRouter.post('/upload', authMiddleware, dailyImageLimit, (req, res, next) => {
  imageUpload(req, res, (err) => {
    if (err) {
      const tooLarge = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE';
      return res.status(tooLarge ? 413 : 400).json({
        error: tooLarge ? 'A imagem deve ter no máximo 5 MB.' : 'Não foi possível receber a imagem.',
      });
    }

    next();
  });
}, async (req, res) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ error: 'Envie um arquivo de imagem.' });
  }

  try {
    const uploaded = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: '/denuncias',
      useUniqueFileName: true,
    });
    return res.json({ url: uploaded.url });
  } catch (err) {
    console.error('Erro ao enviar imagem para o ImageKit', err);
    return res.status(502).json({ error: 'Não foi possível enviar a imagem.' });
  }
});

module.exports = {imagekitRouter}
