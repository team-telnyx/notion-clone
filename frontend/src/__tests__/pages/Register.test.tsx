import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../pages/Register';
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

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

describe('Register Page Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Initial Render', () => {
    it('renders register heading', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    });

    it('renders name input field', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    });

    it('renders email input field', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    });

    it('renders password input field', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('renders link to login page', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Form State', () => {
    it('initializes with empty name field', () => {
      render(<Register />, { wrapper: TestWrapper });
      const nameInput = screen.getByPlaceholderText(/^name$/i);
      expect(nameInput).toHaveValue('');
    });

    it('initializes with empty email field', () => {
      render(<Register />, { wrapper: TestWrapper });
      const emailInput = screen.getByPlaceholderText(/email address/i);
      expect(emailInput).toHaveValue('');
    });

    it('initializes with empty password field', () => {
      render(<Register />, { wrapper: TestWrapper });
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toHaveValue('');
    });

    it('does not display error message initially', () => {
      render(<Register />, { wrapper: TestWrapper });
      expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
    });
  });

  describe('Input Field Configuration', () => {
    it('name input has correct type', () => {
      render(<Register />, { wrapper: TestWrapper });
      const nameInput = screen.getByPlaceholderText(/^name$/i);
      expect(nameInput).toHaveAttribute('type', 'text');
    });

    it('email input has correct type', () => {
      render(<Register />, { wrapper: TestWrapper });
      const emailInput = screen.getByPlaceholderText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('password input has correct type', () => {
      render(<Register />, { wrapper: TestWrapper });
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('all inputs are required', () => {
      render(<Register />, { wrapper: TestWrapper });
      
      const nameInput = screen.getByPlaceholderText(/^name$/i);
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      
      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it('inputs have autocomplete attributes', () => {
      render(<Register />, { wrapper: TestWrapper });
      
      const nameInput = screen.getByPlaceholderText(/^name$/i);
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      
      expect(nameInput).toHaveAttribute('autocomplete', 'name');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    });
  });

  describe('User Interaction', () => {
    it('updates name field on input', async () => {
      const user = userEvent.setup();
      render(<Register />, { wrapper: TestWrapper });
      
      const nameInput = screen.getByPlaceholderText(/^name$/i);
      await user.type(nameInput, 'Test User');
      
      expect(nameInput).toHaveValue('Test User');
    });

    it('updates email field on input', async () => {
      const user = userEvent.setup();
      render(<Register />, { wrapper: TestWrapper });
      
      const emailInput = screen.getByPlaceholderText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password field on input', async () => {
      const user = userEvent.setup();
      render(<Register />, { wrapper: TestWrapper });
      
      const passwordInput = screen.getByPlaceholderText(/password/i);
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Navigation', () => {
    it('login link points to correct route', () => {
      render(<Register />, { wrapper: TestWrapper });
      
      const loginLink = screen.getByRole('link', { name: /sign in/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
