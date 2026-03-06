import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.resetModules();
  });

  describe('Component Import', () => {
    it('should import Register component without error', async () => {
      const Register = await import('../pages/Register');
      expect(Register.default).toBeDefined();
    });

    it('should export Register as default', async () => {
      const Register = await import('../pages/Register');
      expect(typeof Register.default).toBe('function');
    });
  });
});
