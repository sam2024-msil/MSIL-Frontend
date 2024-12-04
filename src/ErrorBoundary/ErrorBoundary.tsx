import React, { ReactNode, useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  const errorHandler = (event: ErrorEvent) => {
    setHasError(true);
    setError(event.error);
  };

  useEffect(() => {
    // Attach global error handler
    window.addEventListener('error', errorHandler);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Oops! Something went wrong.</h1>
        <p>{error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={resetError} style={{ marginTop: '10px' }}>
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
