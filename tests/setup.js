const { Client } = require('pg');

const testDbConfig = {
  host: process.env.DB_HOST || 'pgbot-main-18.internal',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'notion_clone',
  user: process.env.DB_USER || 'notion_clone',
};

global.testDbConfig = testDbConfig;

async function cleanupTestData() {
  const client = new Client(testDbConfig);
  await client.connect();
  try {
    await client.query('DELETE FROM blocks WHERE 1=1');
    await client.query('DELETE FROM pages WHERE 1=1');
    await client.query('DELETE FROM workspace_members WHERE 1=1');
    await client.query('DELETE FROM workspaces WHERE 1=1');
    await client.query('DELETE FROM users WHERE 1=1');
  } finally {
    await client.end();
  }
}

global.cleanupTestData = cleanupTestData;

beforeAll(async () => {
  const client = new Client({
    host: testDbConfig.host,
    port: testDbConfig.port,
    database: testDbConfig.database,
    user: process.env.DB_SUPERUSER || testDbConfig.user,
  });
  await client.connect();
  await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await client.end();
});

afterAll(async () => {
  await cleanupTestData();
});
