import { describe, it, expect } from 'vitest';

describe('Vitest Configuration', () => {
  describe('Vitest Package', () => {
    it('should have vitest package available', async () => {
      const vitest = await import('vitest');
      expect(vitest).toBeDefined();
      expect(vitest.describe).toBeDefined();
      expect(vitest.it).toBeDefined();
      expect(vitest.expect).toBeDefined();
    });
  });

  describe('Test Environment', () => {
    it('should be running in jsdom environment', () => {
      expect(typeof document).toBe('object');
      expect(typeof window).toBe('object');
    });

    it('should have DOM APIs available', () => {
      expect(document.createElement).toBeDefined();
      expect(document.getElementById).toBeDefined();
      expect(document.querySelector).toBeDefined();
    });
  });
});
