import { db } from '../src/db/knex';
import knexConfig from '../knexfile';

describe('Database Tests', () => {
  afterAll(async () => {
    await db.destroy();
  });

  describe('Database Connection', () => {
    it('should connect to database and execute raw query', async () => {
      const result = await db.raw('SELECT 1 AS result');
      expect(result.rows[0].result).toBe(1);
    });

    it('should be connected to notion_clone database', async () => {
      const result = await db.raw('SELECT current_database() AS db_name');
      expect(result.rows[0].db_name).toBe('notion_clone');
    });
  });

  describe('Connection Pool Configuration', () => {
    it('should have pool configuration', () => {
      const env = process.env.NODE_ENV || 'development';
      const config = knexConfig[env];
      
      expect(config).toHaveProperty('pool');
      expect(config?.pool).toHaveProperty('min');
      expect(config?.pool).toHaveProperty('max');
    });

    it('should have pool min of 2 and max of 10', () => {
      const env = process.env.NODE_ENV || 'development';
      const config = knexConfig[env];
      
      expect(config?.pool?.min).toBe(2);
      expect(config?.pool?.max).toBe(10);
    });
  });

  describe('Knex Configuration', () => {
    it('should export valid knex config with development environment', () => {
      expect(knexConfig).toHaveProperty('development');
      expect(knexConfig.development).toHaveProperty('client', 'pg');
    });

    it('should have migrations directory configured', () => {
      expect(knexConfig.development.migrations).toHaveProperty('directory');
      expect(knexConfig.development.migrations?.directory).toContain('migrations');
    });
  });
});
