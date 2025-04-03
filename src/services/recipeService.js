import { v4 as uuidv4 } from 'uuid';
import { mockRecipes } from '../mockData/recipes';
import Papa from 'papaparse';

/**
 * Process recipe data to ensure all required fields are properly formatted
 * @param {Object} recipe Raw recipe data
 * @returns {Object} Processed recipe data
 */
const processRecipeData = (recipe) => {
  if (!recipe) return null;
  
  // Ensure recipe has an ID
  recipe.id = recipe.id || uuidv4();
  
  // Ensure recipe has an image
  if (!recipe.image && !recipe.image_url && recipe.name) {
    const imageName = recipe.name.replace(/\s+/g, '-').toLowerCase();
    recipe.image_url = `/src/assets/images/${imageName}.png`;
  }
  
  return {
    ...recipe,
    id: recipe.id || `recipe-${uuidv4()}`,
    name: recipe.name || recipe.title || 'Untitled Recipe',
    title: recipe.title || recipe.name || 'Untitled Recipe',
    description: recipe.description || 'A delicious recipe',
    image_url: recipe.image_url || recipe.image || '/src/assets/images/Vegetable Pasta.png',
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : 
                (recipe.ingredients ? recipe.ingredients.split(',').map(i => i.trim()) : []),
    steps: Array.isArray(recipe.steps) ? recipe.steps : 
          (recipe.steps ? recipe.steps.split(',').map(s => s.trim()) : []),
    required_cookware: Array.isArray(recipe.required_cookware) ? recipe.required_cookware : 
                      (recipe.required_cookware ? recipe.required_cookware.split(',').map(c => c.trim()) : []),
    cuisine: recipe.cuisine_type || recipe.cuisine || null
  };
};

// Load recipes from CSV file
const loadRecipesFromCSV = async () => {
  try {
    let csvData = null;
    
    // Try multiple possible paths for the CSV file
    const csvUrls = [
      '/recipes.csv',
      '/src/assets/csv/recipes_rows.csv',
      '/assets/csv/recipes_rows.csv'
    ];
    
    // Try each URL until we find one that works
    for (const url of csvUrls) {
      try {
        console.log(`Trying to fetch CSV from: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
          csvData = await response.text();
          console.log(`Successfully loaded CSV from: ${url}`);
          break;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${url}:`, err.message);
      }
    }
    
    if (!csvData) {
      console.error('Could not load CSV from any location');
      return null;
    }
    
    // Parse CSV data using Papa Parse
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(`Parsed ${results.data.length} recipes from CSV`);
          
          // Process each recipe to ensure it has the right format
          const processedRecipes = results.data.map(recipe => {
            try {
              // Parse JSON strings for arrays if they exist
              if (recipe.ingredients && typeof recipe.ingredients === 'string') {
                try {
                  recipe.ingredients = JSON.parse(recipe.ingredients);
                } catch (e) {
                  console.warn('Could not parse ingredients JSON:', e);
                  recipe.ingredients = recipe.ingredients.split(',');
                }
              }
              
              if (recipe.steps && typeof recipe.steps === 'string') {
                try {
                  recipe.steps = JSON.parse(recipe.steps);
                } catch (e) {
                  console.warn('Could not parse steps JSON:', e);
                  recipe.steps = recipe.steps.split(',');
                }
              }
              
              if (recipe.required_cookware && typeof recipe.required_cookware === 'string') {
                try {
                  recipe.required_cookware = JSON.parse(recipe.required_cookware);
                } catch (e) {
                  console.warn('Could not parse required_cookware JSON:', e);
                  recipe.required_cookware = recipe.required_cookware.split(',');
                }
              }
              
              // Ensure image_url exists
              if (!recipe.image_url && recipe.name) {
                const imageName = recipe.name.replace(/\s+/g, '-').toLowerCase();
                recipe.image_url = `/assets/images/${imageName}.png`;
              }
              
              return recipe;
            } catch (error) {
              console.error('Error processing recipe:', error, recipe);
              return recipe; // Return original recipe if processing fails
            }
          });
          
          resolve(processedRecipes);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in loadRecipesFromCSV:', error);
    return null;
  }
};

