import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'pgbot-main-18.internal',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'notion_clone',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'notion_clone'
    },
    migrations: {
      directory: '../../migrations'
    }
  }
};

export default config;
