import fs from 'fs';
import path from 'path';

describe('Project Structure', () => {
  const backendDir = path.join(__dirname, '..');
  
  test('should have all required directories', () => {
    const requiredDirs = [
      'src',
      'src/routes',
      'src/middleware',
      'src/db',
      'src/types',
    ];

    requiredDirs.forEach(dir => {
      const fullPath = path.join(backendDir, dir);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isDirectory()).toBe(true);
    });
  });

  test('should have all required source files', () => {
    const requiredFiles = [
      'src/index.ts',
      'src/db/knex.ts',
      'src/types/index.ts'
    ];

    requiredFiles.forEach(file => {
      const fullPath = path.join(backendDir, file);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isFile()).toBe(true);
    });
  });

  test('should have all required configuration files', () => {
    const configFiles = [
      'tsconfig.json',
      'knexfile.ts',
      'package.json',
      '.env.example'
    ];

    configFiles.forEach(file => {
      const fullPath = path.join(backendDir, file);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });
});
