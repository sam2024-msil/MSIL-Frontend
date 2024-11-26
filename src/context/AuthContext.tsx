import React, { createContext, useContext, ReactNode } from 'react';


type AuthContextType = {
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  token: null
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const token = '';

  return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
