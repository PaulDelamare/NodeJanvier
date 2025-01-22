const sql = require('../config/db');

const Language = function (language) {
    this.name = language.name;
}

Language.create = (newLanguage, result) => {
    sql.query("INSERT INTO language SET ?", newLanguage, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Created language: ", { id: res.insertId, ...newLanguage });
        result(null, { id: res.insertId, ...newLanguage });
    });
}

Language.findAll = (result) => {
    sql.query("SELECT * FROM language", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Language: ", res);
        result(null, res);
    });
}

Language.update = (id, language, result) => {
    sql.query("UPDATE language SET name = ? WHERE id = ?", [language.name, id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Updated language: ", { id: id, ...language });
        result(null, { id: id, ...language });
    });
}

Language.findOne = (id, result) => {
    sql.query("SELECT * FROM language WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("Found language: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
}

Language.delete = (id, result) => {
    sql.query("DELETE FROM language WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted language with id: ", id);
        result(null, res);
    });
}

Language.getPagination = (limit, offset, result) => {
    sql.query("SELECT * FROM language LIMIT ? OFFSET ?", [limit, offset], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}

module.exports = Language