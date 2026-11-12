const express = require('express');
const ImageKit = require('imagekit');
const { authMiddleware } = require('../middlewares/auth');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const imagekitRouter = express.Router();

imagekitRouter.get('/auth', authMiddleware, (_req, res) => {
  res.json(imagekit.getAuthenticationParameters());
});

module.exports = {imagekitRouter}
