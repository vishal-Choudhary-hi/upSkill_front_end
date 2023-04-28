import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      setUser(userId);
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
