'use client';

import React, { createContext, useContext } from 'react';

// Stub: auth removed, always returns logged-out state
interface AuthContextType {
  token: string | null;
  user: unknown | null;
  login: () => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  refresh: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{ token: null, user: null, login: () => {}, logout: () => {}, refresh: () => {} }}
    >
      {children}
    </AuthContext.Provider>
  );
};
