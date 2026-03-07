import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../../pages/Login'
import { createMockAuthState, TEST_CREDENTIALS } from '../utils'

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import { useAuth } from '../../hooks/useAuth'

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders login heading', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument()
    })

    test('renders email input field', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument()
    })

    test('renders password input field', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    })

    test('renders sign in button', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    test('renders link to registration page', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument()
    })
  })

  describe('Form Interaction', () => {
    test('allows typing in email field', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      const emailInput = screen.getByPlaceholderText(/email address/i)
      await user.type(emailInput, TEST_CREDENTIALS.email)

      expect(emailInput).toHaveValue(TEST_CREDENTIALS.email)
    })

    test('allows typing in password field', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      const passwordInput = screen.getByPlaceholderText(/password/i)
      await user.type(passwordInput, TEST_CREDENTIALS.password)

      expect(passwordInput).toHaveValue(TEST_CREDENTIALS.password)
    })

    test('calls login function on form submission', async () => {
      const user = userEvent.setup()
      const mockLogin = vi.fn().mockResolvedValue({})
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ login: mockLogin }))

      renderLogin()

      const emailInput = screen.getByPlaceholderText(/email address/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, TEST_CREDENTIALS.email)
      await user.type(passwordInput, TEST_CREDENTIALS.password)
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password)
      })
    })

    test('shows error message on login failure', async () => {
      const user = userEvent.setup()
      const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ login: mockLogin }))

      renderLogin()

      const emailInput = screen.getByPlaceholderText(/email address/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, TEST_CREDENTIALS.email)
      await user.type(passwordInput, TEST_CREDENTIALS.password)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
      })
    })

    test('disables submit button while loading', async () => {
      const user = userEvent.setup()
      const mockLogin = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      )
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ login: mockLogin }))

      renderLogin()

      const emailInput = screen.getByPlaceholderText(/email address/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, TEST_CREDENTIALS.email)
      await user.type(passwordInput, TEST_CREDENTIALS.password)
      await user.click(submitButton)

      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    })
  })

  describe('Tailwind Styling', () => {
    test('has centered layout with min-height', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      const { container } = renderLogin()

      const mainContainer = container.querySelector('.min-h-screen')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center')
    })

    test('submit button has correct styling classes', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderLogin()

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toHaveClass('bg-indigo-600', 'text-white', 'rounded-md')
    })
  })
})
