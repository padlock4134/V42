import { useState, useEffect } from 'react';
import { useCookbook } from '../contexts/CookbookContext';
import Layout from '../components/Layout';
import ChefFreddie from '../components/ChefFreddie';

const Cookbook = () => {
  const { 
    collections, 
    recipes, 
    recipeOfWeek, 
    loading,
    createCollection,
    toggleRecipeInCollection,
    updateRating,
    removeFromCookbook,
    removeCollection
  } = useCookbook();
  
  const [activeCollection, setActiveCollection] = useState('all');
  const [newCollection, setNewCollection] = useState('');
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [recipeForNewCollection, setRecipeForNewCollection] = useState(null);

  // Filter recipes by active collection
  const filteredRecipes = activeCollection === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.collections.includes(activeCollection));
  
  // Open recipe modal
  const openRecipeModal = (recipe) => {
    // Ensure we have all the necessary recipe data
    const fullRecipe = {
      ...recipe,
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      required_cookware: recipe.required_cookware || recipe.requiredCookware || []
    };
    
    setSelectedRecipe(fullRecipe);
    setShowRecipeModal(true);
    setModalFlipped(false);
  };
  
  // Close recipe modal
  const closeRecipeModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };
  
  // Toggle modal flip
  const toggleModalFlip = () => {
    setModalFlipped(!modalFlipped);
  };
  
  // Handle new collection submission
  const handleNewCollectionSubmit = (e) => {
    e.preventDefault();
    if (newCollection.trim()) {
      createCollection(newCollection);
      setNewCollection('');
      setShowNewCollectionForm(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-retro text-4xl mb-8 text-center">My Cookbook</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-retro-cream rounded-retro p-6 shadow-retro mb-6">
              <h2 className="font-retro text-2xl mb-4">Collections</h2>
              
              <ul className="space-y-2 mb-4">
                {collections.map(collection => (
                  <li key={collection.id} className="flex justify-between items-center">
                    <button
                      onClick={() => setActiveCollection(collection.id)}
                      className={`text-left py-2 px-4 rounded-retro w-full ${
                        activeCollection === collection.id ? 'bg-retro-blue text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {collection.name} ({collection.count})
                    </button>
                    
                    {/* Delete button for non-default collections */}
                    {collection.id !== 'all' && collection.id !== 'favorites' && (
                      <button 
                        onClick={() => removeCollection(collection.id)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                        title="Delete collection"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              
              {showNewCollectionForm ? (
                <form onSubmit={handleNewCollectionSubmit} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={newCollection}
                      onChange={(e) => setNewCollection(e.target.value)}
                      className="retro-input flex-grow mr-2"
                      placeholder="Collection name"
                    />
                    <button 
                      type="submit" 
                      className="retro-button-sm bg-retro-green text-white"
                    >
                      Add
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewCollectionForm(true)}
                  className="retro-button w-full mb-4"
                >
                  + New Collection
                </button>
              )}
              
              <div className="mb-4">
                <h3 className="font-retro text-lg mb-2">Search Recipes</h3>
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="retro-input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ChefFreddie message="Need cooking help? Ask me anything!" />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-retro-blue mx-auto mb-4"></div>
                <p className="text-xl">Loading your delicious recipes...</p>
              </div>
            ) : (
              <>
                {/* Recipe of the Week */}
                {recipeOfWeek && (
                  <section className="mb-8">
                    <h2 className="font-retro text-2xl mb-4">Recipe of the Week</h2>
                    <div className="bg-white border-2 border-gray-800 rounded-retro shadow-retro overflow-hidden">
                      <div className="flex flex-row">
                        <div className="relative w-1/3">
                          <img 
                            src={recipeOfWeek.imageUrl} 
                            alt={recipeOfWeek.name} 
                            className="w-full h-[150px] object-cover"
                            onError={(e) => {
                              if (!e.target.src.includes('placeholder')) {
                                // Try to find a matching image in the assets folder
                                const imageName = recipeOfWeek.name.replace(/\s+/g, '%20');
                                e.target.src = `/src/assets/images/${imageName}.png`;
                                
                                // Add a second error handler to use a local fallback image if the local image also fails
                                e.target.onerror = () => {
                                  e.target.src = `/src/assets/images/Vegetable Pasta.png`;
                                  e.target.onerror = null; // Prevent infinite loop
                                };
                              }
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <div className="bg-retro-red text-white font-bold py-1 px-3 rounded-full text-sm">
                              Featured
                            </div>
                          </div>
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-retro text-xl mb-1">{recipeOfWeek.name}</h3>
                          <p className="mb-2 text-gray-700 text-sm line-clamp-2">{recipeOfWeek.description}</p>
                          <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg 
                                  key={star}
                                  className={`h-4 w-4 ${star <= recipeOfWeek.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{recipeOfWeek.rating}/5</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="bg-retro-blue bg-opacity-20 text-retro-blue px-2 py-0.5 rounded-full text-xs">
                              {recipeOfWeek.difficulty || 'Medium'}
                            </span>
                            <span className="bg-retro-green bg-opacity-20 text-retro-green px-2 py-0.5 rounded-full text-xs">
                              {recipeOfWeek.prepTime || '15'} min
                            </span>
                          </div>
                          <button 
                            onClick={() => openRecipeModal(recipeOfWeek)}
                            className="retro-button-sm bg-retro-blue text-white"
                          >
                            View Recipe
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
                
                {/* Recipe Grid */}
                <h2 className="font-retro text-2xl mb-4">{activeCollection === 'all' ? 'All Recipes' : collections.find(c => c.id === activeCollection)?.name}</h2>
                
                {filteredRecipes.length === 0 ? (
                  <div className="text-center py-12 bg-retro-cream rounded-retro p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="font-retro text-xl mb-2">No Recipes in This Collection</h3>
                    <p className="text-gray-600 mb-4">Save recipes to your cookbook to see them here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRecipes.map(recipe => (
                      <div key={recipe.id} className="bg-white border-2 border-gray-800 rounded-retro shadow-retro overflow-hidden">
                        <div className="relative h-48">
                          <img 
                            src={recipe.imageUrl} 
                            alt={recipe.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              if (!e.target.src.includes('placeholder')) {
                                // Try to find a matching image in the assets folder
                                const imageName = recipe.name.replace(/\s+/g, '%20');
                                e.target.src = `/src/assets/images/${imageName}.png`;
                                
                                // Add a second error handler to use a local fallback image if the local image also fails
                                e.target.onerror = () => {
                                  e.target.src = `/src/assets/images/Vegetable Pasta.png`;
                                  e.target.onerror = null; // Prevent infinite loop
                                };
                              }
                            }}
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button 
                              onClick={() => toggleRecipeInCollection(recipe.id, 'favorites')}
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                recipe.collections.includes('favorites')
                                  ? 'bg-retro-red text-white'
                                  : 'bg-white text-gray-500'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={recipe.collections.includes('favorites') ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => removeFromCookbook(recipe.id)}
                              className="h-8 w-8 rounded-full bg-white text-gray-500 flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-retro text-xl mb-2">{recipe.name}</h3>
                          <p className="text-gray-700 mb-4 line-clamp-2">{recipe.description}</p>
                          
                          <div className="flex items-center mb-4">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star}
                                  onClick={() => updateRating(recipe.id, star)}
                                  className={`h-5 w-5 ${star <= recipe.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{recipe.rating}/5</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              Last cooked: {new Date(recipe.lastCooked).toLocaleDateString()}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openRecipeModal(recipe)}
                                className="retro-button text-xs py-1 px-2"
                              >
                                View
                              </button>
                              <button className="retro-button bg-retro-blue text-white text-xs py-1 px-2">
                                Cook
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Recipe Detail Modal */}
        {showRecipeModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-retro shadow-retro border-2 border-gray-800 w-full max-w-5xl max-h-[95vh] h-[90vh] recipe-modal ${modalFlipped ? 'flipped' : ''}`}>
              <div className="recipe-modal-inner h-full">
                {/* Front of modal */}
                <div className="recipe-modal-front p-8 h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="font-retro text-3xl">{selectedRecipe.name}</h2>
                    <div className="flex space-x-3">
                      <button 
                        onClick={toggleModalFlip}
                        className="retro-button-sm bg-retro-blue hover:bg-blue-600 text-lg px-4 py-2"
                      >
                        Flip for Instructions
                      </button>
                      <button 
                        onClick={closeRecipeModal}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100%-80px)] overflow-auto">
                    <div>
                      <div className="rounded-retro overflow-hidden h-80 mb-6">
                        <img 
                          src={selectedRecipe.imageUrl} 
                          alt={selectedRecipe.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (!e.target.src.includes('placeholder')) {
                              // Try to find a matching image in the assets folder
                              const imageName = selectedRecipe.name.replace(/\s+/g, '%20');
                              e.target.src = `/src/assets/images/${imageName}.png`;
                              
                              // Add a second error handler to use a local fallback image if the local image also fails
                              e.target.onerror = () => {
                                e.target.src = `/src/assets/images/Vegetable Pasta.png`;
                                e.target.onerror = null; // Prevent infinite loop
                              };
                            }
                          }}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-retro text-2xl mb-3">Description</h3>
                        <p className="text-lg">{selectedRecipe.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-lg mb-6">
                        <div>
                          <span className="font-medium">Prep Time:</span> {selectedRecipe.prepTime} mins
                        </div>
                        <div>
                          <span className="font-medium">Cook Time:</span> {selectedRecipe.cookTime} mins
                        </div>
                        <div>
                          <span className="font-medium">Servings:</span> {selectedRecipe.servings || '4'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-6">
                        <h3 className="font-retro text-2xl mb-3">Ingredients</h3>
                        <ul className="list-disc pl-6 space-y-2 text-lg">
                          {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                            selectedRecipe.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ))
                          ) : (
                            <li>No ingredients listed</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-retro text-2xl mb-3">Required Cookware</h3>
                        <ul className="list-disc pl-6 space-y-2 text-lg">
                          {selectedRecipe.required_cookware && selectedRecipe.required_cookware.length > 0 ? (
                            selectedRecipe.required_cookware.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))
                          ) : (
                            <li>No specific cookware required</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <div className="flex-grow mr-4">
                          <div className="relative">
                            <select 
                              className="retro-input w-full py-3 pl-3 pr-10 text-lg"
                              onChange={(e) => {
                                if (e.target.value) {
                                  if (e.target.value === '__new__') {
                                    // Show new collection modal
                                    setRecipeForNewCollection(selectedRecipe);
                                    setShowNewCollectionModal(true);
                                  } else {
                                    toggleRecipeInCollection(selectedRecipe.id, e.target.value);
                                  }
                                  e.target.value = ''; // Reset after selection
                                }
                              }}
                              value=""
                            >
                              <option value="" disabled>Add to collection...</option>
                              {collections
                                .filter(c => c.id !== 'all' && !selectedRecipe.collections.includes(c.id))
                                .map(collection => (
                                  <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                  </option>
                                ))}
                              <option value="__new__">+ Create new collection</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleRecipeInCollection(selectedRecipe.id, 'favorites')}
                          className={`retro-button ${
                            selectedRecipe.collections.includes('favorites')
                              ? 'bg-retro-red text-white'
                              : 'bg-retro-yellow'
                          } text-lg px-6 py-3 mr-4`}
                        >
                          {selectedRecipe.collections.includes('favorites') ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <button className="retro-button bg-retro-blue text-white text-lg px-6 py-3">
                          Cook Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Back of modal */}
                <div className="recipe-modal-back p-8 h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="font-retro text-3xl">Instructions</h2>
                    <div className="flex space-x-3">
                      <button 
                        onClick={toggleModalFlip}
                        className="retro-button-sm bg-retro-blue hover:bg-blue-600 text-lg px-4 py-2"
                      >
                        Back to Recipe
                      </button>
                      <button 
                        onClick={closeRecipeModal}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-[calc(100%-80px)] overflow-auto">
                    <ol className="list-decimal pl-6 space-y-6 text-lg">
                      {selectedRecipe.steps && selectedRecipe.steps.length > 0 ? (
                        selectedRecipe.steps.map((step, index) => (
                          <li key={index} className="pb-4 border-b border-gray-200">
                            {typeof step === 'string' ? step : step.description}
                          </li>
                        ))
                      ) : (
                        <li>No instructions available for this recipe.</li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* New Collection Modal */}
        {showNewCollectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-retro shadow-retro border-2 border-gray-800 w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-retro text-2xl">Create New Collection</h2>
                <button 
                  onClick={() => {
                    setShowNewCollectionModal(false);
                    setNewCollectionName('');
                    setRecipeForNewCollection(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor="newCollectionName" className="block text-gray-700 text-sm font-bold mb-2">
                  Collection Name
                </label>
                <input
                  id="newCollectionName"
                  type="text"
                  className="retro-input w-full p-2"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Enter collection name..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (newCollectionName.trim()) {
                      // Create the collection
                      createCollection(newCollectionName).then(result => {
                        if (result.success && recipeForNewCollection) {
                          // Add the recipe to the new collection
                          const newCollectionId = `collection-${Date.now()}`;
                          toggleRecipeInCollection(recipeForNewCollection.id, newCollectionId);
                        }
                      });
                      
                      // Close the modal
                      setShowNewCollectionModal(false);
                      setNewCollectionName('');
                      setRecipeForNewCollection(null);
                    }
                  }}
                  className="retro-button bg-retro-green text-white"
                  disabled={!newCollectionName.trim()}
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cookbook;
