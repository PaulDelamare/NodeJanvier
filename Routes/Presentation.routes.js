const express = require('express');
const router = express.Router();
const PresentationControlelr = require('../Controllers/Presentation.controller');

router.get('/presentations', PresentationControlelr.findAll);
router.post('/presentations', PresentationControlelr.create);
router.put('/presentations/:id', PresentationControlelr.update);

module.exports = router;
