import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
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

const mockApiPost = vi.fn();

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: (...args: unknown[]) => mockApiPost(...args),
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

describe('Login Page Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Initial Render', () => {
    it('renders login heading', () => {
      render(<Login />, { wrapper: TestWrapper });
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    });

    it('renders email input field', () => {
      render(<Login />, { wrapper: TestWrapper });
      expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    });

    it('renders password input field', () => {
      render(<Login />, { wrapper: TestWrapper });
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<Login />, { wrapper: TestWrapper });
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders link to register page', () => {
      render(<Login />, { wrapper: TestWrapper });
      expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
    });
  });

  describe('Form State', () => {
    it('initializes with empty email field', () => {
      render(<Login />, { wrapper: TestWrapper });
      const emailInput = screen.getByPlaceholderText(/email address/i);
      expect(emailInput).toHaveValue('');
    });

    it('initializes with empty password field', () => {
      render(<Login />, { wrapper: TestWrapper });
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toHaveValue('');
    });

    it('does not display error message initially', () => {
      render(<Login />, { wrapper: TestWrapper });
      expect(screen.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    });

    it('submit button is not disabled initially', () => {
      render(<Login />, { wrapper: TestWrapper });
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Input Field Configuration', () => {
    it('email input has correct type', () => {
      render(<Login />, { wrapper: TestWrapper });
      const emailInput = screen.getByPlaceholderText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('password input has correct type', () => {
      render(<Login />, { wrapper: TestWrapper });
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('email input is required', () => {
      render(<Login />, { wrapper: TestWrapper });
      const emailInput = screen.getByPlaceholderText(/email address/i);
      expect(emailInput).toBeRequired();
    });

    it('password input is required', () => {
      render(<Login />, { wrapper: TestWrapper });
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toBeRequired();
    });

    it('email input has autocomplete attribute', () => {
      render(<Login />, { wrapper: TestWrapper });
      const emailInput = screen.getByPlaceholderText(/email address/i);
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('password input has autocomplete attribute', () => {
      render(<Login />, { wrapper: TestWrapper });
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });
  });

  describe('User Interaction', () => {
    it('updates email field on input', async () => {
      const user = userEvent.setup();
      render(<Login />, { wrapper: TestWrapper });
      
      const emailInput = screen.getByPlaceholderText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password field on input', async () => {
      const user = userEvent.setup();
      render(<Login />, { wrapper: TestWrapper });
      
      const passwordInput = screen.getByPlaceholderText(/password/i);
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for inputs', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      expect(screen.getByLabelText(/email address/i, { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    });

    it('form has proper structure', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });
});
