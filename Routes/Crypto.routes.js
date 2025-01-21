const express = require('express');
const router = express.Router();
const CryptoController = require('../Controllers/Crypto.controller');

router.post('/crypto', CryptoController.create);
router.get('/crypto', CryptoController.findAll);
router.get('/crypto/:id', CryptoController.findOne);
router.delete('/crypto/:id', CryptoController.delete);
router.put('/crypto/:id', CryptoController.update);

module.exports = router;
