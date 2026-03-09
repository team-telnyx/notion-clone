import knex from 'knex';
import type { Knex } from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
export const db: Knex = knex(knexConfig[environment]);

export async function testConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    await db.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error instanceof Error ? error.message : error);
  }
}
