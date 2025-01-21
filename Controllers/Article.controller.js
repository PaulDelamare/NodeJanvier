const Article = require('../Models/Article.model');

exports.findAll = async (req, res) => {
    const articles = await Article.find();

    res.status(200).json(articles);
}

exports.create = async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    await article.save();

    res.status(201).json(article);
}
