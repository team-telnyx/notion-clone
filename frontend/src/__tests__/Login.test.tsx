import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.resetModules();
  });

  describe('Component Import', () => {
    it('should import Login component without error', async () => {
      const Login = await import('../pages/Login');
      expect(Login.default).toBeDefined();
    });

    it('should export Login as default', async () => {
      const Login = await import('../pages/Login');
      expect(typeof Login.default).toBe('function');
    });
  });
});
