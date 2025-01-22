const Language = require('../Models/Language.mysql');
const Redis = require('ioredis');
const redis = new Redis();

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
    }
    const cacheKey = 'languages';
    redis.del(cacheKey);

    const languageInsert = new Language({
        name: req.body.name,
        price: req.body.price,
        devise: req.body.devise
    });

    Language.create(languageInsert, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Language."
            });
        else res.send(data);
    });
}

exports.findAll = (req, res) => {
    const cacheKey = 'languages';
    redis.get(cacheKey, (err, data) => {
        if (err) {
            console.error('Redis error:', err);
        } else if (data) {
            console.log('Redis logged');
            return res.send(JSON.parse(data));
        } else {
            Language.findAll((err, data) => {
                if (err) {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving Language."
                    });
                } else {
                    redis.set(cacheKey, JSON.stringify(data), 'EX', 60000);
                    return res.send(data);
                }
            });
        }
    });
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
    }

    const cacheKey = `language:${req.params.id}`;
    redis.del(cacheKey);

    Language.update(req.params.id, new Language(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Not found Language with id ${req.params.id}.` });
            } else {
                res.status(500).send({ message: "Error updating Language with id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.findOne = (req, res) => {

    const cacheKey = `language:${req.params.id}`;
    redis.get(cacheKey, (err, data) => {
        if (err) {
            console.error('Redis error:', err);
        } else if (data) {
            console.log('Redis logged');
            return res.send(JSON.parse(data));
        } else {
            Language.findOne(req.params.id, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving Language."
                    });
                } else {
                    redis.set(cacheKey, JSON.stringify(data), 'EX', 60000);
                    return res.send(data);
                }
            });
        }
    });
}

exports.delete = (req, res) => {

    const cacheKey = `language:${req.params.id}`;
    redis.del(cacheKey);
    Language.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Not found Language with id ${req.params.id}.` });
            } else {
                res.status(500).send({ message: "Could not delete Language with id " + req.params.id });
            }
        } else res.send({ message: `Language was deleted successfully!` });
    });
}

exports.getPagination = (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.size ? req.query.size : 3;
    const offset = (page - 1) * limit;

    const cacheKey = `languages:${page}:${limit}`;
    redis.get(cacheKey, (err, data) => {
        if (err) {
            console.error('Redis error:', err);
        } else if (data) {
            console.log('Redis logged');
            return res.send(JSON.parse(data));
        } else {
            Language.getPagination(limit, offset, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving Language."
                    });
                } else {
                    redis.set(cacheKey, JSON.stringify(data), 'EX', 60000);
                    return res.send(data);
                }
            });
        }
    });
}