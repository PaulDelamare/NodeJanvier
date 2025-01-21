const PresentationModel = require("../Models/Presentation.model");

exports.findAll = async (req, res) => {
    const presentations = await PresentationModel.find().populate('article');

    res.status(200).json(presentations);
}

exports.create = async (req, res) => {
    const presentation = new PresentationModel({
        article: req.body.article
    });

    await presentation.save();

    res.status(201).json(presentation);
}

exports.update = async (req, res) => {
    const presentation = await PresentationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(presentation);
}
