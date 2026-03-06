import fs from 'fs';
import path from 'path';

describe('Configuration Unit Tests', () => {
  describe('AC-5: Environment Variables', () => {
    it('should have .env.example file', () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    it('should have required environment variables in .env.example', () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');

      expect(envContent).toContain('PORT=');
      expect(envContent).toContain('DB_HOST=');
      expect(envContent).toContain('DB_PORT=');
      expect(envContent).toContain('DB_NAME=');
      expect(envContent).toContain('DB_USER=');
      expect(envContent).toContain('DB_PASSWORD=');
      expect(envContent).toContain('JWT_SECRET=');
    });
  });

  describe('Directory Structure', () => {
    const requiredDirs = [
      'src',
      'src/routes',
      'src/middleware',
      'src/db',
      'src/types',
      'migrations'
    ];

    requiredDirs.forEach((dir) => {
      it(`should have ${dir} directory`, () => {
        const fullPath = path.join(process.cwd(), dir);
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isDirectory()).toBe(true);
      });
    });
  });

  describe('Required Files', () => {
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'knexfile.ts',
      'src/index.ts',
      'src/db/knex.ts',
      'src/types/index.ts'
    ];

    requiredFiles.forEach((file) => {
      it(`should have ${file} file`, () => {
        const fullPath = path.join(process.cwd(), file);
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).isFile()).toBe(true);
      });
    });
  });

  describe('Package.json Scripts', () => {
    it('should have required npm scripts', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toBeDefined();
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.start).toBeDefined();
      expect(packageJson.scripts.test).toBeDefined();
    });

    it('should have required production dependencies', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies.express).toBeDefined();
      expect(packageJson.dependencies.knex).toBeDefined();
      expect(packageJson.dependencies.pg).toBeDefined();
      expect(packageJson.dependencies.cors).toBeDefined();
      expect(packageJson.dependencies.dotenv).toBeDefined();
    });
  });
});
