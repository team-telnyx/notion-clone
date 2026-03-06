import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Project Configuration Tests', () => {
  const backendPath = path.join(process.cwd());

  describe('File Structure', () => {
    it('should have .gitignore excluding node_modules', () => {
      const gitignorePath = path.join(backendPath, '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);
      
      const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
      expect(gitignore).toContain('node_modules');
      expect(gitignore).toContain('.env');
      expect(gitignore).toContain('dist');
    });

    it('should have .env.example with required variables', () => {
      const envExamplePath = path.join(backendPath, '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
      
      const envExample = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envExample).toContain('PORT');
      expect(envExample).toContain('DB_HOST');
      expect(envExample).toContain('DB_PORT');
      expect(envExample).toContain('DB_NAME');
      expect(envExample).toContain('DB_USER');
      expect(envExample).toContain('JWT_SECRET');
    });

    it('should have required directory structure', () => {
      const dirs = [
        'src/routes',
        'src/middleware',
        'src/db',
        'src/types',
      ];

      dirs.forEach(dir => {
        expect(fs.existsSync(path.join(backendPath, dir))).toBe(true);
      });
    });

    it('should have required source files', () => {
      const files = [
        'src/index.ts',
        'src/types/index.ts',
        'src/db/knex.ts',
        'knexfile.ts',
        'tsconfig.json',
        '.env'
      ];

      files.forEach(file => {
        expect(fs.existsSync(path.join(backendPath, file))).toBe(true);
      });
    });
  });

  describe('Package Configuration', () => {
    it('should have dev, build, and start scripts', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('start');
    });

    it('should have test script', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts).toHaveProperty('test');
    });

    it('should have migrate script', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts).toHaveProperty('migrate');
    });
  });

  describe('TypeScript Compilation', () => {
    it('should compile TypeScript without errors', () => {
      const result = execSync('npx tsc --noEmit', { 
        cwd: backendPath,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      expect(result).toBeDefined();
    });
  });
});
