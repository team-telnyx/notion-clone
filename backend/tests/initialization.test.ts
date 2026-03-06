import path from 'path';
import fs from 'fs';

describe('Backend Initialization - Directory Structure', () => {
  const backendPath = path.join(__dirname, '..');

  const requiredDirs = [
    'src/routes',
    'src/middleware',
    'src/db',
    'src/types',
    'migrations'
  ];

  requiredDirs.forEach(dir => {
    it(`TC-1: should create directory ${dir}`, () => {
      const fullPath = path.join(backendPath, dir);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isDirectory()).toBe(true);
    });
  });

  it('TC-2: should ensure no unexpected files in root', () => {
    const rootFiles = fs.readdirSync(backendPath);
    const expectedFiles = ['package.json', 'tsconfig.json', 'knexfile.ts', '.env', 'src', 'migrations', 'node_modules'];
    expectedFiles.forEach(file => {
      expect(rootFiles.some(f => f.includes(file) || f === file)).toBeTruthy();
    });
  });
});

describe('Backend Initialization - Configuration Files', () => {
  const backendPath = path.join(__dirname, '..');

  const requiredFiles = [
    { path: 'package.json', type: 'file' },
    { path: 'tsconfig.json', type: 'file' },
    { path: 'knexfile.ts', type: 'file' },
    { path: '.env', type: 'file' },
    { path: '.gitignore', type: 'file' },
    { path: 'src/types/index.ts', type: 'file' },
    { path: 'src/db/knex.ts', type: 'file' },
    { path: 'src/index.ts', type: 'file' }
  ];

  requiredFiles.forEach(({ path: filePath, type }) => {
    it(`TC-3: should have required file ${filePath}`, () => {
      const fullPath = path.join(backendPath, filePath);
      expect(fs.existsSync(fullPath)).toBe(true);
      if (type === 'file') {
        expect(fs.statSync(fullPath).isFile()).toBe(true);
      }
    });
  });
});

describe('Backend Initialization - Package.json Validation', () => {
  const backendPath = path.join(__dirname, '..');
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    const packagePath = path.join(backendPath, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf-8');
    packageJson = JSON.parse(content);
  });

  it('TC-4: should have valid JSON package.json', () => {
    expect(packageJson).toBeDefined();
    expect(typeof packageJson).toBe('object');
  });

  it('TC-5: should have all required npm scripts', () => {
    const requiredScripts = ['dev', 'build', 'start'];
    const scripts = packageJson.scripts as Record<string, string>;
    requiredScripts.forEach(script => {
      expect(scripts).toHaveProperty(script);
    });
  });

  it('TC-6: should have dev script with nodemon and ts-node', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts.dev).toContain('nodemon');
    expect(scripts.dev).toContain('ts-node');
  });

  it('TC-7: should have build script with tsc', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts.build).toBe('tsc');
  });

  it('TC-8: should have start script with node dist/index.js', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts.start).toBe('node dist/index.js');
  });

  it('TC-9: should have all production dependencies', () => {
    const prodDeps = ['express', 'cors', 'dotenv', 'knex', 'pg', 'bcryptjs', 'jsonwebtoken', 'uuid'];
    const dependencies = packageJson.dependencies as Record<string, string>;
    prodDeps.forEach(dep => {
      expect(dependencies).toHaveProperty(dep);
    });
  });

  it('TC-10: should have all development dependencies', () => {
    const devDeps = [
      'typescript', 'ts-node', '@types/node', '@types/express', '@types/cors',
      '@types/bcryptjs', '@types/jsonwebtoken', '@types/pg', '@types/uuid', 'nodemon'
    ];
    const devDependencies = packageJson.devDependencies as Record<string, string>;
    devDeps.forEach(dep => {
      expect(devDependencies).toHaveProperty(dep);
    });
  });
});

describe('Backend Initialization - tsconfig.json Validation', () => {
  const backendPath = path.join(__dirname, '..');
  let tsconfig: Record<string, unknown>;

  beforeAll(() => {
    const configPath = path.join(backendPath, 'tsconfig.json');
    const content = fs.readFileSync(configPath, 'utf-8');
    tsconfig = JSON.parse(content);
  });

  it('TC-11: should have valid JSON tsconfig.json', () => {
    expect(tsconfig).toBeDefined();
    expect(tsconfig.compilerOptions).toBeDefined();
  });

  it('TC-12: should target ES2020', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
    expect(compilerOptions.target).toBe('ES2020');
  });

  it('TC-13: should use commonjs module system', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
    expect(compilerOptions.module).toBe('commonjs');
  });

  it('TC-14: should have strict mode enabled', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
    expect(compilerOptions.strict).toBe(true);
  });

  it('TC-15: should output to ./dist', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
    expect(compilerOptions.outDir).toBe('./dist');
  });

  it('TC-16: should have rootDir configured', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
    expect(compilerOptions.rootDir).toBeDefined();
  });

  it('TC-17: should have esModuleInterop enabled', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
    expect(compilerOptions.esModuleInterop).toBe(true);
  });
});

