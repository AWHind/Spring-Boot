"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ✅ SAFE AUTO LOGIN
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored || stored === "undefined" || stored === "null") {
        localStorage.removeItem("user");
        setUser(null);
      } else {
        const parsed = JSON.parse(stored);

        if (parsed && parsed.id) {
          setUser(parsed);
        } else {
          localStorage.removeItem("user");
        }
      }
    } catch {
      localStorage.removeItem("user");
    } finally {
      setIsReady(true);
    }
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    const user: User = data.user || data;

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
      <AuthContext.Provider value={{ user, isReady, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};