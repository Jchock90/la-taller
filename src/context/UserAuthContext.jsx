import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserAuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function UserAuthProvider({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem('user_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToken) {
      localStorage.setItem('user_token', userToken);
    } else {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
    }
  }, [userToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }, [user]);

  // Verify token on mount
  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid');
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => {
        setUserToken(null);
        setUser(null);
      });
  }, []);

  const login = useCallback((token, userData) => {
    setUserToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUserToken(null);
    setUser(null);
  }, []);

  const isUserAuthenticated = !!userToken && !!user;

  return (
    <UserAuthContext.Provider value={{ userToken, user, login, logout, isUserAuthenticated, loading, setLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
