import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createMockUser, createMockAuthState } from './utils'

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import { useAuth } from '../hooks/useAuth'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Workspace from '../pages/Workspace'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function TestApp({ initialEntries = ['/'] }: { initialEntries?: string[] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:workspaceId"
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Router Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ProtectedRoute', () => {
    test('redirects unauthenticated users to login from dashboard', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      render(<TestApp initialEntries={['/dashboard']} />)

      await waitFor(() => {
        expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
      })
    })

    test('allows authenticated users to access dashboard', async () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      render(<TestApp initialEntries={['/dashboard']} />)

      await waitFor(() => {
        expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument()
      })
    })

    test('shows loading state during authentication check', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState({ loading: true }))

      render(<TestApp initialEntries={['/dashboard']} />)

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    test('redirects unauthenticated users to login from workspace', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      render(<TestApp initialEntries={['/workspace/test-workspace-id']} />)

      await waitFor(() => {
        expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
      })
    })

    test('allows authenticated users to access workspace', async () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      render(<TestApp initialEntries={['/workspace/test-workspace-id']} />)

      await waitFor(() => {
        expect(screen.getByText(/test-workspace-id/i)).toBeInTheDocument()
      })
    })
  })

  describe('Public Routes', () => {
    test('login page is accessible when unauthenticated', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      render(<TestApp initialEntries={['/login']} />)

      await waitFor(() => {
        expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
      })
    })

    test('register page is accessible when unauthenticated', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      render(<TestApp initialEntries={['/register']} />)

      await waitFor(() => {
        expect(screen.getByText(/create your account/i)).toBeInTheDocument()
      })
    })
  })

  describe('Root Route', () => {
    test('redirects root path to dashboard for authenticated users', async () => {
      vi.mocked(useAuth).mockReturnValue(
        createMockAuthState({ user: createMockUser() })
      )

      render(<TestApp initialEntries={['/']} />)

      await waitFor(() => {
        expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument()
      })
    })

    test('redirects root path through dashboard to login for unauthenticated users', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthState())

      render(<TestApp initialEntries={['/']} />)

      await waitFor(() => {
        expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
      })
    })
  })
})
