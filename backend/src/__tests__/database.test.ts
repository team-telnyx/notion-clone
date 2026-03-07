import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe('Database Setup - Knex Configuration', () => {
  describe('Database Connection', () => {
    it('should have knexfile configuration', () => {
      const knexfilePath = resolve(__dirname, '../config/knexfile.ts');
      const exists = existsSync(knexfilePath);
      expect(exists).toBe(true);
    });

    it('should have database connection module (db/knex.ts)', () => {
      const dbModulePath = resolve(__dirname, '../db/knex.ts');
      const exists = existsSync(dbModulePath);
      expect(exists).toBe(true);
    });

    it('should have knexfile with pg client configured', () => {
      const knexfilePath = resolve(__dirname, '../config/knexfile.ts');
      const content = readFileSync(knexfilePath, 'utf-8');
      expect(content).toContain("client: 'pg'");
    });

    it('should have knexfile with migrations directory configured', () => {
      const knexfilePath = resolve(__dirname, '../config/knexfile.ts');
      const content = readFileSync(knexfilePath, 'utf-8');
      expect(content).toContain('migrations');
    });

    it('should have migrations directory', () => {
      const migrationsDir = resolve(__dirname, '../../../migrations');
      const exists = existsSync(migrationsDir);
      expect(exists).toBe(true);
    });
  });
});
