import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/api/authApi";
import { TOKEN_STORAGE_KEY } from "@/api/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.user);
    } catch (_error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    persistSession(response.token, response.user);
    return response.user;
  };

  const login = async (payload) => {
    const response = await authApi.login(payload);
    persistSession(response.token, response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_error) {
      // Ignore network errors for logout.
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await authApi.me();
    setUser(response.user);
    return response.user;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

