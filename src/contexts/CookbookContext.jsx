import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CookbookContext = createContext();

export function useCookbook() {
  return useContext(CookbookContext);
}

export function CookbookProvider({ children }) {
  const { currentUser } = useAuth();
  const [collections, setCollections] = useState([
    { id: 'all', name: 'All Recipes', count: 0 },
    { id: 'favorites', name: 'Favorites', count: 0 }
  ]);
  const [recipes, setRecipes] = useState([]);
  const [recipeOfWeek, setRecipeOfWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Reference to track user changes
  const prevUser = useRef(currentUser);

  // Load cookbook data when component mounts or user changes
  useEffect(() => {
    console.log('Loading cookbook data on mount or user change');
    loadCookbookData();
    
    // Add event listener for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'porkchop_cookbook' && e.newValue) {
        try {
          const cookbookState = JSON.parse(e.newValue);
          console.log('Cookbook data changed in another tab, updating state:', cookbookState);
          
          if (cookbookState.recipes && Array.isArray(cookbookState.recipes)) {
            setRecipes(cookbookState.recipes);
          }
          
          if (cookbookState.collections && Array.isArray(cookbookState.collections)) {
            setCollections(cookbookState.collections);
          }
        } catch (error) {
          console.error('Error parsing cookbook data from storage event:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser]);

  // Function to load a recipe from CSV for Recipe of the Week
  const loadRecipeOfWeek = async () => {
    try {
      // Set Moules Marinières as the Recipe of the Week as requested
      const moulesMarinieresRecipe = {
        id: '0a64c676-a9d8-4c93-a6ac-b8509460b794',
        name: 'Moules Marinières',
        description: 'Simple yet elegant dish of mussels steamed in white wine with herbs, garlic, and shallots.',
        imageUrl: '/assets/images/Moules Marinières.png',
        prepTime: 15,
        cookTime: 20,
        difficulty: 'Medium',
        rating: 5,
        featured: true,
        ingredients: [
          '4 lbs fresh mussels, scrubbed and debearded', 
          '1/4 cup butter', 
          '4 shallots, finely chopped', 
          '4 cloves garlic, minced', 
          '1/4 cup fresh parsley, chopped, plus more for garnish', 
          '1 cup dry white wine', 
          '1/4 cup heavy cream (optional)', 
          '2 bay leaves', 
          '2 sprigs fresh thyme', 
          'freshly ground black pepper to taste', 
          'crusty baguette for serving'
        ],
        steps: [
          'Clean mussels thoroughly under cold running water, scrubbing off any debris and removing beards. Discard any mussels that are open and don\'t close when tapped',
          'In a large Dutch oven or pot with a lid, melt butter over medium heat',
          'Add shallots and cook until translucent, about 3 minutes',
          'Add garlic and cook for 1 minute until fragrant',
          'Add white wine, bay leaves, and thyme sprigs, bring to a simmer',
          'Add mussels to the pot and cover with the lid',
          'Steam for 5-7 minutes, shaking the pot occasionally, until most of the mussels have opened',
          'Remove from heat and discard any mussels that haven\'t opened',
          'If using cream, stir it in now',
          'Remove bay leaves and thyme sprigs',
          'Stir in fresh parsley and season with freshly ground black pepper',
          'Transfer mussels with their broth to serving bowls',
          'Garnish with additional parsley',
          'Serve immediately with crusty baguette for dipping in the flavorful broth'
        ]
      };
      
      // Set the recipe of the week
      setRecipeOfWeek(moulesMarinieresRecipe);
      
      // Save to local storage
      const now = new Date().getTime();
      localStorage.setItem('porkchop_recipe_of_week', JSON.stringify(moulesMarinieresRecipe));
      localStorage.setItem('porkchop_recipe_of_week_timestamp', now.toString());
      console.log('Saved Moules Marinières as Recipe of the Week to local storage');
      
      return true;
    } catch (error) {
      console.error('Error loading Recipe of the Week:', error);
      
      // Use a default recipe as fallback
      const fallbackRecipe = {
        id: 'recipe-weekly-fallback',
        name: 'Classic Beef Stroganoff',
        description: 'A creamy, comforting Russian dish featuring tender beef and mushrooms.',
        imageUrl: '/src/assets/images/Classic Beef Stroganoff.png',
        prepTime: 15,
        cookTime: 25,
        difficulty: 'Medium',
        rating: 5,
        featured: true
      };
      
      setRecipeOfWeek(fallbackRecipe);
      return false;
    }
  };

  // Load cookbook data from localStorage or initialize with mock data if none exists
  async function loadCookbookData() {
    setLoading(true);
    
    // Debug local storage
    console.log('DEBUG: Local Storage Contents:');
    console.log('porkchop_cookbook:', localStorage.getItem('porkchop_cookbook'));
    console.log('Current user:', currentUser?.email || 'No user logged in');
    
    try {
      // Load cookbook state from local storage - this should persist across logins
      const cookbookStateJson = localStorage.getItem('porkchop_cookbook');
      
      if (cookbookStateJson) {
        try {
          const cookbookState = JSON.parse(cookbookStateJson);
          console.log('Using stored cookbook state from local storage:', cookbookState);
          
          // Only set recipes if we have them in storage
          if (cookbookState.recipes && Array.isArray(cookbookState.recipes)) {
            setRecipes(cookbookState.recipes);
          }
          
          // Only set collections if we have them in storage
          if (cookbookState.collections && Array.isArray(cookbookState.collections)) {
            setCollections(cookbookState.collections);
          }
          
          // Mark as initialized to prevent overwriting with mock data
          setInitialized(true);
        } catch (error) {
          console.error('Error parsing cookbook state from localStorage:', error);
          initializeWithMockData();
        }
      } else {
        console.log('No stored cookbook state found, using mock data');
        initializeWithMockData();
      }
    } catch (error) {
      console.error('Error loading cookbook data:', error);
      initializeWithMockData();
    } finally {
      setLoading(false);
    }
    
    // Load Recipe of the Week from CSV
    await loadRecipeOfWeek();
  }
  
  // Function to initialize with mock data
  function initializeWithMockData() {
    console.log('Initializing with mock data');
    const mockRecipes = [
      {
        id: 'recipe-1',
        name: 'Classic Spaghetti Carbonara',
        description: 'A creamy Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
        imageUrl: '/src/assets/images/Classic Spaghetti Carbonara.png',
        prepTime: 10,
        cookTime: 15,
        difficulty: 'Easy',
        rating: 5,
        collections: ['favorites', 'weeknight'],
        lastCooked: '2025-03-28T18:30:00'
      },
      {
        id: 'recipe-2',
        name: 'Chicken Parmesan',
        description: 'Breaded chicken cutlets topped with tomato sauce and melted cheese.',
        imageUrl: '/src/assets/images/Chicken Parmesan.png',
        prepTime: 20,
        cookTime: 30,
        difficulty: 'Medium',
        rating: 4,
        collections: ['favorites', 'weeknight'],
        lastCooked: '2025-03-25T19:15:00'
      },
      {
        id: 'recipe-3',
        name: 'Vegetable Stir Fry',
        description: 'Quick and healthy stir-fried vegetables with a savory sauce.',
        imageUrl: '/src/assets/images/Vegetable Stir Fry.png',
        prepTime: 15,
        cookTime: 10,
        difficulty: 'Easy',
        rating: 4,
        collections: ['weeknight'],
        lastCooked: '2025-03-20T18:00:00'
      }
    ];
    
    const mockCollections = [
      { id: 'all', name: 'All Recipes', count: mockRecipes.length },
      { id: 'favorites', name: 'Favorites', count: mockRecipes.filter(r => r.collections.includes('favorites')).length },
      { id: 'weeknight', name: 'Weeknight Dinners', count: mockRecipes.filter(r => r.collections.includes('weeknight')).length }
    ];
    
    const mockRecipeOfWeek = {
      id: 'recipe-weekly-1',
      name: 'Classic Beef Stroganoff',
      description: 'A creamy, comforting Russian dish featuring tender beef and mushrooms.',
      imageUrl: '/src/assets/images/Classic Beef Stroganoff.png',
      prepTime: 15,
      cookTime: 25,
      difficulty: 'Medium',
      rating: 5,
      featured: true
    };
    
    // Set the mock data
    setRecipes(mockRecipes);
    setCollections(mockCollections);
    setRecipeOfWeek(mockRecipeOfWeek);
    
    // Save mock data to local storage so it persists
    const cookbookState = {
      recipes: mockRecipes,
      collections: mockCollections,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
    localStorage.setItem('porkchop_recipe_of_week', JSON.stringify(mockRecipeOfWeek));
    localStorage.setItem('porkchop_recipe_of_week_timestamp', new Date().getTime().toString());
    console.log('Saved initial mock data to local storage:', cookbookState);
    
    // Mark as initialized
    setInitialized(true);
  }

  // Add a recipe to the cookbook
  const addToCookbook = async (recipe) => {
    // Check if recipe already exists in cookbook
    const existingRecipe = recipes.find(r => r.id === recipe.id);
    
    if (existingRecipe) {
      // Recipe already exists in cookbook
      return { success: false, message: 'Recipe already in cookbook' };
    }
    
    // Format the recipe data
    const newRecipe = {
      id: recipe.id || `recipe-${Date.now()}`,
      name: recipe.name || recipe.title || 'Untitled Recipe',
      description: recipe.description || 'A delicious recipe',
      imageUrl: recipe.image_url || recipe.image || `/src/assets/images/${recipe.name || recipe.title || 'Vegetable Pasta'}.png`,
      prepTime: recipe.prep_time || recipe.prepTime || 15,
      cookTime: recipe.cook_time || recipe.cookTime || 30,
      difficulty: recipe.difficulty || 'Medium',
      rating: recipe.rating || 0,
      collections: ['all'],
      lastCooked: new Date().toISOString(),
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
      required_cookware: Array.isArray(recipe.required_cookware) ? recipe.required_cookware : []
    };
    
    console.log('Adding recipe to cookbook:', newRecipe);
    
    // Add to local state
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    
    // Update collection counts
    const updatedCollections = collections.map(collection => 
      collection.id === 'all' 
        ? { ...collection, count: collection.count + 1 } 
        : collection
    );
    setCollections(updatedCollections);
    
    // Save to local storage
    try {
      // Save the complete cookbook state
      const cookbookState = {
        recipes: updatedRecipes,
        collections: updatedCollections,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
      console.log('Saved cookbook state to local storage:', cookbookState);
    } catch (error) {
      console.error('Error saving recipe to cookbook:', error);
      return { success: false, message: 'Error saving to local storage' };
    }
    
    return { success: true, message: 'Recipe added to cookbook' };
  };

  // Create a new collection
  const createCollection = async (name) => {
    if (!name.trim()) {
      return { success: false, message: 'Collection name cannot be empty' };
    }
    
    // Check if collection with same name already exists
    if (collections.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, message: 'Collection with this name already exists' };
    }
    
    const newCollection = {
      id: `collection-${Date.now()}`,
      name: name.trim(),
      count: 0
    };
    
    // Add to local state
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    
    // Save to local storage
    try {
      // Save the complete cookbook state
      const cookbookState = {
        recipes: recipes,
        collections: updatedCollections,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
      console.log('Saved cookbook state to local storage after creating collection:', cookbookState);
    } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, message: 'Error saving to local storage' };
    }
    
    return { success: true, message: 'Collection created', collectionId: newCollection.id };
  };

  // Toggle a recipe in a collection
  const toggleRecipeInCollection = async (recipeId, collectionId) => {
    // Find the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
      console.error('Recipe not found:', recipeId);
      return { success: false, message: 'Recipe not found' };
    }
    
    const isInCollection = recipe?.collections?.includes(collectionId);
    
    // Update recipes
    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        if (isInCollection) {
          // Remove from collection
          return {
            ...recipe,
            collections: recipe.collections.filter(id => id !== collectionId)
          };
        } else {
          // Add to collection
          return {
            ...recipe,
            collections: [...recipe.collections, collectionId]
          };
        }
      }
      return recipe;
    });
    
    // Update collection counts
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        const count = isInCollection
          ? collection.count - 1
          : collection.count + 1;
        return { ...collection, count: Math.max(0, count) };
      }
      return collection;
    });
    
    // Update state
    setRecipes(updatedRecipes);
    setCollections(updatedCollections);
    
    // Save to local storage
    try {
      // Save the complete cookbook state
      const cookbookState = {
        recipes: updatedRecipes,
        collections: updatedCollections,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
      console.log('Saved cookbook state to local storage after toggling recipe in collection:', cookbookState);
      
      return {
        success: true,
        message: isInCollection
          ? 'Recipe removed from collection'
          : 'Recipe added to collection'
      };
    } catch (error) {
      console.error('Error toggling recipe in collection:', error);
      return { success: false, message: 'Error saving to local storage' };
    }
  };

  // Update a recipe's rating
  const updateRating = async (recipeId, rating) => {
    // Find the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
      console.error('Recipe not found:', recipeId);
      return { success: false, message: 'Recipe not found' };
    }
    
    // Update recipes
    const updatedRecipes = recipes.map(r => 
      r.id === recipeId ? { ...r, rating } : r
    );
    
    // Update state
    setRecipes(updatedRecipes);
    
    // Save to local storage
    try {
      // Save the complete cookbook state
      const cookbookState = {
        recipes: updatedRecipes,
        collections,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
      console.log('Saved cookbook state to local storage after rating update:', cookbookState);
      
      return { success: true, message: 'Rating updated' };
    } catch (error) {
      console.error('Error updating recipe rating:', error);
      return { success: false, message: 'Error saving to local storage' };
    }
  };

  // Remove a recipe from the cookbook
  const removeFromCookbook = async (recipeId) => {
    // Find the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
      console.error('Recipe not found:', recipeId);
      return { success: false, message: 'Recipe not found' };
    }
    
    // Get collections the recipe is in
    const recipeCollections = recipe.collections || [];
    
    // Remove recipe from recipes
    const updatedRecipes = recipes.filter(r => r.id !== recipeId);
    
    // Update collection counts
    const updatedCollections = collections.map(collection => {
      if (recipeCollections.includes(collection.id)) {
        return {
          ...collection,
          count: Math.max(0, collection.count - 1)
        };
      }
      return collection;
    });
    
    // Update state
    setRecipes(updatedRecipes);
    setCollections(updatedCollections);
    
    // Save to local storage
    try {
      // Save the complete cookbook state
      const cookbookState = {
        recipes: updatedRecipes,
        collections: updatedCollections,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
      console.log('Saved cookbook state to local storage after removing recipe:', cookbookState);
      
      return { success: true, message: 'Recipe removed from cookbook' };
    } catch (error) {
      console.error('Error removing recipe from cookbook:', error);
      return { success: false, message: 'Error saving to local storage' };
    }
  };

  // Remove a collection
  const removeCollection = async (collectionId) => {
    // Cannot remove default collections
    if (collectionId === 'all' || collectionId === 'favorites') {
      return { success: false, message: 'Cannot remove default collections' };
    }
    
    // Find the collection
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) {
      console.error('Collection not found:', collectionId);
      return { success: false, message: 'Collection not found' };
    }
    
    // Remove collection from collections
    const updatedCollections = collections.filter(c => c.id !== collectionId);
    
    // Remove collection from recipes
    const updatedRecipes = recipes.map(recipe => {
      if (recipe.collections.includes(collectionId)) {
        return {
          ...recipe,
          collections: recipe.collections.filter(id => id !== collectionId)
        };
      }
      return recipe;
    });
    
    // Update state
    setCollections(updatedCollections);
    setRecipes(updatedRecipes);
    
    // Save to local storage
    try {
      // Save the complete cookbook state
      const cookbookState = {
        recipes: updatedRecipes,
        collections: updatedCollections,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('porkchop_cookbook', JSON.stringify(cookbookState));
      console.log('Saved cookbook state to local storage after removing collection:', cookbookState);
      
      return { success: true, message: 'Collection removed' };
    } catch (error) {
      console.error('Error removing collection:', error);
      return { success: false, message: 'Error saving to local storage' };
    }
  };

  // Update recipe of the week
  const updateRecipeOfWeek = () => {
    // Get all recipes with rating of 4 or higher
    const highlyRatedRecipes = recipes.filter(recipe => recipe.rating >= 4);
    
    if (highlyRatedRecipes.length > 0) {
      // Get the current week number (1-52)
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekNumber = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
      
      // Use the week number to select a recipe (rotating through the highly rated recipes)
      const selectedIndex = weekNumber % highlyRatedRecipes.length;
      setRecipeOfWeek(highlyRatedRecipes[selectedIndex]);
      
      return { success: true };
    } else {
      // If no highly rated recipes, use the first recipe or keep the current one
      if (recipes.length > 0 && !recipeOfWeek) {
        setRecipeOfWeek(recipes[0]);
      }
      return { success: false, message: 'No highly rated recipes found' };
    }
  };

  // Update recipe of the week whenever recipes change
  useEffect(() => {
    if (!loading && recipes.length > 0 && initialized) {
      updateRecipeOfWeek();
    }
  }, [recipes, loading, initialized]);

  const value = {
    collections,
    recipes,
    recipeOfWeek,
    loading,
    addToCookbook,
    createCollection,
    toggleRecipeInCollection,
    updateRating,
    removeFromCookbook,
    removeCollection,
    updateRecipeOfWeek
  };

  return (
    <CookbookContext.Provider value={value}>
      {children}
    </CookbookContext.Provider>
  );
}
