"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Tránh lỗi hydration

  // Chỉ cập nhật token sau khi component đã mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Chạy trên client
      setIsMounted(true);
      const storedToken =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      if (storedToken) {
        setTokenState(storedToken);
      }
    }
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        sessionStorage.setItem("token", newToken);
      } else {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
      }
    }
  };

  const isAuthenticated = !!token;

  // Tránh render khi chưa mount để tránh lỗi hydration
  if (!isMounted) return null;

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
