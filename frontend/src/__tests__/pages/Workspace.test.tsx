import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Workspace from '../../pages/Workspace'
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

function renderWorkspace(workspaceId = 'test-workspace-123') {
  return render(
    <MemoryRouter initialEntries={[`/workspace/${workspaceId}`]}>
      <Routes>
        <Route path="/workspace/:workspaceId" element={<Workspace />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Workspace Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders workspace heading', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderWorkspace()

      expect(screen.getByRole('heading', { level: 1, name: /workspace/i })).toBeInTheDocument()
    })

    test('displays workspace ID from route params', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderWorkspace('my-custom-workspace')

      expect(screen.getByText(/my-custom-workspace/i)).toBeInTheDocument()
    })

    test('displays user name when available', () => {
      const mockUser = createMockUser({ name: 'Jane Doe' })
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ user: mockUser }))

      renderWorkspace()

      expect(screen.getByText(/jane doe/i)).toBeInTheDocument()
    })

    test('displays user email when name is not available', () => {
      const mockUser = createMockUser({ name: '', email: 'jane@example.com' })
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ user: mockUser }))

      renderWorkspace()

      expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument()
    })

    test('renders back button', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderWorkspace()

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })

    test('renders logout button', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderWorkspace()

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })

    test('renders pages placeholder text', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderWorkspace()

      expect(screen.getByText(/your pages will appear here/i)).toBeInTheDocument()
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

      renderWorkspace()

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      await user.click(logoutButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled()
      })
    })

    test('navigates to dashboard when back button is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      renderWorkspace()

      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })
    })
  })

  describe('Tailwind Styling', () => {
    test('has full height layout', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      const { container } = renderWorkspace()

      const mainContainer = container.querySelector('.min-h-screen')
      expect(mainContainer).toBeInTheDocument()
    })

    test('has navigation bar with shadow', () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      const { container } = renderWorkspace()

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('shadow-sm')
    })
  })
})
