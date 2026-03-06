import knex from 'knex';
import knexConfig from '../../knexfile.ts';

const environment = process.env.NODE_ENV || 'development';
export const db = knex(knexConfig[environment]!);
