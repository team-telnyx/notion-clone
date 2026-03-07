import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('TC-20: Environment Configuration', () => {
  const basePath = process.cwd();

  it('should have .env file with API URL', () => {
    const envPath = join(basePath, '.env');
    expect(existsSync(envPath)).toBe(true);

    const envContent = readFileSync(envPath, 'utf-8');
    expect(envContent).toContain('VITE_API_URL');
  });

  it('should have vite-env.d.ts for TypeScript env type declarations', () => {
    const envTypesPath = join(basePath, 'src', 'vite-env.d.ts');
    expect(existsSync(envTypesPath)).toBe(true);
  });

  it('should reference vite/client in vite-env.d.ts', () => {
    const envTypesPath = join(basePath, 'src', 'vite-env.d.ts');
    if (existsSync(envTypesPath)) {
      const content = readFileSync(envTypesPath, 'utf-8');
      expect(content).toContain('vite/client');
    }
  });
});

describe('TC-21: HTML Configuration', () => {
  it('should have index.html with Notion Clone title', () => {
    const indexPath = join(process.cwd(), 'index.html');
    expect(existsSync(indexPath)).toBe(true);

    const htmlContent = readFileSync(indexPath, 'utf-8');
    expect(htmlContent).toContain('Notion Clone');
    expect(htmlContent).toContain('<title>Notion Clone</title>');
  });

  it('should have correct root div in index.html', () => {
    const indexPath = join(process.cwd(), 'index.html');
    const htmlContent = readFileSync(indexPath, 'utf-8');
    
    expect(htmlContent).toContain('id="root"');
  });
});
