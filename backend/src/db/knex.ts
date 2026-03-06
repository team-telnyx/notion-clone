import Knex from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
export const db = Knex(knexConfig[environment]);
