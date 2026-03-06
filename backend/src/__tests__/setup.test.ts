import fs from 'fs';
import path from 'path';

describe('Project Setup Tests', () => {
  const basePath = path.resolve(__dirname, '../..');

  describe('TC-4: Directory Structure', () => {
    const requiredDirectories = [
      'src',
      'src/routes',
      'src/middleware',
      'src/db',
      'src/types',
      'migrations'
    ];

    requiredDirectories.forEach(dir => {
      it(`should have ${dir} directory`, () => {
        const dirPath = path.join(basePath, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      });
    });
  });

  describe('TC-4: Required Files', () => {
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'knexfile.ts',
      'src/index.ts',
      'src/db/knex.ts',
      'src/types/index.ts'
    ];

    requiredFiles.forEach(file => {
      it(`should have ${file} file`, () => {
        const filePath = path.join(basePath, file);
        expect(fs.existsSync(filePath)).toBe(true);
        expect(fs.statSync(filePath).isFile()).toBe(true);
      });
    });
  });

  describe('TC-4: Package.json Configuration', () => {
    let packageJson: any;

    beforeAll(() => {
      const packagePath = path.join(basePath, 'package.json');
      packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    });

    it('should have required scripts', () => {
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts).toHaveProperty('test');
    });

    it('should have required production dependencies', () => {
      const deps = packageJson.dependencies;
      expect(deps).toHaveProperty('express');
      expect(deps).toHaveProperty('cors');
      expect(deps).toHaveProperty('dotenv');
      expect(deps).toHaveProperty('knex');
      expect(deps).toHaveProperty('pg');
      expect(deps).toHaveProperty('bcryptjs');
      expect(deps).toHaveProperty('jsonwebtoken');
      expect(deps).toHaveProperty('uuid');
    });

    it('should have required dev dependencies', () => {
      const devDeps = packageJson.devDependencies;
      expect(devDeps).toHaveProperty('typescript');
      expect(devDeps).toHaveProperty('ts-node');
      expect(devDeps).toHaveProperty('nodemon');
      expect(devDeps).toHaveProperty('jest');
      expect(devDeps).toHaveProperty('@types/express');
      expect(devDeps).toHaveProperty('@types/node');
    });
  });

  describe('TC-5: TypeScript Compilation', () => {
    it('should have tsconfig.json with valid configuration', () => {
      const tsconfigPath = path.join(basePath, 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
      expect(tsconfig.compilerOptions.rootDir).toBe('./src');
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });
  });
});
