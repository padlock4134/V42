import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import ChefTipOfTheDay from './ChefTipOfTheDay';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { 
    isDyslexicFont, 
    isHighContrast, 
    textSize,
    toggleDyslexicFont, 
    toggleHighContrast, 
    changeTextSize 
  } = useAccessibility();
  const [showMenu, setShowMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Kitchen', path: '/kitchen' },
    { name: 'Cookbook', path: '/cookbook' },
    { name: "Chef's Corner", path: '/chefs-corner' },
    { name: 'Marketplace', path: '/marketplace', badge: 'New!' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-retro-cream border-b-4 border-retro-red py-4 shadow-md">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="/src/assets/logo.png" 
              alt="PorkChop Logo" 
              className="h-12 w-12 mr-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/48';
              }}
            />
            <h1 className="font-retro text-2xl font-bold text-gray-800">PorkChop</h1>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="p-2 rounded-md text-gray-800 hover:bg-retro-mint focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-1 flex-1 mx-6 justify-center">
          {currentUser && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-2 rounded-retro text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-retro-yellow border-2 border-gray-800 font-bold' 
                  : 'hover:bg-retro-mint'
              }`}
            >
              {item.name}
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-retro-red text-white text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right side - User info and menu */}
        <div className="flex items-center">
          {/* Chef Tip of the Day */}
          {currentUser && (
            <div className="hidden md:block mr-4">
              <ChefTipOfTheDay />
            </div>
          )}
          
          {/* Accessibility Button */}
          <button 
            className="mr-4 p-2 hover:bg-retro-mint rounded-full"
            onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
            aria-label="Accessibility Options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Accessibility Menu Dropdown */}
          {showAccessibilityMenu && (
            <div className="absolute right-20 top-16 bg-white border-2 border-gray-800 rounded-retro shadow-retro p-4 z-50">
              <h3 className="font-bold mb-2 border-b-2 border-retro-yellow pb-1">Accessibility Options</h3>
              
              <div className="flex flex-col gap-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isDyslexicFont} 
                    onChange={toggleDyslexicFont}
                    className="mr-2 h-4 w-4"
                  />
                  <span>Dyslexic Font</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isHighContrast} 
                    onChange={toggleHighContrast}
                    className="mr-2 h-4 w-4"
                  />
                  <span>High Contrast</span>
                </label>
                
                <div className="mt-2">
                  <p className="mb-1">Text Size:</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => changeTextSize('small')}
                      className={`px-2 py-1 border rounded ${textSize === 'small' ? 'bg-retro-yellow border-gray-800' : 'border-gray-300'}`}
                    >
                      Small
                    </button>
                    <button 
                      onClick={() => changeTextSize('medium')}
                      className={`px-2 py-1 border rounded ${textSize === 'medium' ? 'bg-retro-yellow border-gray-800' : 'border-gray-300'}`}
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => changeTextSize('large')}
                      className={`px-2 py-1 border rounded ${textSize === 'large' ? 'bg-retro-yellow border-gray-800' : 'border-gray-300'}`}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Avatar and Menu */}
          {currentUser ? (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                <img 
                  src={currentUser.avatar || 'https://via.placeholder.com/40'} 
                  alt="User Avatar" 
                  className="h-10 w-10 rounded-full border-2 border-gray-800"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-800 rounded-retro shadow-retro z-50">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-retro-mint"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 hover:bg-retro-mint"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="retro-button">Sign In</Link>
              <Link to="/signup" className="retro-button bg-retro-blue">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileNav && currentUser && (
        <nav className="md:hidden mt-4 border-t-2 border-gray-300 pt-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-retro ${
                    location.pathname === item.path 
                      ? 'bg-retro-yellow border-2 border-gray-800 font-bold' 
                      : 'hover:bg-retro-mint'
                  }`}
                  onClick={() => setShowMobileNav(false)}
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 bg-retro-red text-white text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
