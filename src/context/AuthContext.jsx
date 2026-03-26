import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clearGuestTracking = () => {
  localStorage.removeItem("guestScanCount");
  localStorage.removeItem("guestScans");
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await delay(1200);
      const mockUser = {
        id: "user_123",
        email,
        name: email.split("@")[0],
        plan: "free",
        scansRemaining: 50,
        joinedAt: new Date().toISOString(),
      };
      clearGuestTracking();
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true, user: mockUser };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      await delay(1200);
      const mockUser = {
        id: "user_" + Date.now(),
        email,
        name,
        plan: "free",
        scansRemaining: 50,
        joinedAt: new Date().toISOString(),
      };
      clearGuestTracking();
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true, user: mockUser };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
