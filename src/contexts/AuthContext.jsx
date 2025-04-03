import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chefLevel, setChefLevel] = useState(1);
  const [chefTitle, setChefTitle] = useState('Apprentice Chef');

  useEffect(() => {
    // Check for existing user session
    const checkAuthStatus = () => {
      const user = localStorage.getItem('porkchop_user');
      if (user) {
        setCurrentUser(JSON.parse(user));
        
        // Get chef level from storage or default to 1
        const level = localStorage.getItem('porkchop_chef_level');
        setChefLevel(level ? parseInt(level) : 1);
        
        // Set chef title based on level
        setChefTitle(getChefTitle(level ? parseInt(level) : 1));
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Get chef title based on level (WoW-inspired ranking system)
  const getChefTitle = (level) => {
    const titles = {
      1: 'Apprentice Chef',
      5: 'Novice Chef',
      10: 'Journeyman Chef',
      15: 'Expert Chef',
      20: 'Artisan Chef',
      25: 'Master Chef',
      30: 'Grand Master Chef',
      35: 'Illustrious Chef',
      40: 'Zen Master Chef',
      45: 'Draenor Chef',
      50: 'Legion Chef'
    };
    
    // Find the highest title the user qualifies for
    const qualifyingLevels = Object.keys(titles)
      .map(Number)
      .filter(titleLevel => level >= titleLevel)
      .sort((a, b) => b - a);
    
    return titles[qualifyingLevels[0] || 1];
  };

  const login = async (email, password) => {
    try {
      // Check for super admin credentials
      if (email === 'Padlock4134' && password === '!Schlong') {
        // Super admin user
        const superAdminUser = {
          id: 'admin-1',
          name: 'Super Admin',
          email: 'admin@porkchop.app',
          avatar: 'https://via.placeholder.com/150?text=SA',
          recipesCooked: 999,
          recipesSaved: 999,
          bio: 'System administrator with full access to all features',
          dietaryPreferences: ['all'],
          cookingExperience: 'master',
          isAdmin: true,
          adminToken: 'super-secret-admin-token-' + Date.now()
        };
        
        localStorage.setItem('porkchop_token', 'admin-jwt-token');
        localStorage.setItem('porkchop_user', JSON.stringify(superAdminUser));
        localStorage.setItem('porkchop_chef_level', '50');
        localStorage.setItem('porkchop_admin', 'true');
        
        setCurrentUser(superAdminUser);
        setChefLevel(50);
        setChefTitle('Master Chef Administrator');
        
        return { success: true };
      }
      
      // Regular user login (accepts any credentials)
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful login
      const mockUser = {
        id: '123456',
        name: 'Test User',
        email: email,
        avatar: 'https://via.placeholder.com/150',
      };
      
      localStorage.setItem('porkchop_token', 'mock-jwt-token');
      localStorage.setItem('porkchop_user', JSON.stringify(mockUser));
      localStorage.setItem('porkchop_chef_level', '1');
      localStorage.removeItem('porkchop_admin');
      
      setCurrentUser(mockUser);
      setChefLevel(1);
      setChefTitle('Apprentice Chef');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful signup
      const mockUser = {
        id: '123456',
        name: name,
        email: email,
        avatar: 'https://via.placeholder.com/150',
      };
      
      localStorage.setItem('porkchop_token', 'mock-jwt-token');
      localStorage.setItem('porkchop_user', JSON.stringify(mockUser));
      localStorage.setItem('porkchop_chef_level', '1');
      
      setCurrentUser(mockUser);
      setChefLevel(1);
      setChefTitle('Apprentice Chef');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('porkchop_token');
    localStorage.removeItem('porkchop_user');
    localStorage.removeItem('porkchop_chef_level');
    localStorage.removeItem('porkchop_admin');
    setCurrentUser(null);
  };

  const updateChefLevel = (newLevel) => {
    setChefLevel(newLevel);
    setChefTitle(getChefTitle(newLevel));
    localStorage.setItem('porkchop_chef_level', newLevel.toString());
  };

  const updateProfile = async (profileData) => {
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful profile update
      const updatedUser = { ...currentUser, ...profileData };
      
      // Save updated user data to localStorage
      localStorage.setItem('porkchop_user', JSON.stringify(updatedUser));
      
      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    chefLevel,
    chefTitle,
    login,
    signup,
    logout,
    updateChefLevel,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
