/* =========================================================
   config/db.js — pool de conexões com o MySQL.
   Usamos "pool" (e não uma única conexão) porque ele reaproveita
   conexões entre as requisições, o que é mais estável em produção.
   ========================================================= */

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
