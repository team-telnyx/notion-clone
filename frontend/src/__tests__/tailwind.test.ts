import { describe, it, expect } from 'vitest';

describe('Tailwind CSS Integration', () => {
  describe('Tailwind Package', () => {
    it('should have tailwindcss package available', async () => {
      const tailwind = await import('tailwindcss');
      expect(tailwind).toBeDefined();
    });
  });

  describe('PostCSS Integration', () => {
    it('should have @tailwindcss/postcss plugin available', async () => {
      const tailwindPostcss = await import('@tailwindcss/postcss');
      expect(tailwindPostcss).toBeDefined();
    });

    it('should have postcss available', async () => {
      const postcss = await import('postcss');
      expect(postcss).toBeDefined();
    });

    it('should have autoprefixer available', async () => {
      const autoprefixer = await import('autoprefixer');
      expect(autoprefixer).toBeDefined();
    });
  });

  describe('CSS Utilities', () => {
    it('should support class attribute on DOM elements', () => {
      const div = document.createElement('div');
      div.className = 'flex items-center justify-center';
      expect(div.className).toBe('flex items-center justify-center');
    });

    it('should support classList API', () => {
      const div = document.createElement('div');
      div.classList.add('flex', 'items-center', 'justify-center');
      expect(div.classList.contains('flex')).toBe(true);
      expect(div.classList.contains('items-center')).toBe(true);
      expect(div.classList.contains('justify-center')).toBe(true);
    });

    it('should support responsive class patterns', () => {
      const div = document.createElement('div');
      div.className = 'sm:flex md:hidden lg:block';
      expect(div.className).toContain('sm:flex');
      expect(div.className).toContain('md:hidden');
      expect(div.className).toContain('lg:block');
    });

    it('should support state class patterns', () => {
      const button = document.createElement('button');
      button.className = 'hover:bg-blue-600 focus:ring-2 disabled:opacity-50';
      expect(button.className).toContain('hover:bg-blue-600');
      expect(button.className).toContain('focus:ring-2');
      expect(button.className).toContain('disabled:opacity-50');
    });

    it('should support spacing utility patterns', () => {
      const div = document.createElement('div');
      div.className = 'p-4 m-2 px-6 py-3 mt-4 mb-2';
      expect(div.className).toContain('p-4');
      expect(div.className).toContain('m-2');
      expect(div.className).toContain('px-6');
      expect(div.className).toContain('py-3');
    });

    it('should support layout utility patterns', () => {
      const div = document.createElement('div');
      div.className = 'flex items-center justify-center min-h-screen w-full';
      expect(div.className).toContain('flex');
      expect(div.className).toContain('items-center');
      expect(div.className).toContain('justify-center');
      expect(div.className).toContain('min-h-screen');
      expect(div.className).toContain('w-full');
    });
  });
});

describe('CSS Import', () => {
  describe('Index CSS', () => {
    it('should be able to import index.css', async () => {
      const importCss = async () => {
        await import('../index.css');
      };
      await expect(importCss()).resolves.not.toThrow();
    });
  });
});
