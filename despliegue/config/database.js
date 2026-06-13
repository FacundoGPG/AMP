require("dotenv").config();
const { Pool } = require("pg");

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  console.log(
    "DATABASE_URL starts with:",
    process.env.DATABASE_URL.substring(0, 25)
  );
}

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
  maxLifetimeSeconds: parseNumber(process.env.PG_MAX_LIFETIME_SECONDS, 60),
  allowExitOnIdle: true
});

pool.on("error", (error) => {
  console.error("PostgreSQL idle client error:", error);
});

module.exports = pool;  
