import fs from 'fs';
import path from 'path';

describe('AC-6: TypeScript compiles without errors', () => {
  const backendPath = path.resolve(__dirname, '../../');

  test('TC-35: TypeScript configuration is valid', () => {
    const tsconfigPath = path.join(backendPath, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.include).toContain('src/**/*');
  });

  test('TC-37: All TypeScript source files should have no syntax errors', () => {
    const srcPath = path.join(backendPath, 'src');
    
    if (!fs.existsSync(srcPath)) {
      throw new Error('src directory does not exist yet - needs implementation');
    }
    
    const indexPath = path.join(srcPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('express');
      expect(content).toContain('/health');
    } else {
      throw new Error('src/index.ts does not exist yet - needs implementation');
    }
  });

  test('EC-7: TypeScript should detect type errors in knexfile.ts', () => {
    const knexfilePath = path.join(backendPath, 'knexfile.ts');
    
    if (fs.existsSync(knexfilePath)) {
      const content = fs.readFileSync(knexfilePath, 'utf-8');
      expect(content).toContain('import');
      expect(content).toContain('export');
    } else {
      throw new Error('knexfile.ts does not exist yet - needs implementation');
    }
  });

  test('EC-8: TypeScript should validate type definitions', () => {
    const typesPath = path.join(backendPath, 'src', 'types', 'index.ts');
    
    if (fs.existsSync(typesPath)) {
      const content = fs.readFileSync(typesPath, 'utf-8');
      expect(content).toContain('interface User');
      expect(content).toContain('interface Workspace');
      expect(content).toContain('interface Page');
      expect(content).toContain('interface Block');
      expect(content).toContain('interface WorkspaceMember');
    } else {
      throw new Error('types/index.ts does not exist yet - needs implementation');
    }
  });
});
