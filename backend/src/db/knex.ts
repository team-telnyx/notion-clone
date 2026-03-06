import knex from 'knex';
import knexConfig from '../config/knex.config';

const environment = process.env.NODE_ENV || 'development';
export const db = knex(knexConfig[environment]);

process.on('SIGTERM', async () => {
  await db.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await db.destroy();
  process.exit(0);
});
