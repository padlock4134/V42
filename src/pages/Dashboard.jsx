import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ChefFreddie from '../components/ChefFreddie';
import { useAuth } from '../contexts/AuthContext';
import { useChefFreddie } from '../contexts/ChefFreddieContext';

const Dashboard = () => {
  const { currentUser, chefLevel, chefTitle } = useAuth();
  const chefFreddieContext = useChefFreddie() || {};
  const { dailyTip = 'Always taste your food as you cook to adjust seasonings.', chefQuote = { 
    chef: 'Chef Freddie', 
    quote: 'Cooking is like love. It should be entered into with abandon or not at all.'
  }} = chefFreddieContext;
  
  // Stats for tracking
  const [stats, setStats] = useState({
    recipesCreated: 0,
    recipesCooked: 0,
    favoriteCuisine: 'Italian',
    chefPoints: 450,
    nextLevel: 1000,
    achievements: [
      { id: 1, name: 'First Recipe', icon: '🍳', achieved: true },
      { id: 2, name: 'Kitchen Master', icon: '👨‍🍳', achieved: false },
      { id: 3, name: 'Cuisine Explorer', icon: '🌍', achieved: true },
      { id: 4, name: 'Ingredient Wizard', icon: '🧙', achieved: false },
    ]
  });

  // Fetch user stats
  useEffect(() => {
    // Simulating API call to get user stats
    const fetchStats = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setStats({
          recipesCreated: 12,
          recipesCooked: 8,
          favoriteCuisine: 'Italian',
          chefPoints: 450,
          nextLevel: 1000,
          achievements: [
            { id: 1, name: 'First Recipe', icon: '🍳', achieved: true },
            { id: 2, name: 'Kitchen Master', icon: '👨‍🍳', achieved: false },
            { id: 3, name: 'Cuisine Explorer', icon: '🌍', achieved: true },
            { id: 4, name: 'Ingredient Wizard', icon: '🧙', achieved: false },
          ]
        });
      }, 500);
    };

    fetchStats();
  }, []);

  // Safely access user data
  const userName = currentUser?.name || 'Chef';
  const userLevel = chefLevel || 1;
  const userTitle = chefTitle || 'Apprentice Chef';
  const isAdmin = currentUser?.isAdmin || false;
  const tip = dailyTip;

  return (
    <Layout>
      {/* Welcome Section with Stats */}
      <section className="mb-8">
        <div className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-2">
            <h2 className="font-retro text-2xl">
              Welcome back, {userName}!
            </h2>
            <div className="mt-2 md:mt-0 text-right">
              <p className="italic text-gray-700">"{chefQuote.quote}"</p>
              <p className="text-sm font-bold text-retro-red">— {chefQuote.chef}</p>
            </div>
          </div>
          
          <div className="border-b-4 border-retro-yellow mb-4"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <p className="mb-2">Your current chef level: <span className="font-bold">{userLevel}</span></p>
              <p className="mb-2">Your title: <span className="font-bold text-retro-red">{userTitle}</span></p>
              {isAdmin && (
                <p className="mb-2 bg-black text-white px-2 py-1 rounded-md inline-block">
                  <span className="font-bold">🔑 ADMIN ACCESS</span>
                </p>
              )}
              <div className="w-full md:w-64 h-4 bg-gray-200 rounded-full mt-2 mb-4">
                <div 
                  className="h-4 bg-retro-teal rounded-full" 
                  style={{ width: `${(stats.chefPoints / stats.nextLevel) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{stats.chefPoints} / {stats.nextLevel} points to next level</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-retro-cream p-4 rounded-md border border-gray-300">
              <h3 className="font-retro text-lg mb-2">Your Stats</h3>
              <div className="flex justify-between mb-2">
                <span>Recipes Created:</span>
                <span className="font-bold">{stats.recipesCreated}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Recipes Cooked:</span>
                <span className="font-bold">{stats.recipesCooked}</span>
              </div>
              <div className="flex justify-between">
                <span>Favorite Cuisine:</span>
                <span className="font-bold">{stats.favoriteCuisine}</span>
              </div>
            </div>
            
            <div className="bg-retro-cream p-4 rounded-md border border-gray-300">
              <h3 className="font-retro text-lg mb-2">Achievements</h3>
              <div className="grid grid-cols-2 gap-2">
                {stats.achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`p-2 rounded-md text-center ${achievement.achieved ? 'bg-retro-teal text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    <div className="text-xl">{achievement.icon}</div>
                    <div className="text-xs">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-retro-cream p-4 rounded-md border border-gray-300">
              <h3 className="font-retro text-lg mb-2">Recent Activity</h3>
              <ul className="text-sm">
                <li className="mb-1 pb-1 border-b border-gray-200">Added Spaghetti Carbonara to favorites</li>
                <li className="mb-1 pb-1 border-b border-gray-200">Completed Knife Skills lesson</li>
                <li className="mb-1 pb-1 border-b border-gray-200">Cooked Chicken Parmesan</li>
                <li>Created a new recipe: Garlic Butter Shrimp</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Modules Grid */}
      <section className="mb-8">
        <h2 className="font-retro text-2xl mb-4">Kitchen Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What's In My Kitchen */}
          <Link to="/kitchen" className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6 hover:bg-retro-mint transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-retro-teal rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">🍳</span>
              </div>
              <h3 className="font-retro text-xl">What's In My Kitchen</h3>
            </div>
            <p className="text-gray-700 mb-4">Scan or enter ingredients and find matching recipes.</p>
            <div className="flex justify-end">
              <span className="text-sm font-medium text-retro-red">Open →</span>
            </div>
          </Link>
          
          {/* My Cookbook */}
          <Link to="/cookbook" className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6 hover:bg-retro-mint transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-retro-red rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="font-retro text-xl">My Cookbook</h3>
            </div>
            <p className="text-gray-700 mb-4">Browse, save, and create recipes for your personal cookbook.</p>
            <div className="flex justify-end">
              <span className="text-sm font-medium text-retro-red">Open →</span>
            </div>
          </Link>
          
          {/* Chef's Corner */}
          <Link to="/chefs-corner" className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6 hover:bg-retro-mint transition-colors relative overflow-hidden">
            <div className="absolute -right-12 top-6 bg-retro-red text-white py-1 px-12 transform rotate-45 text-sm font-bold">
              Coming Soon!
            </div>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-retro-yellow rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="font-retro text-xl">Chef's Corner</h3>
            </div>
            <p className="text-gray-700 mb-4">Learn from professional chefs with tutorials and cooking classes.</p>
            <div className="flex justify-end">
              <span className="text-sm font-medium text-retro-red">Open →</span>
            </div>
          </Link>
          
          {/* The Grange Marketplace */}
          <Link to="/marketplace" className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6 hover:bg-retro-mint transition-colors relative overflow-hidden">
            <div className="absolute -right-12 top-6 bg-retro-red text-white py-1 px-12 transform rotate-45 text-sm font-bold">
              Coming Soon!
            </div>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-retro-orange rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="font-retro text-xl">The Grange Marketplace</h3>
            </div>
            <p className="text-gray-700 mb-4">Shop from local butchers, fish markets, farm stands, and small markets.</p>
            <div className="flex justify-end">
              <span className="text-sm font-medium text-retro-red">Open →</span>
            </div>
          </Link>
        </div>
      </section>
      
      {/* Chef Freddie */}
      <section className="mb-8">
        <ChefFreddie currentPage="dashboard" />
      </section>
    </Layout>
  );
};

export default Dashboard;
