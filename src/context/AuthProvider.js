import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState();

  return (
    <AuthContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
