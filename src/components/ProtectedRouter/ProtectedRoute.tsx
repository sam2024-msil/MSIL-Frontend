import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppStateUtil from '../../utils/AppStateUtil';

interface ProtectedRouteProps {
    children: React.ReactNode;
    path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, path }) => {
    const [loggedInUserRole, setLoggedInUserRole] = useState<number>(0);
    
    
    useEffect(() => {
        const role = AppStateUtil.getRoleDetails();
        setLoggedInUserRole(role);
    },[])

    if (loggedInUserRole === 2 || loggedInUserRole === 3) {
        return <Navigate to="/chat" state={{ from: path }} replace />;
    } 
    
    return <>{children}</>;
};

export default ProtectedRoute;