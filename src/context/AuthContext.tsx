import React, { createContext, useContext, ReactNode } from 'react';
import AppStateUtil from '../utils/AppStateUtil';


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

    const token:any = AppStateUtil.getAuthToken();

  return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
