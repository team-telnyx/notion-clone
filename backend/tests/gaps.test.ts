import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../src/index';

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

describe('Gap Analysis Tests - Infrastructure Requirements', () => {
  const backendDir = path.join(__dirname, '..');

  describe('GAP-1: Database Connectivity Verification', () => {
    test('should have database connection configured in Knex', () => {
      const knexConfigPath = path.join(backendDir, 'knexfile.ts');
      const content = fs.readFileSync(knexConfigPath, 'utf8');
      
      expect(content).toContain('development');
      expect(content).toContain("client: 'pg'");
    });
  });

  describe('GAP-2: .gitignore File', () => {
    test('should have .gitignore file', () => {
      const gitignorePath = path.join(backendDir, '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);
    });

    test('should exclude node_modules in .gitignore', () => {
      const gitignorePath = path.join(backendDir, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf8');
      
      expect(content).toContain('node_modules');
    });

    test('should exclude dist directory in .gitignore', () => {
      const gitignorePath = path.join(backendDir, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf8');
      
      expect(content).toContain('dist');
    });

    test('should exclude .env file in .gitignore', () => {
      const gitignorePath = path.join(backendDir, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf8');
      
      expect(content).toContain('.env');
    });
  });

  describe('GAP-3: Auth Middleware', () => {
    test('should have auth middleware file', () => {
      const authMiddlewarePath = path.join(backendDir, 'src/middleware/auth.ts');
      expect(fs.existsSync(authMiddlewarePath)).toBe(true);
    });

    test('should import jsonwebtoken', () => {
      const authMiddlewarePath = path.join(backendDir, 'src/middleware/auth.ts');
      const content = fs.readFileSync(authMiddlewarePath, 'utf8');
      expect(content).toMatch(/import.*jsonwebtoken|import.*jwt/);
    });
  });

  describe('GAP-4: API Prefix /api', () => {
    test('should have health endpoint working', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });
  });

  describe('GAP-5: Environment Validation', () => {
    test('should have .env.example file', () => {
      const envExamplePath = path.join(backendDir, '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    test('should define required environment variables in .env.example', () => {
      const envExamplePath = path.join(backendDir, '.env.example');
      const content = fs.readFileSync(envExamplePath, 'utf8');
      
      expect(content).toContain('PORT');
      expect(content).toContain('DB_HOST');
      expect(content).toContain('DB_PORT');
      expect(content).toContain('DB_NAME');
      expect(content).toContain('DB_USER');
      expect(content).toContain('JWT_SECRET');
    });
  });

  describe('GAP-6: Error Handling Middleware', () => {
    test('should handle 404 errors gracefully', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });

    test('should have error handling middleware in index.ts', () => {
      const indexPath = path.join(backendDir, 'src/index.ts');
      const content = fs.readFileSync(indexPath, 'utf8');
      
      expect(content).toMatch(/app\.use\(.*err/s);
    });
  });

  describe('GAP-7: Migration Files', () => {
    test('should have migrations directory', () => {
      const migrationsDir = path.join(backendDir, 'migrations');
      expect(fs.existsSync(migrationsDir)).toBe(true);
      expect(fs.statSync(migrationsDir).isDirectory()).toBe(true);
    });
  });

  describe('GAP-8: NPM Scripts for Database Operations', () => {
    test('should have migrate:latest script', () => {
      expect(packageJson.scripts).toHaveProperty('migrate:latest');
    });

    test('should have migrate:rollback script', () => {
      expect(packageJson.scripts).toHaveProperty('migrate:rollback');
    });

    test('should have seed:run script', () => {
      expect(packageJson.scripts).toHaveProperty('seed:run');
    });

    test('migrate scripts should use knex', () => {
      expect(packageJson.scripts['migrate:latest']).toMatch(/knex/);
      expect(packageJson.scripts['migrate:rollback']).toMatch(/knex/);
      expect(packageJson.scripts['seed:run']).toMatch(/knex/);
    });
  });
});
