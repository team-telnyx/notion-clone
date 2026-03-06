import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../api/axios';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Axios Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('has baseURL defined', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('has request interceptor configured', () => {
    const handlers = (api.interceptors.request as unknown as { handlers: unknown[] }).handlers;
    expect(handlers.length).toBeGreaterThan(0);
  });

  it('has response interceptor configured', () => {
    const handlers = (api.interceptors.response as unknown as { handlers: unknown[] }).handlers;
    expect(handlers.length).toBeGreaterThan(0);
  });
});
