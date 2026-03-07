import fs from 'fs';
import path from 'path';

describe('AC-5: Configuration files are valid', () => {
  const backendPath = path.resolve(__dirname, '../../');

  describe('Package.json', () => {
    test('TC-25: Package.json should have required scripts', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toBe('nodemon --exec ts-node src/index.ts');
      expect(packageJson.scripts.build).toBe('tsc');
      expect(packageJson.scripts.start).toBe('node dist/index.js');
    });

    test('TC-26: Package.json should have required dependencies', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const requiredDeps = ['express', 'cors', 'dotenv', 'knex', 'pg', 'bcryptjs', 'jsonwebtoken', 'uuid'];
      
      requiredDeps.forEach(dep => {
        expect(packageJson.dependencies).toHaveProperty(dep);
      });
    });

    test('TC-27: Package.json should have required devDependencies', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const requiredDevDeps = ['typescript', 'ts-node', '@types/node', '@types/express', 'nodemon'];
      
      requiredDevDeps.forEach(dep => {
        expect(packageJson.devDependencies).toHaveProperty(dep);
      });
    });
  });

  describe('TypeScript Configuration', () => {
    test('TC-28: tsconfig.json should have correct compiler options', () => {
      const tsconfigPath = path.join(backendPath, 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
      expect(tsconfig.compilerOptions.rootDir).toBe('./src');
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    test('TC-29: tsconfig.json should include correct paths', () => {
      const tsconfigPath = path.join(backendPath, 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      
      expect(tsconfig.include).toContain('src/**/*');
      expect(tsconfig.exclude).toContain('node_modules');
    });
  });

  describe('Knex Configuration', () => {
    test('TC-33: knexfile.ts should be valid TypeScript', () => {
      const knexfilePath = path.join(backendPath, 'knexfile.ts');
      const content = fs.readFileSync(knexfilePath, 'utf-8');
      
      expect(content).toContain("client: 'pg'");
      expect(content).toContain('development');
      expect(content).toContain('migrations');
    });

    test('TC-34: knexfile.ts should use environment variables', () => {
      const knexfilePath = path.join(backendPath, 'knexfile.ts');
      const content = fs.readFileSync(knexfilePath, 'utf-8');
      
      expect(content).toContain('process.env.DB_HOST');
      expect(content).toContain('process.env.DB_PORT');
      expect(content).toContain('process.env.DB_NAME');
      expect(content).toContain('process.env.DB_USER');
      expect(content).toContain('process.env.DB_PASSWORD');
    });
  });
});
