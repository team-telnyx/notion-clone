import fs from 'fs';
import path from 'path';

describe('Directory Structure Tests', () => {
  const backendPath = path.join(__dirname, '../..');

  describe('AC-5: Directory Structure', () => {
    it('TC-12: should have backend directory structure', () => {
      const requiredDirs = [
        'src',
        'src/routes',
        'src/middleware', 
        'src/db',
        'src/types',
        'migrations'
      ];

      for (const dir of requiredDirs) {
        const dirPath = path.join(backendPath, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      }
    });

    it('TC-13: should have required source subdirectories', () => {
      const srcPath = path.join(backendPath, 'src');
      expect(fs.existsSync(path.join(srcPath, 'index.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcPath, 'db/knex.ts'))).toBe(true);
      expect(fs.existsSync(path.join(srcPath, 'types/index.ts'))).toBe(true);
    });

    it('TC-14: should have required configuration files', () => {
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'knexfile.ts'
      ];

      for (const file of requiredFiles) {
        const filePath = path.join(backendPath, file);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('EC-5: should have migrations directory accessible', () => {
      const migrationsPath = path.join(backendPath, 'migrations');
      expect(fs.existsSync(migrationsPath)).toBe(true);
      
      const stats = fs.statSync(migrationsPath);
      expect(stats.isDirectory()).toBe(true);
    });
  });
});
