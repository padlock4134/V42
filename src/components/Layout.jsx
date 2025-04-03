import React from 'react';
import Header from './Header';

/**
 * Layout component provides a consistent structure for all pages
 * This ensures consistent spacing, padding, and alignment throughout the app
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-retro-cream">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;
