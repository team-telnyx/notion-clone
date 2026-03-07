import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import { createMockUser, createMockAuthState } from '../utils'

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

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders dashboard heading', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderDashboard()

      expect(screen.getByText(/notion clone/i)).toBeInTheDocument()
    })

    test('displays user name when available', () => {
      const mockUser = createMockUser({ name: 'John Doe' })
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ user: mockUser }))

      renderDashboard()

      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    })

    test('displays user email when name is not available', () => {
      const mockUser = createMockUser({ name: '', email: 'john@example.com' })
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ user: mockUser }))

      renderDashboard()

      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()
    })

    test('renders welcome message', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderDashboard()

      expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument()
    })

    test('renders workspace placeholder text', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderDashboard()

      expect(screen.getByText(/your workspaces will appear here/i)).toBeInTheDocument()
    })

    test('renders logout button', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderDashboard()

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })
  })

  describe('User Actions', () => {
    test('calls logout function when logout button is clicked', async () => {
      const user = userEvent.setup()
      const mockLogout = vi.fn()
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({
          user: createMockUser(),
          logout: mockLogout,
        })
      )

      renderDashboard()

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      await user.click(logoutButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled()
      })
    })
  })

  describe('Tailwind Styling', () => {
    test('has full height layout', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      const { container } = renderDashboard()

      const mainContainer = container.querySelector('.min-h-screen')
      expect(mainContainer).toBeInTheDocument()
    })

    test('has navigation bar with shadow', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      const { container } = renderDashboard()

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('shadow-sm')
    })
  })
})
