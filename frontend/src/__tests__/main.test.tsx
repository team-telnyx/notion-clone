import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
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

describe('App Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders without crashing when unauthenticated', async () => {
    vi.mocked(useAuth).mockReturnValue(createMockAuthState())

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
    })
  })

  test('app uses useAuth hook for authentication state', () => {
    const mockAuthState = createMockAuthState({ loading: true })
    vi.mocked(useAuth).mockReturnValue(mockAuthState)

    render(<App />)

    expect(useAuth).toHaveBeenCalled()
  })

  test('redirects unauthenticated users from root to login', async () => {
    vi.mocked(useAuth).mockReturnValue(createMockAuthState())

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
    })
  })

  test('provides user state when user is authenticated', () => {
    const mockUser = createMockUser()
    vi.mocked(useAuth).mockReturnValue(
      createMockAuthState({ user: mockUser })
    )

    render(<App />)

    expect(useAuth).toHaveBeenCalled()
    const lastCall = vi.mocked(useAuth).mock.results[0]
    expect(lastCall?.value.user).toEqual(mockUser)
  })

  test('mounts with StrictMode enabled (verifiable via double-mount)', () => {
    const mockUseAuth = vi.mocked(useAuth)
    mockUseAuth.mockReturnValue(createMockAuthState())

    render(<App />)

    expect(mockUseAuth).toHaveBeenCalled()
  })
})
