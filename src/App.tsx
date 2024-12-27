import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css'
import { MsalProvider } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import AuthLayout from './AuthLayout/AuthLayout';
import { AuthProvider } from './context/AuthContext';
import UserList from './components/UserManagement/UserList';
import DocumentListing from './components/DocumentUpload/DocumentListing';
import ModuleList from './components/ModuleManagement/ModuleList';
import Chat from './components/ChatInterface/Chat';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRouter/ProtectedRoute';


type AppProps = {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
  const location = useLocation();

  return (
    <MsalProvider instance={pca}>
      <AuthProvider>
        <ToastProvider>
          <AuthLayout>
          <ErrorBoundary
          fallback={
            <div>
              <h1>Something went wrong.</h1>
              <button onClick={() => window.location.reload()}>Reload</button>
            </div>
          }
          >
            <Routes>
              <Route path="/document-management" element={
                <ProtectedRoute path={location.pathname} >
                  <DocumentListing />
                </ProtectedRoute>
                } />
              <Route path="/chat" element={
                  <Chat />
                } />
              <Route path="/user-management" element={
                <ProtectedRoute path={location.pathname} >
                  <UserList />
                </ProtectedRoute>
                } />
              <Route path="/module-management" element={
                <ProtectedRoute path={location.pathname} >
                  <ModuleList />
                </ProtectedRoute>
                } />
            </Routes>
            </ErrorBoundary>
          </AuthLayout>
        </ToastProvider>
      </AuthProvider>
    </MsalProvider>
  )
}

export default App
