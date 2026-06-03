require("dotenv").config();
const { Pool } = require("pg");

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: parseNumber(process.env.PG_POOL_MAX, 1),
  idleTimeoutMillis: parseNumber(process.env.PG_IDLE_TIMEOUT_MS, 1000),
  connectionTimeoutMillis: parseNumber(process.env.PG_CONNECTION_TIMEOUT_MS, 5000),
  allowExitOnIdle: true
});

pool.on("error", (error) => {
  console.error("PostgreSQL idle client error:", error);
});

module.exports = pool;  
