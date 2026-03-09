import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('TypeScript Compilation', () => {
  const backendDir = path.join(__dirname, '..');
  const tsconfigPath = path.join(backendDir, 'tsconfig.json');

  test('should have TypeScript installed', () => {
    const tscPath = path.join(backendDir, 'node_modules', '.bin', 'tsc');
    expect(fs.existsSync(tscPath) || fs.existsSync(tscPath + '.exe')).toBe(true);
  });

  test('should have valid tsconfig.json', () => {
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.target).toBe('ES2020');
    expect(tsconfig.compilerOptions.module).toBe('commonjs');
    expect(tsconfig.compilerOptions.outDir).toBe('./dist');
    expect(tsconfig.compilerOptions.rootDir).toBe('.');
  });
});
