const sql = require('../config/db');

const Crypto = function (crypto) {
    this.name = crypto.name;
    this.price = crypto.price;
    this.devise = crypto.devise;
}

Crypto.create = (newCrypto, result) => {
    sql.query("INSERT INTO crypto SET ?", newCrypto, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Created crypto: ", { id: res.insertId, ...newCrypto });
        result(null, { id: res.insertId, ...newCrypto });
    });
}

Crypto.findAll = (result) => {
    sql.query("SELECT * FROM crypto", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Crypto: ", res);
        result(null, res);
    });
}

Crypto.update = (id, crypto, result) => {
    sql.query("UPDATE crypto SET name = ?, price = ?, devise = ? WHERE id = ?", [crypto.name, crypto.price, crypto.devise, id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Updated crypto: ", { id: id, ...crypto });
        result(null, { id: id, ...crypto });
    });
}

Crypto.findOne = (id, result) => {
    sql.query("SELECT * FROM crypto WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("Found crypto: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
}

Crypto.delete = (id, result) => {
    sql.query("DELETE FROM crypto WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted crypto with id: ", id);
        result(null, res);
    });
}

module.exports = Crypto