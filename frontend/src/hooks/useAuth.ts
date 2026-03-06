import { useState, useEffect } from 'react';
import api from '../api/axios';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthError {
  message: string;
}

function getToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

function setToken(token: string): void {
  try {
    localStorage.setItem('token', token);
  } catch {
    // Storage unavailable
  }
}

function removeToken(): void {
  try {
    localStorage.removeItem('token');
  } catch {
    // Storage unavailable
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!getToken());
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        removeToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError({ message: errorMessage });
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { email, password, name });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError({ message: errorMessage });
      throw err;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setError(null);
  };

  return { user, loading, error, login, register, logout };
}
