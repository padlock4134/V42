import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import Header from '../components/Header';
import ChefFreddie from '../components/ChefFreddie';

const Profile = () => {
  const { currentUser, chefLevel, chefTitle, updateProfile } = useAuth();
  const { isDyslexicFont, isHighContrast, textSize } = useAccessibility();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    dietaryPreferences: [],
    cuisinePreferences: [],
    cookingExperience: 'beginner'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || '',
        bio: currentUser.bio || '',
        dietaryPreferences: currentUser.dietaryPreferences || [],
        cuisinePreferences: currentUser.cuisinePreferences || [],
        cookingExperience: currentUser.cookingExperience || 'beginner'
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDietaryPreferenceChange = (preference) => {
    setFormData(prev => {
      const updatedPreferences = [...prev.dietaryPreferences];
      
      if (updatedPreferences.includes(preference)) {
        return {
          ...prev,
          dietaryPreferences: updatedPreferences.filter(p => p !== preference)
        };
      } else {
        return {
          ...prev,
          dietaryPreferences: [...updatedPreferences, preference]
        };
      }
    });
  };
  
  const handleCuisinePreferenceChange = (cuisine) => {
    setFormData(prev => {
      const updatedCuisines = [...prev.cuisinePreferences];
      
      if (updatedCuisines.includes(cuisine)) {
        return {
          ...prev,
          cuisinePreferences: updatedCuisines.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          cuisinePreferences: [...updatedCuisines, cuisine]
        };
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile in auth context
      updateProfile(formData);
      
      setIsEditing(false);
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'low-carb', label: 'Low-Carb' },
    { id: 'pescatarian', label: 'Pescatarian' }
  ];
  
  const cuisineOptions = [
    { id: 'italian', label: 'Italian' },
    { id: 'mexican', label: 'Mexican' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'japanese', label: 'Japanese' },
    { id: 'indian', label: 'Indian' },
    { id: 'thai', label: 'Thai' },
    { id: 'french', label: 'French' },
    { id: 'mediterranean', label: 'Mediterranean' },
    { id: 'american', label: 'American' },
    { id: 'middle-eastern', label: 'Middle Eastern' },
    { id: 'korean', label: 'Korean' },
    { id: 'spanish', label: 'Spanish' }
  ];
  
  return (
    <div className="min-h-screen bg-retro-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6">
          <h2 className="font-retro text-2xl mb-6 border-b-4 border-retro-yellow pb-2">
            My Profile
          </h2>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-retro border-2 ${
              message.type === 'success' 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : 'bg-red-100 border-red-500 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Avatar and Stats */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-gray-800 overflow-hidden mb-4">
                  <img 
                    src={currentUser?.avatar || 'https://via.placeholder.com/150'} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="bg-retro-yellow px-4 py-2 rounded-retro border-2 border-gray-800 text-center mb-4">
                  <h3 className="font-bold">{chefTitle}</h3>
                  <div className="flex justify-center items-center mt-1">
                    <span className="bg-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold border-2 border-gray-800">
                      {chefLevel}
                    </span>
                  </div>
                </div>
                
                <div className="bg-retro-mint rounded-retro border-2 border-gray-800 p-4 w-full">
                  <h3 className="font-bold mb-2 text-center">Cooking Stats</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Recipes Cooked:</span>
                      <span className="font-bold">24</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Recipes Saved:</span>
                      <span className="font-bold">42</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Recipes Shared:</span>
                      <span className="font-bold">7</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cooking Streak:</span>
                      <span className="font-bold">5 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Right Column - Profile Details */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-retro text-xl">Profile Details</h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="retro-button bg-retro-blue"
                  >
                    Edit Profile
                  </button>
                ) : null}
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="retro-input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="retro-input w-full"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="text"
                    value={formData.avatar}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="retro-input w-full"
                    placeholder="https://example.com/your-avatar.jpg"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="retro-input w-full"
                    placeholder="Tell us about yourself and your cooking journey..."
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cooking Experience
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['beginner', 'intermediate', 'advanced', 'professional'].map((level) => (
                      <label 
                        key={level} 
                        className={`flex items-center px-3 py-2 rounded-retro border-2 cursor-pointer ${
                          formData.cookingExperience === level 
                            ? 'bg-retro-yellow border-gray-800' 
                            : 'bg-white border-gray-300'
                        } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name="cookingExperience"
                          value={level}
                          checked={formData.cookingExperience === level}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="sr-only"
                        />
                        <span className="capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Preferences
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dietaryOptions.map((option) => (
                      <label 
                        key={option.id} 
                        className={`flex items-center px-3 py-2 rounded-retro border-2 cursor-pointer ${
                          formData.dietaryPreferences.includes(option.id) 
                            ? 'bg-retro-mint border-gray-800' 
                            : 'bg-white border-gray-300'
                        } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.dietaryPreferences.includes(option.id)}
                          onChange={() => isEditing && handleDietaryPreferenceChange(option.id)}
                          disabled={!isEditing}
                          className="sr-only"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Preferences
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {cuisineOptions.map((option) => (
                      <label 
                        key={option.id} 
                        className={`flex items-center px-3 py-2 rounded-retro border-2 cursor-pointer ${
                          formData.cuisinePreferences.includes(option.id) 
                            ? 'bg-retro-mint border-gray-800' 
                            : 'bg-white border-gray-300'
                        } ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.cuisinePreferences.includes(option.id)}
                          onChange={() => isEditing && handleCuisinePreferenceChange(option.id)}
                          disabled={!isEditing}
                          className="sr-only"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="retro-button bg-gray-200 hover:bg-gray-300"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="retro-button bg-retro-teal"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <ChefFreddie currentPage="profile" />
    </div>
  );
};

export default Profile;
