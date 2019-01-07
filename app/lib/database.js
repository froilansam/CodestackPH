// This file pools database connection.
var mysql = require('mysql');

// Create variable pool that is undefined
var pool;

module.exports = () => {

    // If pool already has value (Pool has been connected), return.
    if(pool) return pool;

    // Otherwise, create new pool.
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // return pool.
    return pool;
}