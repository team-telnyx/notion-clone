import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import Dashboard from '../../pages/Dashboard';
import Workspace from '../../pages/Workspace';
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

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function TestAppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/workspace/:workspaceId" element={
        <ProtectedRoute><Workspace /></ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TestWrapper>
        <TestAppRoutes />
      </TestWrapper>
    </MemoryRouter>
  );
}

describe('React Router Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Route Configuration', () => {
    it('redirects root path to dashboard then to login (unauthenticated)', async () => {
      renderWithRouter(['/']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      });
    });

    it('renders login page at /login', async () => {
      renderWithRouter(['/login']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      });
    });

    it('renders register page at /register', async () => {
      renderWithRouter(['/register']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create.*account/i })).toBeInTheDocument();
      });
    });
  });

  describe('Protected Routes', () => {
    it('redirects unauthenticated users from /dashboard to /login', async () => {
      renderWithRouter(['/dashboard']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      });
    });

    it('redirects unauthenticated users from /workspace/:id to /login', async () => {
      renderWithRouter(['/workspace/test-workspace']);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      });
    });
  });

  describe('Route Transitions', () => {
    it('has navigation link from login to register', async () => {
      renderWithRouter(['/login']);

      await waitFor(() => {
        const registerLink = screen.getByRole('link', { name: /create account/i });
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');
      });
    });

    it('has navigation link from register to login', async () => {
      renderWithRouter(['/register']);

      await waitFor(() => {
        const loginLink = screen.getByRole('link', { name: /sign in/i });
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
      });
    });
  });
});
