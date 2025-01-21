const Crypto = require('../Models/Crypto.mysql');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
    }

    const cryptoInsert = new Crypto({
        name: req.body.name,
        price: req.body.price,
        devise: req.body.devise
    });

    Crypto.create(cryptoInsert, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Crypto."
            });
        else res.send(data);
    });
}

exports.findAll = (req, res) => {
    Crypto.findAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Crypto."
            });
        else res.send(data);
    });
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
    }

    Crypto.update(req.params.id, new Crypto(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Not found Crypto with id ${req.params.id}.` });
            } else {
                res.status(500).send({ message: "Error updating Crypto with id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.findOne = (req, res) => {
    Crypto.findOne(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Not found Crypto with id ${req.params.id}.` });
            } else {
                res.status(500).send({ message: "Error retrieving Crypto with id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.delete = (req, res) => {
    Crypto.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Not found Crypto with id ${req.params.id}.` });
            } else {
                res.status(500).send({ message: "Could not delete Crypto with id " + req.params.id });
            }
        } else res.send({ message: `Crypto was deleted successfully!` });
    });
}