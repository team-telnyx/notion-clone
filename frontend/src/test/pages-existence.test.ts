import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('TC-3: Page Components Existence', () => {
  const pagesPath = join(process.cwd(), 'src', 'pages');

  it('should have Login.tsx page component', () => {
    const loginPath = join(pagesPath, 'Login.tsx');
    expect(existsSync(loginPath)).toBe(true);
  });

  it('should have Register.tsx page component', () => {
    const registerPath = join(pagesPath, 'Register.tsx');
    expect(existsSync(registerPath)).toBe(true);
  });

  it('should have Dashboard.tsx page component', () => {
    const dashboardPath = join(pagesPath, 'Dashboard.tsx');
    expect(existsSync(dashboardPath)).toBe(true);
  });

  it('should have Workspace.tsx page component', () => {
    const workspacePath = join(pagesPath, 'Workspace.tsx');
    expect(existsSync(workspacePath)).toBe(true);
  });

  it('should have src/pages directory', () => {
    expect(existsSync(pagesPath)).toBe(true);
  });
});

describe('EC-1: Edge cases for file structure', () => {
  const srcPath = join(process.cwd(), 'src');

  it('should have src directory structure', () => {
    expect(existsSync(srcPath)).toBe(true);
    expect(existsSync(join(srcPath, 'api'))).toBe(true);
    expect(existsSync(join(srcPath, 'hooks'))).toBe(true);
    expect(existsSync(join(srcPath, 'pages'))).toBe(true);
  });

  it('should have main entry files', () => {
    expect(existsSync(join(srcPath, 'main.tsx'))).toBe(true);
    expect(existsSync(join(srcPath, 'App.tsx'))).toBe(true);
    expect(existsSync(join(srcPath, 'index.css'))).toBe(true);
  });

  it('should have api directory with axios.ts', () => {
    const apiPath = join(srcPath, 'api', 'axios.ts');
    expect(existsSync(apiPath)).toBe(true);
  });

  it('should have hooks directory with useAuth.ts', () => {
    const hooksPath = join(srcPath, 'hooks', 'useAuth.ts');
    expect(existsSync(hooksPath)).toBe(true);
  });
});
