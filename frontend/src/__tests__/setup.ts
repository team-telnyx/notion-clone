import '@testing-library/jest-dom/vitest'
import { vi, beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {}
  }),
  get length() {
    return Object.keys(localStorageMock.store).length
  },
  key: vi.fn((index: number) => {
    return Object.keys(localStorageMock.store)[index] ?? null
  }),
}

vi.stubGlobal('localStorage', localStorageMock)

beforeEach(() => {
  localStorageMock.store = {}
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

export { localStorageMock }
