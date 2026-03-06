import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';

const config: { [key: string]: Knex.Knex.Config } = {
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
      directory: './migrations'
    }
  }
};

export const db = Knex(config[environment]);
