import fs from 'fs';
import path from 'path';

describe('AC-4: All directories created as specified', () => {
  const backendPath = path.resolve(__dirname, '../../');

  test('TC-11: Backend root directory should exist', () => {
    const exists = fs.existsSync(backendPath);
    expect(exists).toBe(true);
  });

  test('TC-12: src directory should exist', () => {
    const srcPath = path.join(backendPath, 'src');
    expect(fs.existsSync(srcPath)).toBe(true);
    expect(fs.statSync(srcPath).isDirectory()).toBe(true);
  });

  test('TC-13: src/routes directory should exist', () => {
    const routesPath = path.join(backendPath, 'src', 'routes');
    expect(fs.existsSync(routesPath)).toBe(true);
    expect(fs.statSync(routesPath).isDirectory()).toBe(true);
  });

  test('TC-14: src/middleware directory should exist', () => {
    const middlewarePath = path.join(backendPath, 'src', 'middleware');
    expect(fs.existsSync(middlewarePath)).toBe(true);
    expect(fs.statSync(middlewarePath).isDirectory()).toBe(true);
  });

  test('TC-15: src/db directory should exist', () => {
    const dbPath = path.join(backendPath, 'src', 'db');
    expect(fs.existsSync(dbPath)).toBe(true);
    expect(fs.statSync(dbPath).isDirectory()).toBe(true);
  });

  test('TC-16: src/types directory should exist', () => {
    const typesPath = path.join(backendPath, 'src', 'types');
    expect(fs.existsSync(typesPath)).toBe(true);
    expect(fs.statSync(typesPath).isDirectory()).toBe(true);
  });

  test('TC-17: migrations directory should exist', () => {
    const migrationsPath = path.join(backendPath, 'migrations');
    expect(fs.existsSync(migrationsPath)).toBe(true);
    expect(fs.statSync(migrationsPath).isDirectory()).toBe(true);
  });

  test('TC-18: Backend should have package.json', () => {
    const packageJsonPath = path.join(backendPath, 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    expect(fs.statSync(packageJsonPath).isFile()).toBe(true);
  });

  test('TC-19: Backend should have tsconfig.json', () => {
    const tsconfigPath = path.join(backendPath, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    expect(fs.statSync(tsconfigPath).isFile()).toBe(true);
  });

  test('TC-20: Backend should have knexfile.ts', () => {
    const knexfilePath = path.join(backendPath, 'knexfile.ts');
    expect(fs.existsSync(knexfilePath)).toBe(true);
    expect(fs.statSync(knexfilePath).isFile()).toBe(true);
  });

  test('TC-22: src/index.ts entry point should exist', () => {
    const indexPath = path.join(backendPath, 'src', 'index.ts');
    expect(fs.existsSync(indexPath)).toBe(true);
    expect(fs.statSync(indexPath).isFile()).toBe(true);
  });

  test('TC-23: src/db/knex.ts database config should exist', () => {
    const knexTsPath = path.join(backendPath, 'src', 'db', 'knex.ts');
    expect(fs.existsSync(knexTsPath)).toBe(true);
    expect(fs.statSync(knexTsPath).isFile()).toBe(true);
  });

  test('TC-24: src/types/index.ts type definitions should exist', () => {
    const typesPath = path.join(backendPath, 'src', 'types', 'index.ts');
    expect(fs.existsSync(typesPath)).toBe(true);
    expect(fs.statSync(typesPath).isFile()).toBe(true);
  });

  test('EC-6: Empty directories should be preserved', () => {
    const routesPath = path.join(backendPath, 'src', 'routes');
    const middlewarePath = path.join(backendPath, 'src', 'middleware');
    
    expect(fs.existsSync(routesPath)).toBe(true);
    expect(fs.existsSync(middlewarePath)).toBe(true);
  });
});
