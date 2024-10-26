const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: `${__dirname}/${process.env.NODE_ENV}.env`,
});

module.exports = {
  SITE_URL: process.env.SITE_URL,
  API_URL: process.env.API_URL,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  TOKEN_KEY: process.env.TOKEN_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
