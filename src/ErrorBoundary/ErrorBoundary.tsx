import React, { ReactNode, useState, useEffect } from 'react';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
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
      <div className='p-3 text-center'>
        <h1 className={`${styles.heading}`}>Oops! Something went wrong.</h1>
        <p className={`${styles.message}`}>{error?.message || 'An unexpected error occurred.'}</p>
        <button className='mt-2 btn btn-primary' onClick={resetError}>
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
