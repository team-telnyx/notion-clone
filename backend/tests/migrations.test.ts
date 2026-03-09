import fs from 'fs';
import path from 'path';

describe('Database Migrations', () => {
  const backendDir = path.join(__dirname, '..');
  const migrationsDir = path.join(backendDir, 'migrations');

  test('should have migrations directory', () => {
    expect(fs.existsSync(migrationsDir)).toBe(true);
    expect(fs.statSync(migrationsDir).isDirectory()).toBe(true);
  });

  test('should have migration files', () => {
    const files = fs.readdirSync(migrationsDir);
    const migrationFiles = files.filter(f => f.endsWith('.ts')).length;
    expect(migrationFiles).toBeGreaterThan(0);
  });

  test('migrations should be TypeScript files', () => {
    const files = fs.readdirSync(migrationsDir);
    const tsFiles = files.filter(f => f.endsWith('.ts'));
    expect(tsFiles.length).toBeGreaterThan(0);
  });

  test('migration files should have up function', () => {
    const files = fs.readdirSync(migrationsDir);
    files.filter(f => f.endsWith('.ts')).forEach(file => {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      expect(content).toContain('export async function up');
    });
  });

  test('migration files should have down function', () => {
    const files = fs.readdirSync(migrationsDir);
    files.filter(f => f.endsWith('.ts')).forEach(file => {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      expect(content).toContain('export async function down');
    });
  });
});

describe('Migration Commands', () => {
  const backendDir = path.join(__dirname, '..');
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    packageJson = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf8'));
  });

  test('should have migrate script', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts.migrate).toBeDefined();
  });

  test('should have migrate:rollback script', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts['migrate:rollback']).toBeDefined();
  });

  test('should have migrate:make script', () => {
    const scripts = packageJson.scripts as Record<string, string>;
    expect(scripts['migrate:make']).toBeDefined();
  });
});
