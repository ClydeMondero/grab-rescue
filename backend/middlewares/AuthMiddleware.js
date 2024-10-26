const db = require("../config/db");

require("dotenv").config({ path: "config/.env" });
const { TOKEN_KEY } = process.env;

const jwt = require("jsonwebtoken");

module.exports.UserVerification = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Cookie not found",
    });
  }

  jwt.verify(token, TOKEN_KEY, (err, data) => {
    if (err) {
      return res.json({ success: false, message: "Token not verified" });
    } else {
      const q = "SELECT * FROM users WHERE id = $1";

      db.query(q, [data.id], (err, data) => {
        if (err) {
          return res.json({ success: false });
        } else {
          return res.json({
            success: true,
            user: data.rows[0],
          });
        }
      });
    }
  });
};
