import { createContext, useState, useContext, useEffect } from 'react';

const KitchenContext = createContext();

export const useKitchen = () => useContext(KitchenContext);

const KitchenProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState(() => {
    const savedIngredients = localStorage.getItem('kitchen-ingredients');
    return savedIngredients ? JSON.parse(savedIngredients) : [];
  });

  const [cookware, setCookware] = useState(() => {
    const savedCookware = localStorage.getItem('kitchen-cookware');
    return savedCookware ? JSON.parse(savedCookware) : [];
  });

  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(3); // Show 3 recipes per page
  
  // Get current recipes for pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = matchedRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(matchedRecipes.length / recipesPerPage);

  // Save ingredients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kitchen-ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  // Save cookware to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kitchen-cookware', JSON.stringify(cookware));
  }, [cookware]);

  // Add an ingredient to the kitchen
  const addIngredient = (ingredient) => {
    // Create a unique ID if one doesn't exist
    const ingredientItem = {
      ...ingredient,
      id: ingredient.id || `${ingredient.category || 'custom'}-${ingredient.type || 'generic'}-${Date.now()}`
    };
    
    // Store the three-level tagging information if available
    if (ingredient.category) {
      ingredientItem.ingredient_category = ingredient.category;
    }
    
    if (ingredient.type) {
      ingredientItem.ingredient_type = ingredient.type;
    }
    
    if (ingredient.cut) {
      ingredientItem.ingredient_cut = ingredient.cut;
    }
    
    // Check if a similar ingredient already exists (by name)
    const existingIngredientIndex = ingredients.findIndex(item => 
      item.name.toLowerCase() === ingredientItem.name.toLowerCase()
    );
    
    if (existingIngredientIndex >= 0) {
      // Update the quantity of the existing ingredient
      const updatedIngredients = [...ingredients];
      updatedIngredients[existingIngredientIndex].quantity += ingredientItem.quantity || 1;
      setIngredients(updatedIngredients);
    } else {
      // Add as a new ingredient
      setIngredients([...ingredients, ingredientItem]);
    }
  };

  // Remove an ingredient from the kitchen
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Update an existing ingredient
  const updateIngredient = (updatedIngredient) => {
    setIngredients(ingredients.map(item => 
      item.id === updatedIngredient.id ? updatedIngredient : item
    ));
  };

  // Add cookware to the kitchen
  const addCookware = (item) => {
    // Create a unique ID if one doesn't exist
    const cookwareItem = {
      ...item,
      id: item.id || `${item.category || 'custom'}-${item.type || 'generic'}-${Date.now()}`
    };
    
    // Store the three-level tagging information
    if (item.category) {
      cookwareItem.cookware_category = item.category;
    }
    
    if (item.type) {
      cookwareItem.cookware_type = item.type;
    }
    
    if (item.variety) {
      cookwareItem.cookware_variety = item.variety;
    }
    
    if (!cookware.some(c => c.id === cookwareItem.id)) {
      setCookware([...cookware, cookwareItem]);
    }
  };

  // Remove cookware from the kitchen
  const removeCookware = (index) => {
    setCookware(cookware.filter((_, i) => i !== index));
  };

  // Find recipes that match the current ingredients and cookware
  const findMatchingRecipes = async () => {
    try {
      setIsLoading(true);
      console.log('Finding matching recipes...');

      // Try to use the recipe service first
      try {
        const { default: recipeService } = await import('../services/recipeService');
        
        // If no ingredients or cookware are selected, get all recipes
        if ((!ingredients || ingredients.length === 0) && 
            (!cookware || cookware.length === 0)) {
          console.log('No ingredients or cookware selected, getting all recipes');
          const allRecipes = await recipeService.getAllRecipes();
          
          if (allRecipes && allRecipes.length > 0) {
            console.log(`Found ${allRecipes.length} recipes from service`);
            
            // Take exactly 50 recipes or all recipes if less than 50
            const recipesToShow = allRecipes.slice(0, Math.min(50, allRecipes.length));
            console.log(`Showing ${recipesToShow.length} recipes for pagination`);
            
            setMatchedRecipes(recipesToShow);
            setIsLoading(false);
            return;
          }
        } else {
          // Match recipes based on selected ingredients and cookware
          const matchedRecipes = await recipeService.matchRecipes(ingredients, cookware);
          
          if (matchedRecipes && matchedRecipes.length > 0) {
            console.log(`Found ${matchedRecipes.length} matching recipes from service`);
            setMatchedRecipes(matchedRecipes);
            setIsLoading(false);
            return;
          }
        }
      } catch (serviceError) {
        console.error('Error using recipe service:', serviceError);
      }

      // If recipe service fails, fall back to mock data
      const { mockRecipes } = await import('../mockData/recipes');
      console.log('Using mock recipes only:', mockRecipes.length);
      
      // Process recipes to ensure they have proper image paths
      const processedRecipes = mockRecipes.map(recipe => {
        // Ensure recipe has an image
        if (!recipe.image && !recipe.image_url && recipe.name) {
          const imageName = recipe.name.replace(/\s+/g, '-').toLowerCase();
          recipe.image_url = `/src/assets/images/${imageName}.png`;
        }
        
        return {
          ...recipe,
          image_url: recipe.image_url || recipe.image || '/src/assets/images/Vegetable Pasta.png'
        };
      });
      
      // If no ingredients or cookware are selected, show up to 50 randomized recipes
      if ((!ingredients || ingredients.length === 0) && 
          (!cookware || cookware.length === 0)) {
        console.log('No ingredients or cookware selected, showing randomized recipes');
        
        // Create a copy of the array to avoid mutating the original
        const shuffledRecipes = [...processedRecipes];
        
        // Fisher-Yates shuffle algorithm to randomize recipes
        for (let i = shuffledRecipes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledRecipes[i], shuffledRecipes[j]] = [shuffledRecipes[j], shuffledRecipes[i]];
        }
        
        // Take exactly 50 recipes or all recipes if less than 50
        const recipesToShow = shuffledRecipes.slice(0, Math.min(50, shuffledRecipes.length));
        console.log(`Showing ${recipesToShow.length} randomized recipes for pagination`);
        setMatchedRecipes(recipesToShow);
        setIsLoading(false);
        return;
      }
      
      // Filter recipes based on selected ingredients and assign match scores
      const scoredRecipes = processedRecipes.map(recipe => {
        // If recipe has no ingredients array, give it a low base score
        if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
          return { ...recipe, score: 10, matchedIngredients: [], totalIngredients: 0 };
        }
        
        // Convert recipe ingredients to lowercase strings for matching
        const recipeIngredientTexts = recipe.ingredients.map(ing => 
          typeof ing === 'string' ? ing.toLowerCase() : ''
        );
        
        // Find matching ingredients
        const matchedIngredients = ingredients.filter(selectedIngredient => {
          const name = selectedIngredient.name.toLowerCase();
          return recipeIngredientTexts.some(text => text.includes(name));
        });
        
        // Calculate match score (percentage of recipe ingredients matched)
        const matchPercentage = ingredients.length > 0 
          ? (matchedIngredients.length / ingredients.length) * 100 
          : 50; // Default score if no ingredients selected
        
        // Bonus for matching cookware
        let cookwareBonus = 0;
        if (recipe.required_cookware && Array.isArray(recipe.required_cookware) && cookware.length > 0) {
          const recipeCookwareTexts = recipe.required_cookware.map(item => 
            typeof item === 'string' ? item.toLowerCase() : ''
          );
          
          const matchedCookware = cookware.filter(selectedCookware => {
            const name = selectedCookware.name.toLowerCase();
            return recipeCookwareTexts.some(text => text.includes(name));
          });
          
          cookwareBonus = (matchedCookware.length / cookware.length) * 20; // Up to 20% bonus
        }
        
        return { 
          ...recipe, 
          score: matchPercentage + cookwareBonus,
          matchedIngredients,
          totalIngredients: recipe.ingredients.length
        };
      });
      
      // Sort by score (highest first) and take up to 50 recipes
      const sortedRecipes = scoredRecipes
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.max(10, Math.min(50, scoredRecipes.length)));
      
      console.log(`Found ${sortedRecipes.length} matching recipes`);
      setMatchedRecipes(sortedRecipes);
      setIsLoading(false);
    } catch (error) {
      console.error('Error finding matching recipes:', error);
      
      // Final fallback - if everything fails, at least show some recipes
      try {
        const { mockRecipes } = await import('../mockData/recipes');
        console.log('Emergency fallback to mock recipes');
        setMatchedRecipes(mockRecipes.slice(0, 6)); // Just show first 6 recipes
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        setMatchedRecipes([]);
      }
      
      setIsLoading(false);
    }
  };

  // Clear all ingredients from the kitchen
  const clearIngredients = () => {
    setIngredients([]);
  };

  // Clear all cookware from the kitchen
  const clearCookware = () => {
    setCookware([]);
  };

  const value = {
    ingredients,
    cookware,
    matchedRecipes,
    currentRecipes,
    isLoading,
    currentPage,
    totalPages,
    recipesPerPage,
    paginate,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addCookware,
    removeCookware,
    findMatchingRecipes,
    clearIngredients,
    clearCookware
  };

  return (
    <KitchenContext.Provider value={value}>
      {children}
    </KitchenContext.Provider>
  );
};

export { KitchenProvider };
export default KitchenContext;
