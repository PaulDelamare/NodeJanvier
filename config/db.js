const mysql = require('mysql');
const config = require('./db.config');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database MySql');
});

module.exports = connection;