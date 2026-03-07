import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';

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
    setToken: (token: string) => {
      store['token'] = token;
    },
  };
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const mockApiGet = vi.fn();
const mockApiPost = vi.fn();

vi.mock('../../api/axios', () => ({
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
    defaults: { baseURL: 'http://localhost:3001/api' },
    interceptors: {
      request: { use: vi.fn(), handlers: [] },
      response: { use: vi.fn(), handlers: [] },
    },
  },
}));

function AuthConsumer() {
  const { user, loading, login, logout } = useAuth();
  
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'loaded'}</span>
      <span data-testid="user">{user ? user.name : 'no-user'}</span>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with no user when no token exists', async () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    it('sets loading true when token exists in localStorage', async () => {
      localStorageMock.setToken('existing-token');
      mockApiGet.mockRejectedValueOnce(new Error('Invalid token'));

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
    });

    it('attempts to fetch user data when token exists', async () => {
      localStorageMock.setToken('valid-token');
      mockApiGet.mockResolvedValueOnce({
        data: { id: '1', email: 'test@test.com', name: 'Test User' },
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/auth/me');
        expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      });
    });
  });

  describe('Token Validation on Mount', () => {
    it('removes invalid token and clears user state', async () => {
      localStorageMock.setToken('invalid-token');
      mockApiGet.mockRejectedValueOnce(new Error('Unauthorized'));

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    it('preserves valid token and sets user state', async () => {
      localStorageMock.setToken('valid-token');
      const mockUser = { id: '1', email: 'user@example.com', name: 'Valid User' };
      mockApiGet.mockResolvedValueOnce({ data: mockUser });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('Valid User');
        expect(localStorageMock.removeItem).not.toHaveBeenCalled();
      });
    });
  });

  describe('Context Value Stability', () => {
    it('provides login function', () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('provides logout function', () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('does not throw when useAuth is used within AuthProvider', () => {
      expect(() => {
        render(
          <AuthProvider>
            <AuthConsumer />
          </AuthProvider>
        );
      }).not.toThrow();
    });
  });
});
