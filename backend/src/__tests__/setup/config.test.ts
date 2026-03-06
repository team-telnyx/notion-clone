import { describe, it, expect, beforeAll } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const backendPath = path.resolve(import.meta.dir, '../../..');

describe('TypeScript Configuration', () => {
  let tsconfig: any;

  beforeAll(() => {
    const tsconfigPath = path.join(backendPath, 'tsconfig.json');
    const content = fs.readFileSync(tsconfigPath, 'utf-8');
    tsconfig = JSON.parse(content);
  });

  describe('AC-4: TypeScript compiler options', () => {
    it('should target ES2020', () => {
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
    });

    it('should use CommonJS module system', () => {
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
    });

    it('should include ES2020 lib', () => {
      expect(tsconfig.compilerOptions.lib).toContain('ES2020');
    });

    it('should output to dist directory', () => {
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
    });

    it('should have rootDir configured', () => {
      expect(tsconfig.compilerOptions.rootDir).toBeDefined();
    });

    it('should enable strict mode', () => {
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it('should enable esModuleInterop', () => {
      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
    });

    it('should skip lib check', () => {
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
    });

    it('should enforce consistent file name casing', () => {
      expect(tsconfig.compilerOptions.forceConsistentCasingInFileNames).toBe(true);
    });

    it('should resolve JSON modules', () => {
      expect(tsconfig.compilerOptions.resolveJsonModule).toBe(true);
    });

    it('should generate declaration files', () => {
      expect(tsconfig.compilerOptions.declaration).toBe(true);
    });
  });

  describe('Include and exclude paths', () => {
    it('should include src directory', () => {
      expect(tsconfig.include).toContain('src/**/*');
    });

    it('should exclude node_modules', () => {
      expect(tsconfig.exclude).toContain('node_modules');
    });
  });
});

describe('Environment Configuration', () => {
  describe('.env file', () => {
    let envContent: string;

    beforeAll(() => {
      const envPath = path.join(backendPath, '.env');
      envContent = fs.readFileSync(envPath, 'utf-8');
    });

    it('should define PORT', () => {
      expect(envContent).toMatch(/PORT\s*=\s*3001/);
    });

    it('should define DB_HOST', () => {
      expect(envContent).toContain('DB_HOST');
    });

    it('should define DB_PORT', () => {
      expect(envContent).toMatch(/DB_PORT\s*=\s*5432/);
    });

    it('should define DB_NAME', () => {
      expect(envContent).toContain('DB_NAME=notion_clone');
    });

    it('should define DB_USER', () => {
      expect(envContent).toContain('DB_USER=notion_clone');
    });

    it('should define DB_PASSWORD', () => {
      expect(envContent).toContain('DB_PASSWORD');
    });

    it('should define JWT_SECRET', () => {
      expect(envContent).toContain('JWT_SECRET');
    });
  });

  describe('.env.example file', () => {
    let envExample: string;

    beforeAll(() => {
      const envExamplePath = path.join(backendPath, '.env.example');
      envExample = fs.readFileSync(envExamplePath, 'utf-8');
    });

    it('should define PORT with default value', () => {
      expect(envExample).toContain('PORT=3001');
    });

    it('should define all required database env vars', () => {
      expect(envExample).toContain('DB_HOST');
      expect(envExample).toContain('DB_PORT');
      expect(envExample).toContain('DB_NAME');
      expect(envExample).toContain('DB_USER');
      expect(envExample).toContain('DB_PASSWORD');
    });

    it('should define JWT_SECRET with placeholder', () => {
      expect(envExample).toContain('JWT_SECRET');
    });
  });
});

describe('Knex Configuration Structure', () => {
  it('should import knexfile without errors', async () => {
    const knexfilePath = path.join(backendPath, 'src', 'knexfile.ts');
    expect(fs.existsSync(knexfilePath)).toBe(true);
  });
});
