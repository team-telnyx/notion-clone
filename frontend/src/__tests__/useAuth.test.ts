import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('Module Import', () => {
    it('should export useAuth hook', async () => {
      const { useAuth } = await import('../hooks/useAuth');
      expect(useAuth).toBeDefined();
      expect(typeof useAuth).toBe('function');
    });
  });
});
