import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Vite Configuration', () => {
  const configPath = resolve(__dirname, '../../../vite.config.ts');
  let configContent: string;

  try {
    configContent = readFileSync(configPath, 'utf-8');
  } catch {
    configContent = '';
  }

  describe('Plugin Configuration', () => {
    it('has vite config file', () => {
      expect(configContent.length).toBeGreaterThan(0);
    });

    it('includes React plugin', () => {
      expect(configContent).toContain('react');
      expect(configContent).toContain('@vitejs/plugin-react');
    });

    it('includes Tailwind CSS plugin', () => {
      expect(configContent).toContain('tailwindcss');
      expect(configContent).toContain('@tailwindcss/vite');
    });
  });

  describe('Test Configuration', () => {
    it('configures test globals', () => {
      expect(configContent).toContain('globals: true');
    });

    it('configures jsdom environment', () => {
      expect(configContent).toContain("environment: 'jsdom'");
    });

    it('configures setup files', () => {
      expect(configContent).toContain('setupFiles');
      expect(configContent).toContain('setup.ts');
    });

    it('configures test file patterns', () => {
      expect(configContent).toContain('include');
      expect(configContent).toContain('{test,spec}');
    });
  });

  describe('Server Configuration', () => {
    it('configures development server port', () => {
      expect(configContent).toContain('server');
      expect(configContent).toContain('port');
    });
  });
});
