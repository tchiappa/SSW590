const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'database',
    port: 3306,
    user: 'express',
    password: 'Express!23',
    database: 'ssw590'
});

connection.connect();

module.exports = connection;