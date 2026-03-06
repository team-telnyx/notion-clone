import knex from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';

if (!knexConfig[environment]) {
  throw new Error(`Invalid NODE_ENV: ${environment}. Valid values are: development, test, production`);
}

export const db = knex(knexConfig[environment]);

export async function verifyConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection verified successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    await db.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}
