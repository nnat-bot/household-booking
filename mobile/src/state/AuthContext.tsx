import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMe, login as loginRequest, register as registerRequest } from '../api/auth';
import { setToken } from '../api/client';
import type { LoginResult, Role, User } from '../types';

const TOKEN_KEY = 'session-token';

type AuthValue = {
  user: User | null;
  starting: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = await SecureStore.getItemAsync(TOKEN_KEY);
        if (saved) {
          setToken(saved);
          setUser(await getMe());
        }
      } catch {
        setToken(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
      } finally {
        setStarting(false);
      }
    };

    restoreSession();
  }, []);

  const saveSession = async (result: LoginResult) => {
    setToken(result.token);
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    setUser(await getMe());
  };

  const login = async (email: string, password: string) => {
    await saveSession(await loginRequest(email, password));
  };

  const register = async (name: string, email: string, password: string, role: Role) => {
    await saveSession(await registerRequest(name, email, password, role));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
  };

  return (
    <AuthContext.Provider value={{ user, starting, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
