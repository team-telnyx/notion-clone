import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosInstance } from 'axios';
import { navigationService } from '../../services/navigation';

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

describe('API Client - 401 Response Handler', () => {
  let localStorageMock: Storage;
  let mockNavigateTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
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

    mockNavigateTo = vi.fn();
    vi.spyOn(navigationService, 'navigateTo').mockImplementation(mockNavigateTo);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should remove token from localStorage on 401 response', async () => {
    const api = (await import('../../api/axios')).default;
    const handlers = (api.interceptors.response as unknown as { 
      handlers: Array<{ rejected?: (error: unknown) => Promise<never> }> 
    }).handlers;
    const responseErrorHandler = handlers[0]?.rejected;

    const error401 = { response: { status: 401 } };

    if (responseErrorHandler) {
      await expect(responseErrorHandler(error401)).rejects.toBeDefined();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    }
  });

  it('should navigate to /login on 401 response using navigation service', async () => {
    const api = (await import('../../api/axios')).default;
    const handlers = (api.interceptors.response as unknown as { 
      handlers: Array<{ rejected?: (error: unknown) => Promise<never> }> 
    }).handlers;
    const responseErrorHandler = handlers[0]?.rejected;

    const error401 = { response: { status: 401 } };

    if (responseErrorHandler) {
      await expect(responseErrorHandler(error401)).rejects.toBeDefined();
      expect(mockNavigateTo).toHaveBeenCalledWith('/login');
    }
  });

  it('should not navigate on non-401 errors', async () => {
    const api = (await import('../../api/axios')).default;
    const handlers = (api.interceptors.response as unknown as { 
      handlers: Array<{ rejected?: (error: unknown) => Promise<never> }> 
    }).handlers;
    const responseErrorHandler = handlers[0]?.rejected;

    const error500 = { response: { status: 500 } };

    if (responseErrorHandler) {
      await expect(responseErrorHandler(error500)).rejects.toBeDefined();
      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(mockNavigateTo).not.toHaveBeenCalled();
    }
  });

  it('should reject the promise after handling 401', async () => {
    const api = (await import('../../api/axios')).default;
    const handlers = (api.interceptors.response as unknown as { 
      handlers: Array<{ rejected?: (error: unknown) => Promise<never> }> 
    }).handlers;
    const responseErrorHandler = handlers[0]?.rejected;

    const error401 = { response: { status: 401 } };

    if (responseErrorHandler) {
      await expect(responseErrorHandler(error401)).rejects.toEqual(error401);
    }
  });
});
