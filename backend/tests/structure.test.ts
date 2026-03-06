import fs from 'fs';
import path from 'path';

describe('Project Structure Tests', () => {
  describe('AC-5: Directory Structure', () => {
    const requiredDirs = [
      'src',
      'src/routes',
      'src/middleware',
      'src/db',
      'src/types',
      'migrations'
    ];

    test.each(requiredDirs)('should have %s directory', (dir) => {
      const fullPath = path.join(process.cwd(), dir);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isDirectory()).toBe(true);
    });
  });

  describe('TypeScript Configuration', () => {
    it('should have valid tsconfig.json', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
      expect(tsconfig.compilerOptions.rootDir).toBe('./src');
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });
  });
});
