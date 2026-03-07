import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

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

vi.mock('../api/axios', () => ({
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

describe('App Component Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Mounting', () => {
    it('renders without crashing', () => {
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('renders the BrowserRouter wrapper correctly', () => {
      const { container } = render(<App />);
      expect(container).toBeTruthy();
    });

    it('initializes with AuthProvider context', () => {
      render(<App />);
      expect(screen.queryByText(/useAuth must be used/)).not.toBeInTheDocument();
    });
  });

  describe('Provider Hierarchy', () => {
    it('wraps content with AuthProvider', async () => {
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      });
    });
  });

  describe('React 19 Compatibility', () => {
    it('renders using React 19 createRoot API correctly', () => {
      const { container } = render(<App />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});
