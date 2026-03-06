import fs from 'fs';
import path from 'path';

describe('TypeScript Configuration Tests', () => {
  const tsConfigPath = path.join(__dirname, '../../tsconfig.json');

  describe('AC-4: TypeScript Compilation', () => {
    it('TC-9: should have TypeScript configuration file', () => {
      expect(fs.existsSync(tsConfigPath)).toBe(true);
    });

    it('TC-11: should have correct tsconfig compiler options', () => {
      const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf-8');
      const tsConfig = JSON.parse(tsConfigContent);

      expect(tsConfig.compilerOptions).toBeDefined();
      expect(tsConfig.compilerOptions.target).toBe('ES2020');
      expect(tsConfig.compilerOptions.module).toBe('commonjs');
      expect(tsConfig.compilerOptions.strict).toBe(true);
      expect(tsConfig.compilerOptions.outDir).toBe('./dist');
      expect(tsConfig.compilerOptions.rootDir).toBe('.');
      expect(tsConfig.compilerOptions.esModuleInterop).toBe(true);
      expect(tsConfig.include).toContain('src/**/*');
    });

    it('EC-3: should have declaration files enabled', () => {
      const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf-8');
      const tsConfig = JSON.parse(tsConfigContent);
      expect(tsConfig.compilerOptions.declaration).toBe(true);
    });

    it('EC-4: should resolve json modules', () => {
      const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf-8');
      const tsConfig = JSON.parse(tsConfigContent);
      expect(tsConfig.compilerOptions.resolveJsonModule).toBe(true);
    });
  });
});
