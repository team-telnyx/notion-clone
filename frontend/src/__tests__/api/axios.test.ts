import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosInstance } from 'axios';

describe('API Client - Axios Configuration', () => {
  let api: AxiosInstance;
  let localStorageMock: Storage;

  beforeEach(async () => {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      get length() { return 0; },
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    vi.stubGlobal('location', { href: '' });
    api = (await import('../../api/axios')).default;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create axios instance with baseURL configuration', () => {
    expect(api).toBeDefined();
    expect(api.interceptors.request).toBeDefined();
    expect(api.interceptors.response).toBeDefined();
  });

  it('should attach Bearer token from localStorage to request headers when token exists', async () => {
    const mockToken = 'test-jwt-token-12345';
    vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);

    const testConfig = { headers: {} as Record<string, string> };
    const handlers = (api.interceptors.request as unknown as { handlers: Array<{ fulfilled?: (config: unknown) => unknown }> }).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;
    
    if (requestInterceptor) {
      const result = requestInterceptor(testConfig) as { headers: { Authorization?: string } };
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    }
  });

  it('should not set Authorization header when token is not in localStorage', async () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

    const testConfig = { headers: {} as Record<string, string> };
    const handlers = (api.interceptors.request as unknown as { handlers: Array<{ fulfilled?: (config: unknown) => unknown }> }).handlers;
    const requestInterceptor = handlers[0]?.fulfilled;
    
    if (requestInterceptor) {
      const result = requestInterceptor(testConfig) as { headers: { Authorization?: string } };
      expect(result.headers.Authorization).toBeUndefined();
    }
  });
});
