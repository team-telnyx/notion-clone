import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Project Setup - Vite Configuration', () => {
  it('should have vite.config.ts file with react plugin', () => {
    const viteConfigPath = path.resolve(__dirname, '../../../vite.config.ts');
    expect(fs.existsSync(viteConfigPath)).toBe(true);
    
    const config = fs.readFileSync(viteConfigPath, 'utf-8');
    expect(config).toContain('@vitejs/plugin-react');
  });

  it('should have package.json with required dependencies', () => {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(packageJson.dependencies).toHaveProperty('react-dom');
    expect(packageJson.dependencies).toHaveProperty('react-router-dom');
    expect(packageJson.dependencies).toHaveProperty('axios');
    expect(packageJson.dependencies).toHaveProperty('jwt-decode');
  });

  it('should have devDependencies for Tailwind and testing', () => {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
    expect(packageJson.devDependencies).toHaveProperty('postcss');
    expect(packageJson.devDependencies).toHaveProperty('autoprefixer');
    expect(packageJson.devDependencies).toHaveProperty('vitest');
    expect(packageJson.devDependencies).toHaveProperty('@testing-library/react');
  });

  it('should have dev script configured', () => {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts.test).toContain('vitest');
  });
});

describe('Project Setup - Tailwind CSS', () => {
  it('should have tailwind.config.js for Tailwind CSS', () => {
    const tailwindJsPath = path.resolve(__dirname, '../../../tailwind.config.js');
    const tailwindTsPath = path.resolve(__dirname, '../../../tailwind.config.ts');
    
    expect(fs.existsSync(tailwindJsPath) || fs.existsSync(tailwindTsPath)).toBe(true);
  });

  it('should have PostCSS configuration', () => {
    const postcssJsPath = path.resolve(__dirname, '../../../postcss.config.js');
    const postcssTsPath = path.resolve(__dirname, '../../../postcss.config.ts');
    
    expect(fs.existsSync(postcssJsPath) || fs.existsSync(postcssTsPath)).toBe(true);
  });

  it('should have Tailwind directives in index.css', () => {
    const indexCssPath = path.resolve(__dirname, '../../index.css');
    expect(fs.existsSync(indexCssPath)).toBe(true);
    
    const cssContent = fs.readFileSync(indexCssPath, 'utf-8');
    expect(cssContent).toContain('@tailwind base');
    expect(cssContent).toContain('@tailwind components');
    expect(cssContent).toContain('@tailwind utilities');
  });
});

describe('Project Setup - Environment', () => {
  it('should have .env file with VITE_API_URL configured', () => {
    const envPath = path.resolve(__dirname, '../../../.env');
    expect(fs.existsSync(envPath)).toBe(true);
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    expect(envContent).toContain('VITE_API_URL');
  });
});

describe('Project Setup - File Structure', () => {
  it('should have required source files', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../api/axios.ts'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../hooks/useAuth.ts'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../App.tsx'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../main.tsx'))).toBe(true);
  });

  it('should have pages directory with required components', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../pages/Login.tsx'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../pages/Register.tsx'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../pages/Dashboard.tsx'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../pages/Workspace.tsx'))).toBe(true);
  });
});
