import { useState, useEffect } from 'react';
import api from '@/api/axios';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

function getInitialState(): AuthState {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    user: null,
    loading: !!token,
    error: null,
  };
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(getInitialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    api.get('/auth/me')
      .then((res) => setState({ user: res.data, loading: false, error: null }))
      .catch(() => {
        localStorage.removeItem('token');
        setState({ user: null, loading: false, error: null });
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setState({ user: res.data.user, loading: false, error: null });
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setState((prev) => ({ ...prev, error: message }));
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const res = await api.post('/auth/register', { email, password, name });
      localStorage.setItem('token', res.data.token);
      setState({ user: res.data.user, loading: false, error: null });
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setState((prev) => ({ ...prev, error: message }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({ user: null, loading: false, error: null });
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
  };
}
