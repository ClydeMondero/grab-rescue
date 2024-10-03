const pool = require("../config/db");
const env = require("../config/env");

module.exports.CreateLog = async (req, res) => {
  const { userId, type, description } = req.body;
  const q =
    "INSERT INTO logs (`user_id`, `type`, `description`) VALUES (?, ?, ?)";
  const values = [userId, type, description];
  pool.query(q, values, (err, data) => {
    if (err) {
      console.error("Error inserting log:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while logging the action." });
    }
    return res.status(201).json({ success: true, logId: data.insertId });
  });
};
