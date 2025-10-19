import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const signup = (email, password) => {
    if (email && password && !users.find(u => u.email === email)) {
      const newUser = { email, password, name: email.split('@')[0] };
      setUsers([...users, newUser]);
      setUser(newUser);
      return true;
    }
    return false;
  };

  const login = (email, password) => {
    const existingUser = users.find(u => u.email === email && u.password === password);
    if (existingUser) {
      setUser(existingUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
