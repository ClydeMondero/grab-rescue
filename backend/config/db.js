const pg = require("pg");
const env = require("./env");
const { connectionString, ssl } = require("pg/lib/defaults");

const { Pool } = pg;

//create database connection
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkConnection() {
  try {
    const client = await pool.connect(); // Try to acquire a client
    console.log("Database connected successfully");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Error connecting to the pool:", err.stack);
  }
}

checkConnection();

module.exports = pool;
