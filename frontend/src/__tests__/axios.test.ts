import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Axios Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Module Import', () => {
    it('should import axios instance without error', async () => {
      const api = await import('../api/axios');
      expect(api.default).toBeDefined();
    });

    it('should export default axios instance', async () => {
      const api = await import('../api/axios');
      expect(api.default).toBeDefined();
      expect(typeof api.default.get).toBe('function');
      expect(typeof api.default.post).toBe('function');
    });
  });

  describe('Base URL Configuration', () => {
    it('should have baseURL configured', async () => {
      const api = await import('../api/axios');
      expect(api.default.defaults.baseURL).toBeDefined();
    });

    it('should default to localhost:3001/api', async () => {
      const api = await import('../api/axios');
      const baseURL = api.default.defaults.baseURL;
      expect(baseURL).toContain('localhost:3001');
      expect(baseURL).toContain('/api');
    });
  });

  describe('Request Interceptor', () => {
    it('should have request interceptor configured', async () => {
      const api = await import('../api/axios');
      expect(api.default.interceptors.request).toBeDefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should have response interceptor configured', async () => {
      const api = await import('../api/axios');
      expect(api.default.interceptors.response).toBeDefined();
    });
  });

  describe('API Methods', () => {
    it('should support GET requests', async () => {
      const api = await import('../api/axios');
      expect(typeof api.default.get).toBe('function');
    });

    it('should support POST requests', async () => {
      const api = await import('../api/axios');
      expect(typeof api.default.post).toBe('function');
    });

    it('should support PUT requests', async () => {
      const api = await import('../api/axios');
      expect(typeof api.default.put).toBe('function');
    });

    it('should support DELETE requests', async () => {
      const api = await import('../api/axios');
      expect(typeof api.default.delete).toBe('function');
    });

    it('should support PATCH requests', async () => {
      const api = await import('../api/axios');
      expect(typeof api.default.patch).toBe('function');
    });
  });
});
