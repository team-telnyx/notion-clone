import { vi } from 'vitest'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from 'react-router-dom'
import { ReactElement } from 'react'

export interface MockUser {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export interface MockAuthState {
  user: MockUser | null
  loading: boolean
  login: ReturnType<typeof vi.fn>
  register: ReturnType<typeof vi.fn>
  logout: ReturnType<typeof vi.fn>
}

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  }
}

export function createMockAuthState(overrides: Partial<MockAuthState> = {}): MockAuthState {
  return {
    user: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  }
}

interface WrapperOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: MemoryRouterProps['initialEntries']
  useMemoryRouter?: boolean
}

export function renderWithRouter(
  ui: ReactElement,
  { initialEntries = ['/'], useMemoryRouter = true, ...options }: WrapperOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    if (useMemoryRouter) {
      return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    }
    return <BrowserRouter>{children}</BrowserRouter>
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
  }
}

export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
}