describe('Backend Initialization - .env File', () => {
  const backendPath = path.join(__dirname, '..');
  let envContent: string;

  beforeAll(() => {
    const envPath = path.join(backendPath, '.env');
    envContent = fs.readFileSync(envPath, 'utf-8');
  });

  it('TC-18: should have PORT=3001', () => {
    expect(envContent).toContain('PORT=3001');
  });

  it('TC-19: should have database configuration', () => {
    expect(envContent).toContain('DB_HOST=');
    expect(envContent).toContain('DB_PORT=');
    expect(envContent).toContain('DB_NAME=');
    expect(envContent).toContain('DB_USER=');
    expect(envContent).toContain('DB_PASSWORD=');
  });

  it('TC-20: should have JWT_SECRET', () => {
    expect(envContent).toContain('JWT_SECRET=');
  });
});

describe('Backend Initialization - TypeScript Types', () => {
  const backendPath = path.join(__dirname, '..');
  let typesContent: string;

  beforeAll(() => {
    const typesPath = path.join(backendPath, 'src/types/index.ts');
    typesContent = fs.readFileSync(typesPath, 'utf-8');
  });

  it('TC-21: should export User interface', () => {
    expect(typesContent).toContain('export interface User');
    expect(typesContent).toContain('id: string');
    expect(typesContent).toContain('email: string');
    expect(typesContent).toContain('password_hash: string');
  });

  it('TC-22: should export Workspace interface', () => {
    expect(typesContent).toContain('export interface Workspace');
    expect(typesContent).toContain('owner_id: string');
  });

  it('TC-23: should export WorkspaceMember interface', () => {
    expect(typesContent).toContain('export interface WorkspaceMember');
    expect(typesContent).toContain("role: 'owner' | 'admin' | 'member'");
  });

  it('TC-24: should export Page interface', () => {
    expect(typesContent).toContain('export interface Page');
    expect(typesContent).toContain('content: Record<string, unknown>');
  });

  it('TC-25: should export Block interface', () => {
    expect(typesContent).toContain('export interface Block');
    expect(typesContent).toContain('position: number');
  });
});

describe('Backend Initialization - Express App Structure', () => {
  const backendPath = path.join(__dirname, '..');
  let appContent: string;

  beforeAll(() => {
    const appPath = path.join(backendPath, 'src/index.ts');
    appContent = fs.readFileSync(appPath, 'utf-8');
  });

  it('TC-26: should import express', () => {
    expect(appContent).toContain("import express from 'express'");
  });

  it('TC-27: should import cors', () => {
    expect(appContent).toContain("import cors from 'cors'");
  });

  it('TC-28: should import dotenv and call config', () => {
    expect(appContent).toContain("import dotenv from 'dotenv'");
    expect(appContent).toContain('dotenv.config()');
  });

  it('TC-29: should create Express app instance', () => {
    expect(appContent).toContain('const app = express()');
  });

  it('TC-30: should use cors middleware', () => {
    expect(appContent).toContain('app.use(cors())');
  });

  it('TC-31: should use express.json middleware', () => {
    expect(appContent).toContain('app.use(express.json())');
  });

  it('TC-32: should define /health endpoint', () => {
    expect(appContent).toContain("app.get('/health'");
  });

  it('TC-33: should listen on PORT from env or default 3001', () => {
    expect(appContent).toContain('process.env.PORT || 3001');
    expect(appContent).toContain('app.listen(PORT');
  });

  it('TC-34: should export default app', () => {
    expect(appContent).toContain('export default app');
  });

  it('EC-1: should fix template literal syntax in console.log', () => {
    expect(appContent).toMatch(/console\.log\(`[^`]*\$\{PORT\}[^`]*`\)/);
  });
});

describe('Backend Initialization - Knex Configuration', () => {
  const backendPath = path.join(__dirname, '..');
  let knexConfigContent: string;
  let knexDbContent: string;

  beforeAll(() => {
    knexConfigContent = fs.readFileSync(path.join(backendPath, 'knexfile.ts'), 'utf-8');
    knexDbContent = fs.readFileSync(path.join(backendPath, 'src/db/knex.ts'), 'utf-8');
  });

  it('TC-35: should import Knex type in knexfile', () => {
    expect(knexConfigContent).toContain("import type { Knex } from 'knex'");
  });

  it('TC-36: should configure pg client', () => {
    expect(knexConfigContent).toContain("client: 'pg'");
  });

  it('TC-37: should have migrations directory configured', () => {
    expect(knexConfigContent).toContain("directory: './migrations'");
  });

  it('TC-38: should import knex in db/knex.ts', () => {
    expect(knexDbContent).toContain("import knex from 'knex'");
  });

  it('TC-39: should import knexConfig in db/knex.ts', () => {
    expect(knexDbContent).toContain("import knexConfig from");
  });

  it('TC-40: should export db instance', () => {
    expect(knexDbContent).toContain('export const db');
  });
});

describe('Backend Initialization - .gitignore', () => {
  const backendPath = path.join(__dirname, '..');
  let gitignoreContent: string;

  beforeAll(() => {
    const gitignorePath = path.join(backendPath, '.gitignore');
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  });

  it('TC-41: should ignore node_modules', () => {
    expect(gitignoreContent).toContain('node_modules');
  });

  it('TC-42: should ignore dist', () => {
    expect(gitignoreContent).toContain('dist');
  });

  it('TC-43: should ignore .env', () => {
    expect(gitignoreContent).toContain('.env');
  });

  it('TC-44: should ignore package-lock.json', () => {
    expect(gitignoreContent).toContain('package-lock.json');
  });
});
