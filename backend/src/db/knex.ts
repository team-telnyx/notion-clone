import knex from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
export const db = knex(knexConfig[environment]);

export async function testConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  await db.destroy();
}
