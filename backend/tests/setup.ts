import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'notion_clone';

beforeAll(async () => {
  try {
    const { db } = require('../src/db/knex');
    await db.raw('SELECT 1');
  } catch (error) {
    console.warn('Database connection not available, some tests may be skipped');
  }
});

afterAll(async () => {
  try {
    const { db } = require('../src/db/knex');
    await db.destroy();
  } catch {
  }
});
