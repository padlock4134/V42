import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return setError('Please enter both email/username and password');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to log in');
      }
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and App Name */}
        <div className="text-center mb-8">
          <img 
            src="/src/assets/logo.png" 
            alt="PorkChop Logo" 
            className="h-24 w-24 mx-auto mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/96';
            }}
          />
          <h1 className="font-retro text-4xl font-bold text-gray-800">PorkChop</h1>
          <p className="text-gray-600 mt-2">Your personal cooking assistant</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-retro shadow-retro border-4 border-gray-800 p-8">
          <h2 className="font-retro text-2xl mb-6 text-center">Welcome Back!</h2>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="retro-input w-full"
                placeholder="email@example.com or username"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="retro-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              className="retro-button w-full bg-retro-blue hover:bg-retro-teal text-white"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-retro-red hover:underline font-bold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Subscription Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>$15.99/month after your first month free</p>
          <p className="mt-2">No ads, no data selling, just great cooking</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
