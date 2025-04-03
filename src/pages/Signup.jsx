import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await signup(name, email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo and App Name */}
        <div className="text-center mb-8">
          <img 
            src="/src/assets/logo.svg" 
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
        
        {/* Signup Form */}
        <div className="bg-white rounded-retro shadow-retro border-4 border-gray-800 p-8">
          <h2 className="font-retro text-2xl mb-6 text-center">Create Your Account</h2>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="retro-input w-full"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="retro-input w-full"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
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
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-gray-700 font-bold mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="retro-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-retro-blue"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-retro-red hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-retro-red hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
            
            <button
              type="submit"
              className="retro-button w-full bg-retro-blue hover:bg-retro-teal text-white"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-retro-red hover:underline font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        {/* Subscription Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>$15.99/month after your first month free</p>
          <p className="mt-2">No ads, no data selling, just great cooking</p>
          <p className="mt-2">Cancel anytime</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
