const express = require('express');
const router = express.Router();
const LanguageController = require('../Controllers/Language.controller');

router.post('/language', LanguageController.create);
router.get('/language', LanguageController.findAll);
router.get('/language/:id', LanguageController.findOne);
router.delete('/language/:id', LanguageController.delete);
router.put('/language/:id', LanguageController.update);
router.get('/language', LanguageController.getPagination);

module.exports = router;
