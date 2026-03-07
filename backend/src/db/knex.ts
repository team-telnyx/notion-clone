import knex from 'knex';

const knexConfig = require('../../knexfile').default;

const environment = process.env.NODE_ENV || 'development';
export const db = knex(knexConfig[environment]);
