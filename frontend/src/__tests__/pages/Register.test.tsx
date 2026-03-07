import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Register from '../../pages/Register'
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

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders registration heading', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    })

    test('renders name input field', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument()
    })

    test('renders email input field', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument()
    })

    test('renders password input field', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    })

    test('renders create account button', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    test('renders link to login page', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument()
    })
  })

  describe('Form Interaction', () => {
    test('allows typing in name field', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      const nameInput = screen.getByPlaceholderText(/full name/i)
      await user.type(nameInput, TEST_CREDENTIALS.name)

      expect(nameInput).toHaveValue(TEST_CREDENTIALS.name)
    })

    test('allows typing in email field', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      const emailInput = screen.getByPlaceholderText(/email address/i)
      await user.type(emailInput, TEST_CREDENTIALS.email)

      expect(emailInput).toHaveValue(TEST_CREDENTIALS.email)
    })

    test('allows typing in password field', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      const passwordInput = screen.getByPlaceholderText(/password/i)
      await user.type(passwordInput, TEST_CREDENTIALS.password)

      expect(passwordInput).toHaveValue(TEST_CREDENTIALS.password)
    })

    test('calls register function on form submission', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn().mockResolvedValue({})
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ register: mockRegister }))

      renderRegister()

      const nameInput = screen.getByPlaceholderText(/full name/i)
      const emailInput = screen.getByPlaceholderText(/email address/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(nameInput, TEST_CREDENTIALS.name)
      await user.type(emailInput, TEST_CREDENTIALS.email)
      await user.type(passwordInput, TEST_CREDENTIALS.password)
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          TEST_CREDENTIALS.email,
          TEST_CREDENTIALS.password,
          TEST_CREDENTIALS.name
        )
      })
    })

    test('shows error message on registration failure', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn().mockRejectedValue(new Error('Registration failed'))
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ register: mockRegister }))

      renderRegister()

      const nameInput = screen.getByPlaceholderText(/full name/i)
      const emailInput = screen.getByPlaceholderText(/email address/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(nameInput, TEST_CREDENTIALS.name)
      await user.type(emailInput, TEST_CREDENTIALS.email)
      await user.type(passwordInput, TEST_CREDENTIALS.password)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
      })
    })

    test('disables submit button while loading', async () => {
      const user = userEvent.setup()
      const mockRegister = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      )
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ register: mockRegister }))

      renderRegister()

      const nameInput = screen.getByPlaceholderText(/full name/i)
      const emailInput = screen.getByPlaceholderText(/email address/i)
      const passwordInput = screen.getByPlaceholderText(/password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(nameInput, TEST_CREDENTIALS.name)
      await user.type(emailInput, TEST_CREDENTIALS.email)
      await user.type(passwordInput, TEST_CREDENTIALS.password)
      await user.click(submitButton)

      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
    })
  })

  describe('Tailwind Styling', () => {
    test('has centered layout with min-height', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      const { container } = renderRegister()

      const mainContainer = container.querySelector('.min-h-screen')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center')
    })

    test('submit button has correct styling classes', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      renderRegister()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveClass('bg-indigo-600', 'text-white', 'rounded-md')
    })
  })
})
