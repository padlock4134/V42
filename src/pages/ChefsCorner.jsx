import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ChefFreddie from '../components/ChefFreddie';

const ChefsCorner = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('community');
  const [communityPosts, setCommunityPosts] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [featuredChef, setFeaturedChef] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [borrowForm, setBorrowForm] = useState({
    ingredient: '',
    quantity: 1,
    unit: 'item',
    message: '',
    userId: ''
  });

  // Load data
  useEffect(() => {
    // This would be replaced with actual API calls
    // For now, we'll use mock data
    
    // Mock community posts
    const mockPosts = [
      {
        id: 'post-1',
        user: {
          id: 'user-1',
          name: 'Sarah Johnson',
          avatar: 'https://via.placeholder.com/40',
          chefLevel: 15,
          chefTitle: 'Expert Chef'
        },
        title: 'My Grandmother\'s Secret Pasta Sauce',
        content: 'After years of begging, my grandmother finally shared her secret pasta sauce recipe with me. The key is to simmer for at least 4 hours!',
        image: 'https://via.placeholder.com/400x300',
        likes: 24,
        comments: 8,
        createdAt: '2025-03-30T14:22:00'
      },
      {
        id: 'post-2',
        user: {
          id: 'user-2',
          name: 'Michael Chen',
          avatar: 'https://via.placeholder.com/40',
          chefLevel: 28,
          chefTitle: 'Master Chef'
        },
        title: 'Perfect Crispy Tofu Technique',
        content: 'I\'ve been experimenting with different methods for getting tofu super crispy without deep frying. Here\'s what worked best for me...',
        image: 'https://via.placeholder.com/400x300',
        likes: 42,
        comments: 15,
        createdAt: '2025-03-29T09:15:00'
      },
      {
        id: 'post-3',
        user: {
          id: 'user-3',
          name: 'Emma Wilson',
          avatar: 'https://via.placeholder.com/40',
          chefLevel: 8,
          chefTitle: 'Novice Chef'
        },
        title: 'First Time Making Sourdough!',
        content: 'After months of procrastinating, I finally made my first sourdough loaf! It\'s not perfect, but I\'m proud of it. Any tips for next time?',
        image: 'https://via.placeholder.com/400x300',
        likes: 37,
        comments: 22,
        createdAt: '2025-03-28T16:45:00'
      }
    ];
    
    // Mock tutorials
    const mockTutorials = [
      {
        id: 'tutorial-1',
        title: 'Knife Skills 101',
        description: 'Learn the basics of knife handling, chopping, dicing, and julienne cuts.',
        author: 'Chef Michael Chen',
        duration: '15 min',
        difficulty: 'Beginner',
        thumbnail: 'https://via.placeholder.com/300x200',
        views: 1245
      },
      {
        id: 'tutorial-2',
        title: 'Perfect French Omelette',
        description: 'Master the technique for a classic, creamy French omelette.',
        author: 'Chef Julia Reynolds',
        duration: '8 min',
        difficulty: 'Intermediate',
        thumbnail: 'https://via.placeholder.com/300x200',
        views: 876
      },
      {
        id: 'tutorial-3',
        title: 'Homemade Pasta from Scratch',
        description: 'Learn to make fresh pasta dough and shape it into various forms.',
        author: 'Chef Antonio Rossi',
        duration: '22 min',
        difficulty: 'Intermediate',
        thumbnail: 'https://via.placeholder.com/300x200',
        views: 2103
      }
    ];
    
    // Mock borrow requests
    const mockBorrowRequests = [
      {
        id: 'borrow-1',
        user: {
          id: 'user-4',
          name: 'David Thompson',
          avatar: 'https://via.placeholder.com/40',
          distance: '0.5 miles'
        },
        ingredient: 'Fresh Rosemary',
        quantity: 2,
        unit: 'sprigs',
        message: 'Making a roast chicken and forgot to buy rosemary. Can anyone help?',
        status: 'pending',
        createdAt: '2025-03-31T18:30:00'
      },
      {
        id: 'borrow-2',
        user: {
          id: 'user-5',
          name: 'Lisa Garcia',
          avatar: 'https://via.placeholder.com/40',
          distance: '0.8 miles'
        },
        ingredient: 'Vanilla Extract',
        quantity: 1,
        unit: 'tablespoon',
        message: 'Baking cookies and ran out. Will return the favor!',
        status: 'fulfilled',
        fulfilledBy: {
          id: 'user-1',
          name: 'Sarah Johnson'
        },
        createdAt: '2025-03-31T15:45:00'
      }
    ];
    
    // Mock featured chef
    const mockFeaturedChef = {
      id: 'chef-1',
      name: 'Robert Martinez',
      avatar: 'https://via.placeholder.com/100',
      bio: 'Home cook specializing in Mexican cuisine with a modern twist. Passionate about sharing family recipes and teaching others.',
      chefLevel: 32,
      chefTitle: 'Master Chef',
      specialties: ['Mexican', 'Fusion', 'Salsas'],
      featuredRecipe: {
        title: 'Mole Poblano with Chocolate',
        image: 'https://via.placeholder.com/400x300',
        description: 'A rich, complex sauce with over 20 ingredients including chocolate and chilies.'
      }
    };
    
    // Mock nearby users
    const mockNearbyUsers = [
      {
        id: 'user-6',
        name: 'Jennifer Kim',
        avatar: 'https://via.placeholder.com/40',
        distance: '0.3 miles',
        chefLevel: 12
      },
      {
        id: 'user-7',
        name: 'Carlos Rodriguez',
        avatar: 'https://via.placeholder.com/40',
        distance: '0.7 miles',
        chefLevel: 24
      },
      {
        id: 'user-8',
        name: 'Aisha Patel',
        avatar: 'https://via.placeholder.com/40',
        distance: '1.2 miles',
        chefLevel: 18
      }
    ];
    
    setCommunityPosts(mockPosts);
    setTutorials(mockTutorials);
    setBorrowRequests(mockBorrowRequests);
    setFeaturedChef(mockFeaturedChef);
    setNearbyUsers(mockNearbyUsers);
  }, []);

  const handleBorrowSubmit = (e) => {
    e.preventDefault();
    
    if (!borrowForm.ingredient.trim() || !borrowForm.userId) {
      return;
    }
    
    // This would be replaced with an actual API call
    // For now, we'll simulate adding a new request
    const newRequest = {
      id: `borrow-${Date.now()}`,
      user: currentUser,
      ingredient: borrowForm.ingredient,
      quantity: borrowForm.quantity,
      unit: borrowForm.unit,
      message: borrowForm.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setBorrowRequests([newRequest, ...borrowRequests]);
    
    // Reset form
    setBorrowForm({
      ingredient: '',
      quantity: 1,
      unit: 'item',
      message: '',
      userId: ''
    });
  };

  return (
    <Layout>
      <div className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6">
        <h2 className="font-retro text-2xl mb-6 border-b-4 border-retro-yellow pb-2">
          Chef's Corner
        </h2>
        
        {/* Featured Chef */}
        {featuredChef && (
          <section className="mb-8">
            <div className="bg-retro-mint rounded-retro p-6 border-2 border-gray-800">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="mb-4 md:mb-0 md:mr-6 text-center">
                  <img 
                    src={featuredChef.avatar} 
                    alt={featuredChef.name} 
                    className="h-24 w-24 rounded-full border-4 border-white shadow-md mx-auto"
                  />
                  <h3 className="font-retro text-lg mt-2">{featuredChef.name}</h3>
                  <div className="text-sm mt-1">
                    <span className="font-bold">{featuredChef.chefTitle}</span>
                    <span className="ml-2 bg-white rounded-full h-6 w-6 inline-flex items-center justify-center text-xs font-bold border-2 border-gray-800">
                      {featuredChef.chefLevel}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-retro text-xl mb-2">Featured Chef of the Day</h3>
                  <p className="mb-3">{featuredChef.bio}</p>
                  
                  <div className="mb-3">
                    <span className="font-bold mr-2">Specialties:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {featuredChef.specialties.map((specialty, index) => (
                        <span 
                          key={index} 
                          className="bg-white px-2 py-1 rounded-full text-xs border border-gray-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-md p-3 border-2 border-gray-800">
                    <h4 className="font-bold">Featured Recipe: {featuredChef.featuredRecipe.title}</h4>
                    <div className="flex flex-col sm:flex-row mt-2">
                      <img 
                        src={featuredChef.featuredRecipe.image} 
                        alt={featuredChef.featuredRecipe.title} 
                        className="w-full sm:w-32 h-24 object-cover rounded-md mb-2 sm:mb-0 sm:mr-3"
                      />
                      <p className="text-sm">{featuredChef.featuredRecipe.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'community' ? 'text-retro-red border-b-2 border-retro-red' : 'text-gray-500'}`}
            onClick={() => setActiveTab('community')}
          >
            Community Posts
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'tutorials' ? 'text-retro-red border-b-2 border-retro-red' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tutorials')}
          >
            Tutorials
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'borrow' ? 'text-retro-red border-b-2 border-retro-red' : 'text-gray-500'}`}
            onClick={() => setActiveTab('borrow')}
          >
            Borrow from Neighbor
          </button>
        </div>
        
        {/* Community Posts Tab */}
        {activeTab === 'community' && (
          <div>
            <div className="mb-6">
              <button className="retro-button">
                Share Your Cooking Experience
              </button>
            </div>
            
            <div className="space-y-6">
              {communityPosts.map(post => (
                <div key={post.id} className="bg-white border-2 border-gray-800 rounded-retro shadow-retro p-4">
                  <div className="flex items-center mb-4">
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name} 
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-bold">{post.user.name}</h4>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{post.user.chefTitle}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-retro text-lg mb-2">{post.title}</h3>
                  <p className="mb-4">{post.content}</p>
                  
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-64 object-cover rounded-md mb-4"
                    />
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <button className="flex items-center text-gray-600 hover:text-retro-red">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes} Likes
                    </button>
                    
                    <button className="flex items-center text-gray-600 hover:text-retro-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments} Comments
                    </button>
                    
                    <button className="flex items-center text-gray-600 hover:text-retro-teal">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <div>
            <div className="mb-6">
              <button className="retro-button">
                Create a Tutorial
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tutorials.map(tutorial => (
                <div key={tutorial.id} className="bg-white border-2 border-gray-800 rounded-retro shadow-retro overflow-hidden">
                  <div className="relative">
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-retro text-lg mb-1">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{tutorial.author}</p>
                        <p className="text-xs text-gray-500">{tutorial.views} views</p>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tutorial.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : tutorial.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                    
                    <button className="retro-button w-full mt-4 text-sm">
                      Watch Tutorial
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Borrow from Neighbor Tab */}
        {activeTab === 'borrow' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Borrow Request Form */}
            <div className="md:col-span-2">
              <h3 className="font-retro text-xl mb-4">Borrow an Ingredient</h3>
              
              <form onSubmit={handleBorrowSubmit} className="bg-retro-cream rounded-retro p-4 border-2 border-gray-800 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="ingredient" className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredient Needed
                    </label>
                    <input
                      id="ingredient"
                      type="text"
                      value={borrowForm.ingredient}
                      onChange={(e) => setBorrowForm({...borrowForm, ingredient: e.target.value})}
                      className="retro-input w-full"
                      placeholder="e.g. Fresh Basil"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={borrowForm.quantity}
                        onChange={(e) => setBorrowForm({...borrowForm, quantity: e.target.value})}
                        className="retro-input w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <select
                        id="unit"
                        value={borrowForm.unit}
                        onChange={(e) => setBorrowForm({...borrowForm, unit: e.target.value})}
                        className="retro-input w-full"
                      >
                        <option value="item">Item</option>
                        <option value="g">Grams</option>
                        <option value="cup">Cup</option>
                        <option value="tbsp">Tablespoon</option>
                        <option value="tsp">Teaspoon</option>
                        <option value="sprig">Sprig</option>
                        <option value="clove">Clove</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={borrowForm.message}
                    onChange={(e) => setBorrowForm({...borrowForm, message: e.target.value})}
                    className="retro-input w-full"
                    rows="3"
                    placeholder="Briefly explain what you're cooking and when you need it"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="neighbor" className="block text-sm font-medium text-gray-700 mb-1">
                    Ask Specific Neighbor (Optional)
                  </label>
                  <select
                    id="neighbor"
                    value={borrowForm.userId}
                    onChange={(e) => setBorrowForm({...borrowForm, userId: e.target.value})}
                    className="retro-input w-full"
                  >
                    <option value="">Anyone nearby</option>
                    {nearbyUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.distance})
                      </option>
                    ))}
                  </select>
                </div>
                
                <button type="submit" className="retro-button w-full">
                  Submit Request
                </button>
              </form>
              
              <h3 className="font-retro text-xl mb-4">Recent Requests</h3>
              
              <div className="space-y-4">
                {borrowRequests.map(request => (
                  <div key={request.id} className="bg-white border-2 border-gray-800 rounded-retro p-4 shadow-retro">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <img 
                          src={request.user.avatar} 
                          alt={request.user.name} 
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-bold">{request.user.name}</h4>
                          <p className="text-xs text-gray-500">{request.user.distance} away • {new Date(request.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                          : request.status === 'fulfilled'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {request.status === 'pending' ? 'Pending' : request.status === 'fulfilled' ? 'Fulfilled' : 'Cancelled'}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="font-medium">
                        Needs: {request.quantity} {request.unit} of {request.ingredient}
                      </p>
                      {request.message && (
                        <p className="text-sm mt-1">{request.message}</p>
                      )}
                    </div>
                    
                    {request.status === 'fulfilled' && (
                      <div className="mt-2 text-sm text-gray-600">
                        Fulfilled by {request.fulfilledBy.name}
                      </div>
                    )}
                    
                    {request.status === 'pending' && (
                      <div className="mt-3">
                        <button className="retro-button text-sm">
                          I Can Help
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Nearby Neighbors */}
            <div>
              <h3 className="font-retro text-xl mb-4">Nearby Neighbors</h3>
              
              <div className="bg-retro-cream rounded-retro p-4 border-2 border-gray-800">
                <div className="space-y-4">
                  {nearbyUsers.map(user => (
                    <div key={user.id} className="flex items-center p-2 hover:bg-white rounded-md transition-colors">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-xs text-gray-500">{user.distance} away</p>
                      </div>
                      <div className="bg-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border border-gray-800">
                        {user.chefLevel}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <button className="retro-button w-full text-sm">
                    View All Neighbors
                  </button>
                </div>
              </div>
              
              <div className="mt-6 bg-retro-yellow rounded-retro p-4 border-2 border-gray-800">
                <h4 className="font-retro text-lg mb-2">Borrowing Etiquette</h4>
                <ul className="text-sm space-y-2">
                  <li>• Always return what you borrow or replace it</li>
                  <li>• Be specific about what you need</li>
                  <li>• Say thank you and pay it forward</li>
                  <li>• Keep requests reasonable (small amounts)</li>
                  <li>• Meet in public or common areas</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ChefFreddie 
        currentPage="chefs-corner" 
        contextData={{
          activeTab,
          communityPosts,
          tutorials,
          borrowRequests,
          featuredChef,
          nearbyUsers,
          postCount: communityPosts.length,
          tutorialCount: tutorials.length
        }} 
      />
    </Layout>
  );
};

export default ChefsCorner;
