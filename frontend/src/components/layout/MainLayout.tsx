import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex grow">
        <Sidebar />
        <main className="grow bg-light">
          <div className="container-fluid py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;