import fs from 'fs';
import path from 'path';

describe('Package.json Configuration Tests', () => {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  });

  describe('AC-5: Package Configuration', () => {
    it('TC-22: should have required npm scripts', () => {
      const requiredScripts = ['dev', 'build', 'start'];
      const scripts = packageJson.scripts as Record<string, string>;
      
      for (const script of requiredScripts) {
        expect(scripts).toHaveProperty(script);
        expect(scripts[script]).toBeDefined();
      }
      
      expect(scripts.dev).toContain('nodemon');
      expect(scripts.dev).toContain('ts-node');
      expect(scripts.build).toBe('tsc');
      expect(scripts.start).toContain('node');
    });

    it('TC-23: should have required production dependencies', () => {
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
      for (const dep of requiredDeps) {
        expect(deps).toHaveProperty(dep);
      }
    });

    it('TC-24: should have required dev dependencies', () => {
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
      for (const dep of requiredDevDeps) {
        expect(devDeps).toHaveProperty(dep);
      }
    });

    it('EC-7: should have proper TypeScript configuration', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts.dev).toContain('ts-node');
    });

    it('EC-8: should have express as main dependency', () => {
      const deps = packageJson.dependencies as Record<string, string>;
      const devDeps = packageJson.devDependencies as Record<string, string>;
      expect(deps.express).toBeDefined();
      expect(devDeps['@types/express']).toBeDefined();
    });
  });
});
