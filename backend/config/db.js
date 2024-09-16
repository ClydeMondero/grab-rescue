const mysql = require("mysql");
const env = require("./env");

//create database connection
const db = mysql.createConnection({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  port: env.DATABASE_PORT,
});

db.connect(function (err) {
  if (err) {
    console.log("Error connecting to Database", err.code);
  } else {
    console.log("Database connection established on port " + env.DATABASE_PORT);
  }
});

module.exports = db;
