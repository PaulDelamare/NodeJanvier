const express = require('express');
const router = express.Router();
const FactureController = require('../Controllers/Facture.controller');

router.post('/factures', FactureController.createPdf);

module.exports = router;
