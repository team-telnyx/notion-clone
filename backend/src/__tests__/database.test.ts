import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe('Database Setup - Knex Configuration', () => {
  const backendRoot = resolve(__dirname, '../..');
  
  describe('Database Connection', () => {
    it('should have knexfile configuration at backend root', () => {
      const knexfilePath = resolve(backendRoot, 'knexfile.ts');
      const exists = existsSync(knexfilePath);
      expect(exists).toBe(true);
    });

    it('should have database connection module (db/knex.ts)', () => {
      const dbModulePath = resolve(__dirname, '../db/knex.ts');
      const exists = existsSync(dbModulePath);
      expect(exists).toBe(true);
    });

    it('should have knexfile with pg client configured', () => {
      const knexfilePath = resolve(backendRoot, 'knexfile.ts');
      const content = readFileSync(knexfilePath, 'utf-8');
      expect(content).toContain("client: 'pg'");
    });

    it('should have knexfile with migrations directory configured', () => {
      const knexfilePath = resolve(backendRoot, 'knexfile.ts');
      const content = readFileSync(knexfilePath, 'utf-8');
      expect(content).toContain('migrations');
    });

    it('should have migrations directory', () => {
      const migrationsDir = resolve(backendRoot, 'migrations');
      const exists = existsSync(migrationsDir);
      expect(exists).toBe(true);
    });

    it('should have seeds directory', () => {
      const seedsDir = resolve(backendRoot, 'seeds');
      const exists = existsSync(seedsDir);
      expect(exists).toBe(true);
    });
  });
});
