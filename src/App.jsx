import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Kitchen from './pages/Kitchen'
import Cookbook from './pages/Cookbook'
import ChefsCorner from './pages/ChefsCorner'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import { KitchenProvider } from './contexts/KitchenContext'
import { ChefFreddieProvider } from './contexts/ChefFreddieContext'
import { CookbookProvider } from './contexts/CookbookContext'

function AppRoutes() {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;

  return (
    <div className="app-container min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/kitchen" element={isAuthenticated ? <Kitchen /> : <Navigate to="/login" />} />
        <Route path="/cookbook" element={isAuthenticated ? <Cookbook /> : <Navigate to="/login" />} />
        <Route path="/chefs-corner" element={isAuthenticated ? <ChefsCorner /> : <Navigate to="/login" />} />
        <Route path="/marketplace" element={isAuthenticated ? <Marketplace /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <ChefFreddieProvider>
          <KitchenProvider>
            <CookbookProvider>
              <AppRoutes />
            </CookbookProvider>
          </KitchenProvider>
        </ChefFreddieProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App
