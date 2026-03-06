import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface JwtPayload {
  exp: number;
  sub: string;
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getInitialLoadingState(): boolean {
  const token = localStorage.getItem('token');
  return token !== null && !isTokenExpired(token);
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(getInitialLoadingState);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    } else {
      if (token) {
        localStorage.removeItem('token');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
