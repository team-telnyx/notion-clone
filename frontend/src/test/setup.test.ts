import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Setup Tests', () => {
  const basePath = process.cwd();

  describe('TC-1: Vite configuration should be valid', () => {
    it('should have vite.config.ts file', () => {
      const viteConfigPath = join(basePath, 'vite.config.ts');
      expect(existsSync(viteConfigPath)).toBe(true);
    });

    it('should have valid Vite configuration with React plugin', () => {
      const viteConfigPath = join(basePath, 'vite.config.ts');
      const configContent = readFileSync(viteConfigPath, 'utf-8');
      
      expect(configContent).toContain('@vitejs/plugin-react');
      expect(configContent).toContain('export default');
    });

    it('should have package.json with vite scripts', () => {
      const packageJsonPath = join(basePath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts.dev).toBeDefined();
      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.preview).toBeDefined();
    });

    it('should be configured to use port 5173 by default', () => {
      const viteConfigPath = join(basePath, 'vite.config.ts');
      const configContent = readFileSync(viteConfigPath, 'utf-8');
      
      // Check if server port is configured or uses default
      const hasPortConfig = configContent.includes('port: 5173') || 
                           !configContent.includes('server:');
      expect(hasPortConfig).toBe(true);
    });
  });

  describe('TC-2: Required dependencies should be installed', () => {
    it('should have core dependencies', () => {
      const packageJsonPath = join(basePath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      const deps = packageJson.dependencies || {};
      expect(deps.react).toBeDefined();
      expect(deps['react-dom']).toBeDefined();
      expect(deps.axios).toBeDefined();
      expect(deps['react-router-dom']).toBeDefined();
      expect(deps['jwt-decode']).toBeDefined();
    });

    it('should have development dependencies', () => {
      const packageJsonPath = join(basePath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      const devDeps = packageJson.devDependencies || {};
      expect(devDeps.tailwindcss).toBeDefined();
      expect(devDeps.postcss).toBeDefined();
      expect(devDeps.autoprefixer).toBeDefined();
      expect(devDeps.typescript).toBeDefined();
      expect(devDeps.vite).toBeDefined();
      expect(devDeps['@vitejs/plugin-react']).toBeDefined();
    });
  });

  describe('TC-4: Tailwind configuration', () => {
    it('should have tailwind.config.js file', () => {
      const tailwindPath = join(basePath, 'tailwind.config.js');
      const tailwindTsPath = join(basePath, 'tailwind.config.ts');
      expect(existsSync(tailwindPath) || existsSync(tailwindTsPath)).toBe(true);
    });

    it('should have valid Tailwind configuration with content paths', () => {
      const tailwindPath = join(basePath, 'tailwind.config.js');
      const tailwindTsPath = join(basePath, 'tailwind.config.ts');
      const configPath = existsSync(tailwindPath) ? tailwindPath : tailwindTsPath;
      
      const configContent = readFileSync(configPath, 'utf-8');
      
      expect(configContent).toContain('content');
      expect(configContent).toContain('./index.html');
      expect(configContent).toContain('./src/**/*.{js,ts,jsx,tsx}');
    });

    it('should have postcss.config.js file', () => {
      const postcssPath = join(basePath, 'postcss.config.js');
      expect(existsSync(postcssPath)).toBe(true);
    });
  });

  describe('TC-5: CSS configuration', () => {
    it('should have index.css with Tailwind directives', () => {
      const indexCssPath = join(basePath, 'src', 'index.css');
      expect(existsSync(indexCssPath)).toBe(true);
      
      const cssContent = readFileSync(indexCssPath, 'utf-8');
      
      expect(cssContent).toContain('@tailwind base');
      expect(cssContent).toContain('@tailwind components');
      expect(cssContent).toContain('@tailwind utilities');
    });
  });
});
