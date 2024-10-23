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

module.exports.GetLogs = async (
  actionFilters = [],
  accountTypeFilters = []
) => {
  let q = `
    SELECT 
      l.id AS log_id,
      l.date_time,
      l.action,
      l.user_id,
      u.first_name,
      u.middle_initial,
      u.last_name,
      u.account_type
    FROM 
      logs l
    JOIN 
      users u ON l.user_id = u.id
  `;

  const values = [];
  const conditions = [];

  // Check if there are action filters and construct the WHERE clause
  if (actionFilters.length > 0) {
    const placeholders = actionFilters
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    conditions.push(`l.action ILIKE ANY (ARRAY[${placeholders}])`);
    actionFilters.forEach((action) => values.push(`%${action}%`));
  }

  // Check if there are account type filters and add to the WHERE clause
  if (accountTypeFilters.length > 0) {
    const offset = values.length; // Adjust the index for placeholders
    const placeholders = accountTypeFilters
      .map((_, index) => `$${offset + index + 1}`)
      .join(", ");
    conditions.push(`u.account_type IN (${placeholders})`);
    accountTypeFilters.forEach((type) => values.push(type));
  }

  // Combine conditions
  if (conditions.length > 0) {
    q += ` WHERE ${conditions.join(" AND ")}`;
  }

  q += " ORDER BY l.date_time DESC";

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
