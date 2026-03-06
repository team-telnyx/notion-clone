import fs from 'fs';
import path from 'path';

describe('Backend Structure Tests', () => {
  const backendPath = path.join(__dirname, '..');

  describe('Directory Structure', () => {
    test('should have required directories', () => {
      const requiredDirs = [
        'src/routes',
        'src/middleware',
        'src/db',
        'src/types',
        'migrations'
      ];

      requiredDirs.forEach(dir => {
        const fullPath = path.join(backendPath, dir);
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isDirectory()).toBe(true);
      });
    });

    test('should have src directory', () => {
      const srcPath = path.join(backendPath, 'src');
      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.statSync(srcPath).isDirectory()).toBe(true);
    });
  });

  describe('Configuration Files', () => {
    test('should have package.json with correct scripts', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      expect(fs.existsSync(packageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toContain('nodemon');
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.start).toBeDefined();
    });

    test('should have tsconfig.json with correct settings', () => {
      const tsconfigPath = path.join(backendPath, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
      expect(tsconfig.compilerOptions.rootDir).toBe('./src');
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
    });

    test('should have knexfile.ts with database configuration', () => {
      const knexfilePath = path.join(backendPath, 'knexfile.ts');
      expect(fs.existsSync(knexfilePath)).toBe(true);
      
      const knexfileContent = fs.readFileSync(knexfilePath, 'utf-8');
      expect(knexfileContent).toContain("client: 'pg'");
      expect(knexfileContent).toContain('dotenv.config()');
      expect(knexfileContent).toContain('process.env.DB_HOST');
      expect(knexfileContent).toContain('process.env.DB_PORT');
      expect(knexfileContent).toContain('process.env.DB_NAME');
    });

    test('should have .env.example file with required variables', () => {
      const envExamplePath = path.join(backendPath, '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
      
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envContent).toContain('PORT=');
      expect(envContent).toContain('DB_HOST=');
      expect(envContent).toContain('DB_PORT=');
      expect(envContent).toContain('DB_NAME=');
      expect(envContent).toContain('DB_USER=');
      expect(envContent).toContain('JWT_SECRET=');
    });
  });

  describe('Source Files', () => {
    test('should have db/knex.ts with knex initialization', () => {
      const knexTsPath = path.join(backendPath, 'src/db/knex.ts');
      expect(fs.existsSync(knexTsPath)).toBe(true);
      
      const content = fs.readFileSync(knexTsPath, 'utf-8');
      expect(content).toContain("import knex from 'knex'");
      expect(content).toContain('export const db');
    });

    test('should have types/index.ts with model interfaces', () => {
      const typesPath = path.join(backendPath, 'src/types/index.ts');
      expect(fs.existsSync(typesPath)).toBe(true);
      
      const content = fs.readFileSync(typesPath, 'utf-8');
      expect(content).toContain('export interface User');
      expect(content).toContain('export interface Workspace');
      expect(content).toContain('export interface Page');
      expect(content).toContain('export interface Block');
      expect(content).toContain('export interface WorkspaceMember');
    });
  });
});
