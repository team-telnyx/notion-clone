import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const backendDir = path.join(__dirname, '..');

describe('Initialization Acceptance Criteria', () => {
  describe('AC-5: All directories created', () => {
    test('should have migrations directory', () => {
      const migrationsPath = path.join(backendDir, 'migrations');
      expect(fs.existsSync(migrationsPath)).toBe(true);
      expect(fs.statSync(migrationsPath).isDirectory()).toBe(true);
    });

    test('should have routes directory', () => {
      const routesPath = path.join(backendDir, 'src/routes');
      expect(fs.existsSync(routesPath)).toBe(true);
    });

    test('should have middleware directory', () => {
      const middlewarePath = path.join(backendDir, 'src/middleware');
      expect(fs.existsSync(middlewarePath)).toBe(true);
    });
  });

  describe('Package.json Scripts', () => {
    let packageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(backendDir, 'package.json');
      packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    });

    test('should have dev script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts.dev).toContain('nodemon');
      expect(scripts.dev).toContain('ts-node');
    });

    test('should have build script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts.build).toBe('tsc');
    });

    test('should have start script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts.start).toBe('node dist/index.js');
    });
  });

  describe('TypeScript Build Verification', () => {
    test('should compile TypeScript without errors', () => {
      expect(() => {
        execSync('npm run build', { cwd: backendDir, stdio: 'pipe' });
      }).not.toThrow();
    });
  });
});
