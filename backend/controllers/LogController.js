const pool = require("../config/db");

module.exports.CreateLog = async ({ userId, action }) => {
  const q =
    "INSERT INTO logs (date_time, action, user_id) VALUES (NOW() AT TIME ZONE 'Asia/Manila', $1, $2) RETURNING id";
  const values = [action, userId];

  try {
    const data = await pool.query(q, values);
    return {
      success: true,
      logId: data.rows[0].id,
    };
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while logging the action.",
    };
  }
};
