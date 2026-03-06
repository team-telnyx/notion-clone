import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.resetModules();
  });

  describe('Component Import', () => {
    it('should import Dashboard component without error', async () => {
      const Dashboard = await import('../pages/Dashboard');
      expect(Dashboard.default).toBeDefined();
    });

    it('should export Dashboard as default', async () => {
      const Dashboard = await import('../pages/Dashboard');
      expect(typeof Dashboard.default).toBe('function');
    });
  });
});
