const pool = require("../config/db");

// Create Log
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

// Function to retrieve logs with optional filtering and user details
module.exports.GetLogs = async (actionFilters = []) => {
  let q = `
    SELECT 
      l.id AS log_id,
      l.date_time,
      l.action,
      l.user_id,
      u.first_name,
      u.middle_initial,
      u.last_name
    FROM 
      logs l
    JOIN 
      users u ON l.user_id = u.id
  `;

  const values = [];

  // Check if there are action filters and construct the WHERE clause
  if (actionFilters.length > 0) {
    const placeholders = actionFilters
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    q += ` WHERE l.action ILIKE ANY (ARRAY[${placeholders}])`; // Use ILIKE for case-insensitive matching
    actionFilters.forEach((action) => values.push(`%${action}%`)); // Use wildcard for partial matching
  }

  q += " ORDER BY l.date_time DESC"; // Order by the latest logs first

  try {
    const data = await pool.query(q, values);
    return {
      success: true,
      logs: data.rows,
    };
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while retrieving logs.",
    };
  }
};
