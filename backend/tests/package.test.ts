import fs from 'fs';
import path from 'path';

describe('Package Configuration', () => {
  const backendDir = path.join(__dirname, '..');
  const packagePath = path.join(backendDir, 'package.json');
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  });

  test('should have required scripts', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts).toBeDefined();
    expect(scripts.dev).toBe('nodemon --exec ts-node src/index.ts');
    expect(scripts.build).toBe('tsc');
    expect(scripts.start).toBe('node dist/index.js');
  });

  test('should have migration scripts', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts.migrate).toBe('knex migrate:latest');
    expect(scripts['migrate:rollback']).toBe('knex migrate:rollback');
    expect(scripts['migrate:make']).toBe('knex migrate:make');
  });

  test('should have all required production dependencies', () => {
    const requiredDeps = [
      'express',
      'cors',
      'dotenv',
      'knex',
      'pg',
      'bcryptjs',
      'jsonwebtoken',
      'uuid'
    ];

    const deps = packageJson.dependencies as Record<string, string>;
    requiredDeps.forEach(dep => {
      expect(deps).toHaveProperty(dep);
    });
  });

  test('should have all required dev dependencies', () => {
    const requiredDevDeps = [
      'typescript',
      'ts-node',
      '@types/node',
      '@types/express',
      '@types/cors',
      '@types/bcryptjs',
      '@types/jsonwebtoken',
      '@types/pg',
      '@types/uuid',
      'nodemon'
    ];

    const devDeps = packageJson.devDependencies as Record<string, string>;
    requiredDevDeps.forEach(dep => {
      expect(devDeps).toHaveProperty(dep);
    });
  });

  test('should have main entry point configured', () => {
    expect(packageJson.main).toBe('dist/index.js');
  });
});
