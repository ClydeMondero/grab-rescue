const mysql = require("mysql");
require("dotenv").config({ path: "config/.env" });
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE } =
  process.env;

//create database connection
const db = mysql.createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE,
});

module.exports = db;
