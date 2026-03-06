import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const locationMock = {
  href: '',
  assign: vi.fn(),
  replace: vi.fn()
}

Object.defineProperty(window, 'location', {
  value: locationMock,
  writable: true
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
