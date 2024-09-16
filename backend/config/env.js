const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: `${__dirname}/${process.env.NODE_ENV}.env`,
});

module.exports = {
  PATH: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_PORT: process.env.DATABASE_PORT,
  EMAIL_USER: "bhenzmharlbartolome@ymail.com",
  EMAIL_PASS: "",
  PORT: process.env.PORT,
  TOKEN_KEY: process.env.TOKEN_KEY,
};
