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
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 300000
    },
    migrations: {
      directory: './migrations'
    }
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'notion_clone',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'notion_clone'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 300000
    },
    migrations: {
      directory: './migrations'
    }
  }
};

export default config;
