// setup-factdrop-db.js
require("dotenv").config();
const { Client } = require("pg");

const DB_NAME = "factdrop";

const domains = [
  "Science",
  "Espace",
  "Histoire",
  "Géographie",
  "Animaux",
  "Corps Humain",
  "Technologie",
  "Psychologie",
  "Nourriture",
  "Faits Étranges",
];

function validateDbName(name) {
  // Prevent unsafe database names
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid database name: ${name}`);
  }
}

async function createDatabaseIfNotExists() {
  validateDbName(DB_NAME);

  const adminClient = new Client({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGADMIN_DB || "postgres", // connect to default admin db
  });

  await adminClient.connect();

  try {
    const checkResult = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (checkResult.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database "${DB_NAME}" created.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } finally {
    await adminClient.end();
  }
}

async function createTableAndInsertDomains() {
  const appClient = new Client({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: DB_NAME,
  });

  await appClient.connect();

  try {
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Table "domains" ready.');

    for (const domain of domains) {
      await appClient.query(
        `
        INSERT INTO domains (name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING;
        `,
        [domain]
      );
    }

    console.log(`${domains.length} domains inserted or already present.`);

    const result = await appClient.query(
      "SELECT id, name, created_at FROM domains ORDER BY id ASC"
    );

    console.log("\nSaved domains:");
    console.table(result.rows);
  } finally {
    await appClient.end();
  }
}

async function main() {
  try {
    await createDatabaseIfNotExists();
    await createTableAndInsertDomains();
    console.log("\nSetup finished successfully.");
  } catch (error) {
    console.error("Setup failed:", error.message);
    process.exit(1);
  }
}

main();