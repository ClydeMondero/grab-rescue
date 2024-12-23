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
  accountTypeFilters = [],
  startDate = null,
  endDate = null,
  sortOrder = null // New parameter for sorting order
) => {
  let q = `
    SELECT 
      l.id AS log_id,
      l.date_time,
      l.action,
      l.user_id,
      u.first_name,
      u.middle_name,
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
    const offset = values.length;
    const placeholders = accountTypeFilters
      .map((_, index) => `$${offset + index + 1}`)
      .join(", ");
    conditions.push(`u.account_type IN (${placeholders})`);
    accountTypeFilters.forEach((type) => values.push(type));
  }

  // Add date filters if provided
  if (startDate) {
    values.push(startDate);
    conditions.push(`l.date_time >= $${values.length}`);
  }
  if (endDate) {
    values.push(endDate);
    conditions.push(`l.date_time <= $${values.length}`);
  }

  // Combine conditions
  if (conditions.length > 0) {
    q += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Set default order if sortOrder is not provided
  const orderBy =
    sortOrder === "asc" ? "ASC" : sortOrder === "desc" ? "DESC" : "DESC";
  q += ` ORDER BY l.date_time ${orderBy}`;

  try {
    const data = await pool.query(q, values);
    return {
      success: true,
      logs: data.rows.map(({ log_id, ...rest }) => ({ id: log_id, ...rest })),
    };
  } catch (err) {
    console.error("Error executing query:", err);
    return {
      success: false,
      message: "An error occurred while retrieving logs.",
    };
  }
};