const recipeService = {
  getAllRecipes: async () => {
    try {
      // Try to load from CSV first
      const csvRecipes = await loadRecipesFromCSV();
      
      if (csvRecipes && csvRecipes.length > 0) {
        console.log(`Using ${csvRecipes.length} recipes from CSV`);
        return csvRecipes.map(recipe => processRecipeData(recipe));
      }
      
      // Fall back to mock data if CSV loading fails
      console.log('Falling back to mock recipes');
      return mockRecipes.map(recipe => processRecipeData(recipe));
    } catch (error) {
      console.error('Error in getAllRecipes:', error);
      return mockRecipes.map(recipe => processRecipeData(recipe));
    }
  },
  
  getRecipeById: async (id) => {
    try {
      const allRecipes = await recipeService.getAllRecipes();
      const recipe = allRecipes.find(recipe => recipe.id === id);
      return recipe ? processRecipeData(recipe) : null;
    } catch (error) {
      console.error('Error in getRecipeById:', error);
      return null;
    }
  },
  
  matchRecipes: async (ingredients, cookware) => {
    try {
      console.log('Matching recipes with ingredients and cookware');
      
      // If no ingredients or cookware, return all recipes
      if ((!ingredients || ingredients.length === 0) && 
          (!cookware || cookware.length === 0)) {
        console.log('No ingredients or cookware selected, returning all recipes');
        return await recipeService.getAllRecipes();
      }
      
      // Get all recipes first
      const allRecipes = await recipeService.getAllRecipes();
      
      // Filter recipes based on selected ingredients and assign match scores
      const scoredRecipes = allRecipes.map(recipe => {
        // If recipe has no ingredients array, give it a low base score
        if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
          return { ...recipe, score: 10, matchedIngredients: [], totalIngredients: 0 };
        }
        
        // Convert recipe ingredients to lowercase strings for matching
        const recipeIngredientTexts = recipe.ingredients.map(ing => 
          typeof ing === 'string' ? ing.toLowerCase() : ''
        );
        
        // Find matching ingredients
        const matchedIngredients = ingredients ? ingredients.filter(selectedIngredient => {
          const name = selectedIngredient.name.toLowerCase();
          return recipeIngredientTexts.some(text => text.includes(name));
        }) : [];
        
        // Calculate match score (percentage of recipe ingredients matched)
        const matchPercentage = ingredients && ingredients.length > 0 
          ? (matchedIngredients.length / ingredients.length) * 100 
          : 50; // Default score if no ingredients selected
        
        // Bonus for matching cookware
        let cookwareBonus = 0;
        if (recipe.required_cookware && Array.isArray(recipe.required_cookware) && cookware && cookware.length > 0) {
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
      
      // Sort by score (highest first)
      return scoredRecipes.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error in matchRecipes:', error);
      return mockRecipes.map(recipe => processRecipeData(recipe));
    }
  },
  
  searchRecipes: async (query) => {
    try {
      if (!query || query.trim() === '') {
        return await recipeService.getAllRecipes();
      }
      
      const allRecipes = await recipeService.getAllRecipes();
      const normalizedQuery = query.toLowerCase();
      
      const matchedRecipes = allRecipes.filter(recipe => {
        // Check if the query matches the recipe name, description, or ingredients
        const nameMatch = recipe.name && recipe.name.toLowerCase().includes(normalizedQuery);
        const titleMatch = recipe.title && recipe.title.toLowerCase().includes(normalizedQuery);
        const descMatch = recipe.description && recipe.description.toLowerCase().includes(normalizedQuery);
        
        // Check if any ingredient matches the query
        let ingredientMatch = false;
        if (recipe.ingredients && recipe.ingredients.length > 0) {
          ingredientMatch = recipe.ingredients.some(ing => {
            if (typeof ing === 'string') {
              return ing.toLowerCase().includes(normalizedQuery);
            } else if (ing && ing.name) {
              return ing.name.toLowerCase().includes(normalizedQuery);
            }
            return false;
          });
        }
        
        return nameMatch || titleMatch || descMatch || ingredientMatch;
      });
      
      return matchedRecipes.map(recipe => processRecipeData(recipe));
    } catch (error) {
      console.error('Error in searchRecipes:', error);
      return [];
    }
  }
};

export default recipeService;
