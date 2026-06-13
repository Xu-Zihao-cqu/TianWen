import { createContext, useContext } from 'react';

// v2 预留：用户认证 Context
// v1 阶段仅占位，不做任何实现

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // v1: 直接透传 children，无任何逻辑
  return children;
}
