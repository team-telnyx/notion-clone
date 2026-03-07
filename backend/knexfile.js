"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
exports.default = config;
