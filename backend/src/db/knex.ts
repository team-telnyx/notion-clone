import knex from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';

// Validate environment
if (!knexConfig[environment]) {
  throw new Error(`Invalid NODE_ENV: ${environment}. Expected 'development', 'production', or 'test'.`);
}

export const db = knex(knexConfig[environment]);

// Graceful shutdown handler
const shutdown = async (): Promise<void> => {
  console.log('Closing database connection...');
  await db.destroy();
  console.log('Database connection closed.');
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default db;
