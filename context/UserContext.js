import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInMobile, setLoggedInMobile] = useState("");

  return (
    <UserContext.Provider value={{ loggedInMobile, setLoggedInMobile }}>
      {children}
    </UserContext.Provider>
  );
};
