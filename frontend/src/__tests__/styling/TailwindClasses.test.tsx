import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
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

describe('Tailwind CSS Class Application', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Login Page Styling', () => {
    it('applies layout classes to container', () => {
      const { container } = render(<Login />, { wrapper: TestWrapper });
      
      const layoutDiv = container.querySelector('.min-h-screen');
      expect(layoutDiv).toBeInTheDocument();
      expect(layoutDiv).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('applies background color class', () => {
      const { container } = render(<Login />, { wrapper: TestWrapper });
      
      const bgDiv = container.querySelector('.bg-gray-50');
      expect(bgDiv).toBeInTheDocument();
    });

    it('applies form styling classes', () => {
      const { container } = render(<Login />, { wrapper: TestWrapper });
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('mt-8', 'space-y-6');
    });

    it('applies button styling classes', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveClass('bg-indigo-600', 'text-white', 'rounded-md');
    });

    it('applies input styling classes', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      expect(emailInput).toHaveClass('border', 'border-gray-300');
    });
  });

  describe('Register Page Styling', () => {
    it('applies consistent layout classes with login', () => {
      const { container } = render(<Register />, { wrapper: TestWrapper });
      
      const layoutDiv = container.querySelector('.min-h-screen');
      expect(layoutDiv).toBeInTheDocument();
      expect(layoutDiv).toHaveClass('flex', 'items-center', 'justify-center', 'bg-gray-50');
    });

    it('applies heading typography classes', () => {
      render(<Register />, { wrapper: TestWrapper });
      
      const heading = screen.getByRole('heading', { name: /create your account/i });
      expect(heading).toHaveClass('text-3xl', 'font-extrabold', 'text-gray-900');
    });

    it('applies responsive padding classes', () => {
      const { container } = render(<Register />, { wrapper: TestWrapper });
      
      const paddedElement = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8');
      expect(paddedElement).toBeInTheDocument();
    });
  });

  describe('Responsive Utility Classes', () => {
    it('uses sm: responsive prefix for text size', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const input = screen.getByPlaceholderText(/email/i);
      expect(input.className).toContain('sm:text-sm');
    });

    it('uses lg: responsive prefix for padding', () => {
      const { container } = render(<Login />, { wrapper: TestWrapper });
      
      const element = container.querySelector('[class*="lg:px-8"]');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Interactive State Classes', () => {
    it('has hover state classes on buttons', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button.className).toContain('hover:bg-indigo-700');
    });

    it('has focus state classes on inputs', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const input = screen.getByPlaceholderText(/email/i);
      expect(input.className).toContain('focus:ring-indigo-500');
      expect(input.className).toContain('focus:border-indigo-500');
    });

    it('has disabled state classes on buttons', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button.className).toContain('disabled:opacity-50');
    });
  });

  describe('Link Styling', () => {
    it('applies text color classes to links', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const createAccountLink = screen.getByRole('link', { name: /create account/i });
      expect(createAccountLink).toHaveClass('text-indigo-600');
    });

    it('has hover state on links', () => {
      render(<Login />, { wrapper: TestWrapper });
      
      const createAccountLink = screen.getByRole('link', { name: /create account/i });
      expect(createAccountLink.className).toContain('hover:text-indigo-500');
    });
  });
});
