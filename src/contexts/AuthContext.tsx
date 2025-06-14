import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Allow overriding the API base via env and strip :3001 if present. If the app
  // is served over HTTPS ensure the API base also uses HTTPS.
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  let API_BASE_URL = rawBaseUrl.replace(':3001', '');
  if (window.location.protocol === 'https:' && API_BASE_URL.startsWith('http://')) {
    API_BASE_URL = API_BASE_URL.replace('http://', 'https://');
  }
  const LOGIN_ENDPOINT = `${API_BASE_URL}/login`;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Use a POST request to securely transmit credentials
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setUser(data.user as User);
      setToken(data.token as string);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = user !== null && token !== null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
