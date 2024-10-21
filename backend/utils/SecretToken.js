require("dotenv").config({ path: "config/.env" });
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "1d" });
};

module.exports.getTokenSubject = async (token) => {
  const payload = jwt.verify(token, process.env.TOKEN_KEY);
  return payload.id;
};
