import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  user: string | null;
  login: (accessToken: string, refreshToken: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || storedToken === "undefined" || storedToken === "null") {
      return null;
    }
    return storedToken;
  });

  const [user, setUser] = useState<string | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }
    return storedUser;
  });

  const login = (accessToken: string, refreshToken: string, email: string) => {
    setToken(accessToken);
    setUser(email);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", email);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext value={{ token, user, login, logout }}>{children}</AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
