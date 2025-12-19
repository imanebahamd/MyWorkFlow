import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | undefined;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  size, 
  message = 'Loading...' 
}) => {
  if (fullScreen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <Spinner animation="border" role="status" size={size}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        {message && <p className="mt-3 text-muted">{message}</p>}
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center p-4">
      <Spinner animation="border" role="status" size={size}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {message && <span className="ms-2">{message}</span>}
    </div>
  );
};

export default Loader;