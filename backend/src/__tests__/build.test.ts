import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe('TypeScript Compilation', () => {
  describe('tsconfig.json', () => {
    const tsconfigPath = resolve(__dirname, '../../tsconfig.json');

    it('should have tsconfig.json file', () => {
      const exists = existsSync(tsconfigPath);
      expect(exists).toBe(true);
    });

    it('should have valid JSON structure', () => {
      const content = readFileSync(tsconfigPath, 'utf-8');
      const config = JSON.parse(content);
      expect(config).toHaveProperty('compilerOptions');
    });

    it('should target ES2020 or compatible', () => {
      const content = readFileSync(tsconfigPath, 'utf-8');
      const config = JSON.parse(content);
      const target = config.compilerOptions.target;
      expect(['ES2020', 'ES2021', 'ES2022', 'ESNext']).toContain(target);
    });

    it('should output to dist directory', () => {
      const content = readFileSync(tsconfigPath, 'utf-8');
      const config = JSON.parse(content);
      expect(config.compilerOptions.outDir).toBe('./dist');
    });

    it('should have strict mode enabled', () => {
      const content = readFileSync(tsconfigPath, 'utf-8');
      const config = JSON.parse(content);
      expect(config.compilerOptions.strict).toBe(true);
    });
  });

  describe('Build Process', () => {
    it('should have module set to commonjs', () => {
      const content = readFileSync(resolve(__dirname, '../../tsconfig.json'), 'utf-8');
      const config = JSON.parse(content);
      expect(config.compilerOptions.module).toBe('commonjs');
    });
  });
});
