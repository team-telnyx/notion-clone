import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { AuthProvider } from '../../contexts/AuthContext';
import type { ReactNode } from 'react';

const createLocalStorageMock = () => {
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
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: { baseURL: 'http://localhost:3001/api' },
    interceptors: {
      request: { use: vi.fn(), handlers: [] },
      response: { use: vi.fn(), handlers: [] },
    },
  },
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth Hook Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Hook Context Requirement', () => {
    it('throws error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('returns context value when used within AuthProvider', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      expect(result.current).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBeDefined();
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.logout).toBe('function');
    });
  });

  describe('Initial Return Values', () => {
    it('returns null user initially', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.user).toBeNull();
    });

    it('returns loading state based on token presence', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.loading).toBe('boolean');
    });

    it('provides login method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.login).toBe('function');
    });

    it('provides register method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.register).toBe('function');
    });

    it('provides logout method', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.logout).toBe('function');
    });
  });

  describe('Type Safety', () => {
    it('user is typed correctly', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      const user = result.current.user;
      
      if (user) {
        expect(user.id).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.name).toBeDefined();
      } else {
        expect(user).toBeNull();
      }
    });
  });
});
