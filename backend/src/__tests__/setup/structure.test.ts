import { describe, it, expect, beforeAll } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const backendPath = path.resolve(import.meta.dir, '../../..');

describe('Backend Directory Structure', () => {

  describe('AC-5: Required source directories exist', () => {
    it('should have src/routes directory', () => {
      const dir = path.join(backendPath, 'src', 'routes');
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    });

    it('should have src/middleware directory', () => {
      const dir = path.join(backendPath, 'src', 'middleware');
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    });

    it('should have src/db directory', () => {
      const dir = path.join(backendPath, 'src', 'db');
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    });

    it('should have src/types directory', () => {
      const dir = path.join(backendPath, 'src', 'types');
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    });
  });

  describe('Migrations directory', () => {
    it('should have migrations directory', () => {
      const dir = path.join(backendPath, 'migrations');
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    });
  });
});

describe('Configuration Files', () => {

  describe('AC-4: TypeScript configuration exists', () => {
    it('should have tsconfig.json file', () => {
      const file = path.join(backendPath, 'tsconfig.json');
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).isFile()).toBe(true);
    });
  });

  describe('Database configuration', () => {
    it('should have knexfile.ts', () => {
      const file = path.join(backendPath, 'src', 'knexfile.ts');
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).isFile()).toBe(true);
    });
  });

  describe('Environment configuration', () => {
    it('should have .env file', () => {
      const file = path.join(backendPath, '.env');
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).isFile()).toBe(true);
    });

    it('should have .env.example file', () => {
      const file = path.join(backendPath, '.env.example');
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).isFile()).toBe(true);
    });
  });

  describe('EC-1: Version control configuration exists', () => {
    it('should have .gitignore file', () => {
      const file = path.join(backendPath, '.gitignore');
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).isFile()).toBe(true);
    });

    it('.gitignore should exclude node_modules', () => {
      const gitignore = path.join(backendPath, '.gitignore');
      const content = fs.readFileSync(gitignore, 'utf-8');
      expect(content).toContain('node_modules');
    });

    it('.gitignore should exclude .env file', () => {
      const gitignore = path.join(backendPath, '.gitignore');
      const content = fs.readFileSync(gitignore, 'utf-8');
      expect(content).toMatch(/\.env(?!\.example)/);
    });

    it('.gitignore should exclude dist directory', () => {
      const gitignore = path.join(backendPath, '.gitignore');
      const content = fs.readFileSync(gitignore, 'utf-8');
      expect(content).toContain('dist');
    });
  });
});

describe('Package Configuration', () => {
  let packageJson: any;

  beforeAll(() => {
    const packageJsonPath = path.join(backendPath, 'package.json');
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  });

  describe('Required dependencies', () => {
    it('should have express as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('express');
    });

    it('should have cors as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('cors');
    });

    it('should have dotenv as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('dotenv');
    });

    it('should have knex as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('knex');
    });

    it('should have pg as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('pg');
    });

    it('should have bcryptjs as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('bcryptjs');
    });

    it('should have jsonwebtoken as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('jsonwebtoken');
    });

    it('should have uuid as dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('uuid');
    });
  });

  describe('Required dev dependencies', () => {
    it('should have typescript as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('typescript');
    });

    it('should have ts-node as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('ts-node');
    });

    it('should have @types/node as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/node');
    });

    it('should have @types/express as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/express');
    });

    it('should have @types/cors as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/cors');
    });

    it('should have @types/bcryptjs as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/bcryptjs');
    });

    it('should have @types/jsonwebtoken as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/jsonwebtoken');
    });

    it('should have @types/pg as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/pg');
    });

    it('should have @types/uuid as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('@types/uuid');
    });

    it('should have nodemon as devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('nodemon');
    });
  });

  describe('Required npm scripts', () => {
    it('should have dev script', () => {
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(packageJson.scripts.dev).toContain('nodemon');
      expect(packageJson.scripts.dev).toContain('ts-node');
    });

    it('should have build script', () => {
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts.build).toBe('tsc');
    });

    it('should have start script', () => {
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts.start).toBe('node dist/index.js');
    });

    it('should have test script', () => {
      expect(packageJson.scripts).toHaveProperty('test');
    });
  });
});
