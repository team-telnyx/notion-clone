import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  register: (email: string, password: string, name: string) => Promise<{ token: string; user: User }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
