import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { db } from '../../db/knex';

describe('AC-3: Knex Database Configuration', () => {
  it('should export knex database instance', () => {
    expect(db).toBeDefined();
    expect(typeof db.select).toBe('function');
  });

  it('should have configured client as postgres', () => {
    const client = db.client.config.client;
    expect(client).toBe('pg');
  });

  it('should have migrations directory configured', () => {
    const migrationsConfig = db.client.config.migrations;
    expect(migrationsConfig).toBeDefined();
    expect(migrationsConfig.directory).toBeDefined();
  });
});

describe('EC-4: Environment-based Configuration', () => {
  it('should read DB_HOST from environment', () => {
    const config = db.client.config.connection;
    expect(config.host).toBeDefined();
    expect(config.host).toBe(process.env.DB_HOST || 'pgbot-main-18.internal');
  });

  it('should read DB_PORT from environment', () => {
    const config = db.client.config.connection;
    expect(config.port).toBeDefined();
    expect(Number(config.port)).toBe(Number(process.env.DB_PORT) || 5432);
  });

  it('should read DB_NAME from environment', () => {
    const config = db.client.config.connection;
    expect(config.database).toBeDefined();
    expect(config.database).toBe(process.env.DB_NAME || 'notion_clone');
  });

  it('should read DB_USER from environment', () => {
    const config = db.client.config.connection;
    expect(config.user).toBeDefined();
    expect(config.user).toBe(process.env.DB_USER || 'notion_clone');
  });

  it('should handle missing DB_PASSWORD gracefully', () => {
    const config = db.client.config.connection;
    expect(typeof config.password).toBe('string');
  });
});

describe('EC-5: Graceful Shutdown', () => {
  it('should expose destroy method for connection cleanup', () => {
    expect(typeof db.destroy).toBe('function');
  });
});
