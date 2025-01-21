const express = require('express');
const router = express.Router();
const ArticleController = require('../Controllers/Article.controller');
const LogFunction = require('../logFunction');

router.get('/articles', ArticleController.findAll);
router.post('/articles', ArticleController.create);

module.exports = router;
