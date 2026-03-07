import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('useAuth Hook', () => {
  let localStorageMock: { [key: string]: string | null };
  let setItemSpy: ReturnType<typeof vi.fn>;
  let getItemSpy: ReturnType<typeof vi.fn>;
  let removeItemSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorageMock = {};
    setItemSpy = vi.fn((key, value) => { localStorageMock[key] = value; });
    getItemSpy = vi.fn((key) => localStorageMock[key] || null);
    removeItemSpy = vi.fn((key) => { delete localStorageMock[key]; });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemSpy,
        setItem: setItemSpy,
        removeItem: removeItemSpy,
        clear: vi.fn(),
      },
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading true and user null', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('should set user when valid token exists on mount', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    localStorageMock['token'] = 'valid-token';
    
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should clear token and set user to null when token is invalid on mount', async () => {
    localStorageMock['token'] = 'invalid-token';
    
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Invalid token'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(removeItemSpy).toHaveBeenCalledWith('token');
  });

  it('should complete loading when no token exists', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should handle successful login', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = {
      token: 'new-jwt-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login(credentials.email, credentials.password);
    });

    expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(setItemSpy).toHaveBeenCalledWith('token', 'new-jwt-token');
    expect(result.current.user).toEqual(mockResponse.user);
  });

  it('should handle successful registration', async () => {
    const userData = { email: 'new@example.com', password: 'password123', name: 'New User' };
    const mockResponse = {
      token: 'new-jwt-token',
      user: { id: '2', email: 'new@example.com', name: 'New User' }
    };

    vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.register(userData.email, userData.password, userData.name);
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
    expect(setItemSpy).toHaveBeenCalledWith('token', 'new-jwt-token');
    expect(result.current.user).toEqual(mockResponse.user);
  });

  it('should handle logout by clearing token and user state', async () => {
    localStorageMock['token'] = 'existing-token';
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    act(() => {
      result.current.logout();
    });

    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(result.current.user).toBeNull();
  });
});
