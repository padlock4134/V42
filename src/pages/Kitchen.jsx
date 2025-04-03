import { useState, useRef } from 'react';
import { useKitchen } from '../contexts/KitchenContext';
import { useCookbook } from '../contexts/CookbookContext';
import Layout from '../components/Layout';
import ChefFreddie from '../components/ChefFreddie';
import Webcam from 'react-webcam';
import { useEffect } from 'react';

// CSS for the flipping card effect
const cardStyles = `
  .recipe-card {
    perspective: 1000px;
    height: 450px;
    width: 100%;
    margin-bottom: 20px;
    position: relative;
  }
  
  .recipe-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  
  .recipe-card.flipped .recipe-card-inner {
    transform: rotateY(180deg);
  }
  
  .recipe-card-front, .recipe-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
  }
  
  .recipe-card-front {
    background: white;
  }
  
  .recipe-card-back {
    background: #f8f4e5;
    transform: rotateY(180deg);
  }

  /* Modal flip styles */
  .recipe-modal {
    perspective: 1000px;
  }
  
  .recipe-modal-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  
  .recipe-modal.flipped .recipe-modal-inner {
    transform: rotateY(180deg);
  }
  
  .recipe-modal-front, .recipe-modal-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 0.5rem;
    overflow-y: auto;
    max-height: 80vh;
  }
  
  .recipe-modal-front {
    background: white;
  }
  
  .recipe-modal-back {
    background: #f8f4e5;
    transform: rotateY(180deg);
  }
`;

const Kitchen = () => {
  const { 
    ingredients, 
    cookware, 
    matchedRecipes, 
    currentRecipes,
    currentPage,
    totalPages,
    paginate,
    addIngredient, 
    removeIngredient, 
    addCookware, 
    removeCookware,
    clearIngredients,
    clearCookware,
    isLoading: loading,
    findMatchingRecipes
  } = useKitchen();
  
  const { 
    addToCookbook, 
    collections, 
    createCollection, 
    toggleRecipeInCollection 
  } = useCookbook();
  
  const [activeTab, setActiveTab] = useState('ingredients');
  const [showCamera, setShowCamera] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: '',
    type: '',
    cut: '',
    quantity: 1,
    unit: 'item'
  });
  
  // Ingredient selector state
  const [selectorLevel, setSelectorLevel] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [newCookware, setNewCookware] = useState({
    name: '',
    type: '',
    quantity: 1,
    unit: 'item'
  });
  
  const [cookwareSelectorLevel, setCookwareSelectorLevel] = useState('category');
  const [selectedCookwareCategory, setSelectedCookwareCategory] = useState('');
  const [selectedCookwareType, setSelectedCookwareType] = useState('');
  
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);
  
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [recipeToAdd, setRecipeToAdd] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  
  const webcamRef = useRef(null);
  
  // Ingredient data structure with three-level tagging
  const ingredientData = {
    categories: [
      { id: 'protein', name: 'Protein', icon: '🥩', color: 'bg-retro-red' },
      { id: 'veggies', name: 'Vegetables', icon: '🥦', color: 'bg-retro-green' },
      { id: 'pantry', name: 'Pantry', icon: '🧂', color: 'bg-retro-yellow' },
      { id: 'dairy', name: 'Dairy', icon: '🧀', color: 'bg-retro-blue' },
      { id: 'fruit', name: 'Fruit', icon: '🍎', color: 'bg-retro-purple' }
    ],
    types: {
      protein: [
        { id: 'beef', name: 'Beef', icon: '🥩' },
        { id: 'chicken', name: 'Chicken', icon: '🍗' },
        { id: 'pork', name: 'Pork', icon: '🥓' },
        { id: 'fish', name: 'Fish', icon: '🐟' },
        { id: 'seafood', name: 'Seafood', icon: '🦐' },
        { id: 'other', name: 'Other', icon: '🥚' }
      ],
      veggies: [
        { id: 'leafy', name: 'Leafy Greens', icon: '🥬' },
        { id: 'root', name: 'Root Vegetables', icon: '🥕' },
        { id: 'squash', name: 'Squash', icon: '🎃' },
        { id: 'peppers', name: 'Peppers', icon: '🌶️' },
        { id: 'allium', name: 'Allium', icon: '🧅' },
        { id: 'other', name: 'Other', icon: '🥦' }
      ],
      pantry: [
        { id: 'grains', name: 'Grains', icon: '🌾' },
        { id: 'pasta', name: 'Pasta', icon: '🍝' },
        { id: 'beans', name: 'Beans', icon: '🫘' },
        { id: 'nuts', name: 'Nuts', icon: '🥜' },
        { id: 'spices', name: 'Spices', icon: '🌶️' },
        { id: 'sauces', name: 'Sauces', icon: '🍯' }
      ],
      dairy: [
        { id: 'milk', name: 'Milk', icon: '🥛' },
        { id: 'cheese', name: 'Cheese', icon: '🧀' },
        { id: 'yogurt', name: 'Yogurt', icon: '🥄' },
        { id: 'butter', name: 'Butter', icon: '🧈' },
        { id: 'cream', name: 'Cream', icon: '🍦' },
        { id: 'eggs', name: 'Eggs', icon: '🥚' }
      ],
      fruit: {
        citrus: [
          { id: 'lemon', name: 'Lemon', icon: '🍋' },
          { id: 'lime', name: 'Lime', icon: '🍋' },
          { id: 'orange', name: 'Orange', icon: '🍊' }
        ],
        tropical: [
          { id: 'pineapple', name: 'Pineapple', icon: '🍍' },
          { id: 'mango', name: 'Mango', icon: '🥭' },
          { id: 'banana', name: 'Banana', icon: '🍌' }
        ],
        berries: [
          { id: 'strawberry', name: 'Strawberry', icon: '🍓' },
          { id: 'blueberry', name: 'Blueberry', icon: '🫐' },
          { id: 'raspberry', name: 'Raspberry', icon: '🍓' }
        ]
      }
    },
    cuts: {
      beef: [
        { id: 'ground', name: 'Ground', icon: '🥩' },
        { id: 'steak', name: 'Steak', icon: '🥩' },
        { id: 'roast', name: 'Roast', icon: '🥩' },
        { id: 'ribs', name: 'Ribs', icon: '🥩' },
        { id: 'brisket', name: 'Brisket', icon: '🥩' },
        { id: 'other', name: 'Other', icon: '🥩' }
      ],
      chicken: [
        { id: 'breast', name: 'Breast', icon: '🍗' },
        { id: 'thigh', name: 'Thigh', icon: '🍗' },
        { id: 'drumstick', name: 'Drumstick', icon: '🍗' },
        { id: 'wing', name: 'Wing', icon: '🍗' },
        { id: 'whole', name: 'Whole', icon: '🍗' },
        { id: 'ground', name: 'Ground', icon: '🍗' }
      ],
      pork: [
        { id: 'chop', name: 'Chop', icon: '🥓' },
        { id: 'ground', name: 'Ground', icon: '🥓' },
        { id: 'loin', name: 'Loin', icon: '🥓' },
        { id: 'shoulder', name: 'Shoulder', icon: '🥓' },
        { id: 'belly', name: 'Belly', icon: '🥓' },
        { id: 'ribs', name: 'Ribs', icon: '🥓' }
      ],
      fish: [
        { id: 'fillet', name: 'Fillet', icon: '🐟' },
        { id: 'steak', name: 'Steak', icon: '🐟' },
        { id: 'whole', name: 'Whole', icon: '🐟' },
        { id: 'smoked', name: 'Smoked', icon: '🐟' },
        { id: 'canned', name: 'Canned', icon: '🐟' },
        { id: 'ground', name: 'Ground', icon: '🐟' }
      ],
      seafood: [
        { id: 'shrimp', name: 'Shrimp', icon: '🦐' },
        { id: 'crab', name: 'Crab', icon: '🦀' },
        { id: 'lobster', name: 'Lobster', icon: '🦞' },
        { id: 'scallop', name: 'Scallop', icon: '🦪' },
        { id: 'mussel', name: 'Mussel', icon: '🦪' },
        { id: 'clam', name: 'Clam', icon: '🦪' }
      ],
      other: [
        { id: 'tofu', name: 'Tofu', icon: '🧊' },
        { id: 'tempeh', name: 'Tempeh', icon: '🧊' },
        { id: 'seitan', name: 'Seitan', icon: '🧊' },
        { id: 'tvp', name: 'TVP', icon: '🧊' },
        { id: 'beans', name: 'Beans', icon: '🥫' },
        { id: 'lentils', name: 'Lentils', icon: '🥫' }
      ],
      leafy: [
        { id: 'spinach', name: 'Spinach', icon: '🥬' },
        { id: 'kale', name: 'Kale', icon: '🥬' },
        { id: 'lettuce', name: 'Lettuce', icon: '🥬' },
        { id: 'arugula', name: 'Arugula', icon: '🥬' },
        { id: 'chard', name: 'Swiss Chard', icon: '🥬' },
        { id: 'cabbage', name: 'Cabbage', icon: '🥬' }
      ],
      root: [
        { id: 'carrot', name: 'Carrot', icon: '🥕' },
        { id: 'potato', name: 'Potato', icon: '🥔' },
        { id: 'onion', name: 'Onion', icon: '🧅' },
        { id: 'radish', name: 'Radish', icon: '🥕' },
        { id: 'beet', name: 'Beet', icon: '🥕' },
        { id: 'turnip', name: 'Turnip', icon: '🥕' }
      ],
      squash: [
        { id: 'zucchini', name: 'Zucchini', icon: '🎃' },
        { id: 'butternut', name: 'Butternut', icon: '🎃' },
        { id: 'acorn', name: 'Acorn', icon: '🎃' },
        { id: 'spaghetti', name: 'Spaghetti', icon: '🎃' },
        { id: 'pumpkin', name: 'Pumpkin', icon: '🎃' },
        { id: 'yellow', name: 'Yellow Squash', icon: '🎃' }
      ],
      peppers: [
        { id: 'bell', name: 'Bell Pepper', icon: '🌶️' },
        { id: 'jalapeno', name: 'Jalapeño', icon: '🌶️' },
        { id: 'habanero', name: 'Habanero', icon: '🌶️' },
        { id: 'serrano', name: 'Serrano', icon: '🌶️' },
        { id: 'poblano', name: 'Poblano', icon: '🌶️' },
        { id: 'cayenne', name: 'Cayenne', icon: '🌶️' }
      ],
      allium: [
        { id: 'onion', name: 'Onion', icon: '🧅' },
        { id: 'garlic', name: 'Garlic', icon: '🧄' },
        { id: 'shallot', name: 'Shallot', icon: '🧅' },
        { id: 'leek', name: 'Leek', icon: '🧅' },
        { id: 'scallion', name: 'Scallion', icon: '🧅' },
        { id: 'chive', name: 'Chive', icon: '🧅' }
      ],
      grains: [
        { id: 'rice', name: 'Rice', icon: '🌾' },
        { id: 'quinoa', name: 'Quinoa', icon: '🌾' },
        { id: 'barley', name: 'Barley', icon: '🌾' },
        { id: 'farro', name: 'Farro', icon: '🌾' },
        { id: 'couscous', name: 'Couscous', icon: '🌾' },
        { id: 'oats', name: 'Oats', icon: '🌾' }
      ],
      pasta: [
        { id: 'spaghetti', name: 'Spaghetti', icon: '🍝' },
        { id: 'penne', name: 'Penne', icon: '🍝' },
        { id: 'fusilli', name: 'Fusilli', icon: '🍝' },
        { id: 'lasagna', name: 'Lasagna', icon: '🍝' },
        { id: 'macaroni', name: 'Macaroni', icon: '🍝' },
        { id: 'ravioli', name: 'Ravioli', icon: '🍝' }
      ],
      beans: [
        { id: 'black', name: 'Black Beans', icon: '🥫' },
        { id: 'kidney', name: 'Kidney Beans', icon: '🥫' },
        { id: 'chickpeas', name: 'Chickpeas', icon: '🥫' },
        { id: 'pinto', name: 'Pinto Beans', icon: '🥫' },
        { id: 'lentils', name: 'Lentils', icon: '🥫' },
        { id: 'cannellini', name: 'Cannellini', icon: '🥫' }
      ],
      nuts: [
        { id: 'almonds', name: 'Almonds', icon: '🥜' },
        { id: 'walnuts', name: 'Walnuts', icon: '🥜' },
        { id: 'cashews', name: 'Cashews', icon: '🥜' },
        { id: 'peanuts', name: 'Peanuts', icon: '🥜' },
        { id: 'pistachios', name: 'Pistachios', icon: '🥜' },
        { id: 'pecans', name: 'Pecans', icon: '🥜' }
      ],
      spices: [
        { id: 'salt', name: 'Salt', icon: '🧂' },
        { id: 'pepper', name: 'Pepper', icon: '🧂' },
        { id: 'cumin', name: 'Cumin', icon: '🧂' },
        { id: 'paprika', name: 'Paprika', icon: '🧂' },
        { id: 'cinnamon', name: 'Cinnamon', icon: '🧂' },
        { id: 'oregano', name: 'Oregano', icon: '🧂' }
      ],
      sauces: [
        { id: 'tomato', name: 'Tomato Sauce', icon: '🍯' },
        { id: 'pesto', name: 'Pesto', icon: '🍯' },
        { id: 'soy', name: 'Soy Sauce', icon: '🍯' },
        { id: 'hot', name: 'Hot Sauce', icon: '🍯' },
        { id: 'bbq', name: 'BBQ Sauce', icon: '🍯' },
        { id: 'mayo', name: 'Mayonnaise', icon: '🍯' }
      ],
      milk: [
        { id: 'whole', name: 'Whole Milk', icon: '🥛' },
        { id: 'skim', name: 'Skim Milk', icon: '🥛' },
        { id: 'almond', name: 'Almond Milk', icon: '🥛' },
        { id: 'soy', name: 'Soy Milk', icon: '🥛' },
        { id: 'oat', name: 'Oat Milk', icon: '🥛' },
        { id: 'coconut', name: 'Coconut Milk', icon: '🥛' }
      ],
      cheese: [
        { id: 'cheddar', name: 'Cheddar', icon: '🧀' },
        { id: 'mozzarella', name: 'Mozzarella', icon: '🧀' },
        { id: 'parmesan', name: 'Parmesan', icon: '🧀' },
        { id: 'feta', name: 'Feta', icon: '🧀' },
        { id: 'gouda', name: 'Gouda', icon: '🧀' },
        { id: 'blue', name: 'Blue Cheese', icon: '🧀' }
      ],
      yogurt: [
        { id: 'greek', name: 'Greek', icon: '🥣' },
        { id: 'regular', name: 'Regular', icon: '🥣' },
        { id: 'lowfat', name: 'Low-Fat', icon: '🥣' },
        { id: 'nonfat', name: 'Non-Fat', icon: '🥣' },
        { id: 'flavored', name: 'Flavored', icon: '🥣' },
        { id: 'plant', name: 'Plant-Based', icon: '🥣' }
      ],
      butter: [
        { id: 'salted', name: 'Salted', icon: '🧈' },
        { id: 'unsalted', name: 'Unsalted', icon: '🧈' },
        { id: 'clarified', name: 'Clarified', icon: '🧈' },
        { id: 'whipped', name: 'Whipped', icon: '🧈' },
        { id: 'plant', name: 'Plant-Based', icon: '🧈' },
        { id: 'compound', name: 'Compound', icon: '🧈' }
      ],
      cream: [
        { id: 'heavy', name: 'Heavy', icon: '🍦' },
        { id: 'light', name: 'Light', icon: '🍦' },
        { id: 'half', name: 'Half & Half', icon: '🍦' },
        { id: 'whipping', name: 'Whipping', icon: '🍦' },
        { id: 'sour', name: 'Sour', icon: '🍦' },
        { id: 'clotted', name: 'Clotted', icon: '🍦' }
      ],
      eggs: [
        { id: 'chicken', name: 'Chicken', icon: '🥚' },
        { id: 'duck', name: 'Duck', icon: '🥚' },
        { id: 'quail', name: 'Quail', icon: '🥚' },
        { id: 'free_range', name: 'Free Range', icon: '🥚' },
        { id: 'organic', name: 'Organic', icon: '🥚' },
        { id: 'egg_whites', name: 'Egg Whites', icon: '🥚' }
      ],
      berries: [
        { id: 'strawberry', name: 'Strawberry', icon: '🍓' },
        { id: 'blueberry', name: 'Blueberry', icon: '🫐' },
        { id: 'raspberry', name: 'Raspberry', icon: '🍓' },
        { id: 'blackberry', name: 'Blackberry', icon: '🍓' },
        { id: 'cranberry', name: 'Cranberry', icon: '🍓' },
        { id: 'mixed', name: 'Mixed Berries', icon: '🍓' }
      ],
      citrus: [
        { id: 'orange', name: 'Orange', icon: '🍊' },
        { id: 'lemon', name: 'Lemon', icon: '🍋' },
        { id: 'lime', name: 'Lime', icon: '🍋' },
        { id: 'grapefruit', name: 'Grapefruit', icon: '🍊' },
        { id: 'tangerine', name: 'Tangerine', icon: '🍊' },
        { id: 'kumquat', name: 'Kumquat', icon: '🍊' }
      ],
      tropical: [
        { id: 'pineapple', name: 'Pineapple', icon: '🍍' },
        { id: 'mango', name: 'Mango', icon: '🥭' },
        { id: 'banana', name: 'Banana', icon: '🍌' },
        { id: 'kiwi', name: 'Kiwi', icon: '🥝' },
        { id: 'papaya', name: 'Papaya', icon: '🥭' },
        { id: 'passion', name: 'Passion Fruit', icon: '🥭' }
      ],
      pome: [
        { id: 'apple', name: 'Apple', icon: '🍎' },
        { id: 'pear', name: 'Pear', icon: '🍐' },
        { id: 'quince', name: 'Quince', icon: '🍎' },
        { id: 'crabapple', name: 'Crabapple', icon: '🍎' },
        { id: 'medlar', name: 'Medlar', icon: '🍎' },
        { id: 'loquat', name: 'Loquat', icon: '🍎' }
      ],
      stone: [
        { id: 'peach', name: 'Peach', icon: '🍑' },
        { id: 'plum', name: 'Plum', icon: '🍑' },
        { id: 'cherry', name: 'Cherry', icon: '🍒' },
        { id: 'apricot', name: 'Apricot', icon: '🍑' },
        { id: 'nectarine', name: 'Nectarine', icon: '🍑' },
        { id: 'mango', name: 'Mango', icon: '🥭' }
      ],
      melons: [
        { id: 'watermelon', name: 'Watermelon', icon: '🍉' },
        { id: 'cantaloupe', name: 'Cantaloupe', icon: '🍈' },
        { id: 'honeydew', name: 'Honeydew', icon: '🍈' },
        { id: 'casaba', name: 'Casaba', icon: '🍈' },
        { id: 'galia', name: 'Galia', icon: '🍈' },
        { id: 'canary', name: 'Canary', icon: '🍈' }
      ]
    },
    categoryTypes: {
      protein: ['beef', 'chicken', 'pork', 'fish', 'seafood', 'other'],
      veggies: ['leafy', 'root', 'squash', 'peppers', 'allium', 'other'],
      pantry: ['grains', 'pasta', 'beans', 'nuts', 'spices', 'sauces'],
      dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs'],
      fruit: ['berries', 'citrus', 'tropical', 'pome', 'stone', 'melons']
    }
  };

  // Cookware data structure with three-level tagging
  const cookwareData = {
    categories: [
      { id: 'pots', name: 'Pots', icon: '🍲', color: 'bg-retro-blue' },
      { id: 'pans', name: 'Pans', icon: '🍳', color: 'bg-retro-orange' },
      { id: 'bakeware', name: 'Bakeware', icon: '🥖', color: 'bg-retro-yellow' },
      { id: 'utensils', name: 'Utensils', icon: '🥄', color: 'bg-retro-green' },
      { id: 'appliances', name: 'Appliances', icon: '⚙️', color: 'bg-retro-purple' },
      { id: 'knives', name: 'Knives', icon: '🔪', color: 'bg-retro-red' }
    ],
    types: {
      pots: [
        { id: 'stock', name: 'Stock Pot', icon: '🍲' },
        { id: 'sauce', name: 'Sauce Pot', icon: '🍲' },
        { id: 'dutch', name: 'Dutch Oven', icon: '🍲' },
        { id: 'pressure', name: 'Pressure Cooker', icon: '🍲' },
        { id: 'slow', name: 'Slow Cooker', icon: '🍲' },
        { id: 'multi', name: 'Multi Cooker', icon: '🍲' }
      ],
      pans: [
        { id: 'frying', name: 'Frying Pan', icon: '🍳' },
        { id: 'saute', name: 'Sauté Pan', icon: '🍳' },
        { id: 'grill', name: 'Grill Pan', icon: '🍳' },
        { id: 'griddle', name: 'Griddle', icon: '🍳' },
        { id: 'wok', name: 'Wok', icon: '🍳' },
        { id: 'crepe', name: 'Crepe Pan', icon: '🍳' }
      ],
      bakeware: [
        { id: 'sheet', name: 'Baking Sheet', icon: '🥖' },
        { id: 'cake', name: 'Cake Pan', icon: '🎂' },
        { id: 'muffin', name: 'Muffin Tin', icon: '🧁' },
        { id: 'loaf', name: 'Loaf Pan', icon: '🍞' },
        { id: 'casserole', name: 'Casserole Dish', icon: '🥘' },
        { id: 'pie', name: 'Pie Dish', icon: '🥧' }
      ],
      utensils: [
        { id: 'spatula', name: 'Spatula', icon: '🥄' },
        { id: 'whisk', name: 'Whisk', icon: '🥄' },
        { id: 'tongs', name: 'Tongs', icon: '🥄' },
        { id: 'ladle', name: 'Ladle', icon: '🥄' },
        { id: 'spoon', name: 'Cooking Spoon', icon: '🥄' },
        { id: 'turner', name: 'Turner', icon: '🥄' }
      ],
      appliances: [
        { id: 'blender', name: 'Blender', icon: '⚙️' },
        { id: 'mixer', name: 'Mixer', icon: '⚙️' },
        { id: 'processor', name: 'Food Processor', icon: '⚙️' },
        { id: 'toaster', name: 'Toaster', icon: '⚙️' },
        { id: 'microwave', name: 'Microwave', icon: '⚙️' },
        { id: 'airfryer', name: 'Air Fryer', icon: '⚙️' }
      ],
      knives: [
        { id: 'chef', name: 'Chef Knife', icon: '🔪' },
        { id: 'paring', name: 'Paring Knife', icon: '🔪' },
        { id: 'bread', name: 'Bread Knife', icon: '🔪' },
        { id: 'utility', name: 'Utility Knife', icon: '🔪' },
        { id: 'santoku', name: 'Santoku', icon: '🔪' },
        { id: 'cleaver', name: 'Cleaver', icon: '🔪' }
      ]
    },
    varieties: {
      stock: [
        { id: 'stainless', name: 'Stainless Steel', icon: '🍲' },
        { id: 'aluminum', name: 'Aluminum', icon: '🍲' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍲' },
        { id: 'ceramic', name: 'Ceramic', icon: '🍲' },
        { id: 'enamel', name: 'Enamel', icon: '🍲' },
        { id: 'copper', name: 'Copper', icon: '🍲' }
      ],
      sauce: [
        { id: 'small', name: 'Small', icon: '🍲' },
        { id: 'medium', name: 'Medium', icon: '🍲' },
        { id: 'large', name: 'Large', icon: '🍲' },
        { id: 'stainless', name: 'Stainless Steel', icon: '🍲' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍲' },
        { id: 'copper', name: 'Copper', icon: '🍲' }
      ],
      dutch: [
        { id: 'cast_iron', name: 'Cast Iron', icon: '🍲' },
        { id: 'enamel', name: 'Enameled', icon: '🍲' },
        { id: 'small', name: 'Small', icon: '🍲' },
        { id: 'medium', name: 'Medium', icon: '🍲' },
        { id: 'large', name: 'Large', icon: '🍲' },
        { id: 'oval', name: 'Oval', icon: '🍲' }
      ],
      pressure: [
        { id: 'electric', name: 'Electric', icon: '🍲' },
        { id: 'stovetop', name: 'Stovetop', icon: '🍲' },
        { id: 'small', name: 'Small', icon: '🍲' },
        { id: 'medium', name: 'Medium', icon: '🍲' },
        { id: 'large', name: 'Large', icon: '🍲' },
        { id: 'multi', name: 'Multi-Function', icon: '🍲' }
      ],
      slow: [
        { id: 'small', name: 'Small', icon: '🍲' },
        { id: 'medium', name: 'Medium', icon: '🍲' },
        { id: 'large', name: 'Large', icon: '🍲' },
        { id: 'programmable', name: 'Programmable', icon: '🍲' },
        { id: 'manual', name: 'Manual', icon: '🍲' },
        { id: 'travel', name: 'Travel', icon: '🍲' }
      ],
      multi: [
        { id: 'instant', name: 'Instant Pot', icon: '🍲' },
        { id: 'ninja', name: 'Ninja Foodi', icon: '🍲' },
        { id: 'small', name: 'Small', icon: '🍲' },
        { id: 'medium', name: 'Medium', icon: '🍲' },
        { id: 'large', name: 'Large', icon: '🍲' },
        { id: 'deluxe', name: 'Deluxe', icon: '🍲' }
      ],
      frying: [
        { id: 'cast_iron', name: 'Cast Iron', icon: '🍳' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍳' },
        { id: 'stainless', name: 'Stainless Steel', icon: '🍳' },
        { id: 'small', name: 'Small', icon: '🍳' },
        { id: 'medium', name: 'Medium', icon: '🍳' },
        { id: 'large', name: 'Large', icon: '🍳' }
      ],
      saute: [
        { id: 'stainless', name: 'Stainless Steel', icon: '🍳' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍳' },
        { id: 'small', name: 'Small', icon: '🍳' },
        { id: 'medium', name: 'Medium', icon: '🍳' },
        { id: 'large', name: 'Large', icon: '🍳' },
        { id: 'copper', name: 'Copper', icon: '🍳' }
      ],
      grill: [
        { id: 'cast_iron', name: 'Cast Iron', icon: '🍳' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍳' },
        { id: 'ridged', name: 'Ridged', icon: '🍳' },
        { id: 'flat', name: 'Flat', icon: '🍳' },
        { id: 'reversible', name: 'Reversible', icon: '🍳' },
        { id: 'electric', name: 'Electric', icon: '🍳' }
      ],
      griddle: [
        { id: 'cast_iron', name: 'Cast Iron', icon: '🍳' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍳' },
        { id: 'electric', name: 'Electric', icon: '🍳' },
        { id: 'stovetop', name: 'Stovetop', icon: '🍳' },
        { id: 'double', name: 'Double Burner', icon: '🍳' },
        { id: 'reversible', name: 'Reversible', icon: '🍳' }
      ],
      wok: [
        { id: 'carbon', name: 'Carbon Steel', icon: '🍳' },
        { id: 'cast_iron', name: 'Cast Iron', icon: '🍳' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍳' },
        { id: 'flat', name: 'Flat Bottom', icon: '🍳' },
        { id: 'round', name: 'Round Bottom', icon: '🍳' },
        { id: 'electric', name: 'Electric', icon: '🍳' }
      ],
      crepe: [
        { id: 'nonstick', name: 'Non-stick', icon: '🍳' },
        { id: 'cast_iron', name: 'Cast Iron', icon: '🍳' },
        { id: 'electric', name: 'Electric', icon: '🍳' },
        { id: 'carbon', name: 'Carbon Steel', icon: '🍳' },
        { id: 'small', name: 'Small', icon: '🍳' },
        { id: 'large', name: 'Large', icon: '🍳' }
      ],
      sheet: [
        { id: 'aluminum', name: 'Aluminum', icon: '🥖' },
        { id: 'nonstick', name: 'Non-stick', icon: '🥖' },
        { id: 'insulated', name: 'Insulated', icon: '🥖' },
        { id: 'small', name: 'Small', icon: '🥖' },
        { id: 'medium', name: 'Medium', icon: '🥖' },
        { id: 'large', name: 'Large', icon: '🥖' }
      ],
      cake: [
        { id: 'round', name: 'Round', icon: '🎂' },
        { id: 'square', name: 'Square', icon: '🎂' },
        { id: 'springform', name: 'Springform', icon: '🎂' },
        { id: 'bundt', name: 'Bundt', icon: '🎂' },
        { id: 'sheet', name: 'Sheet', icon: '🎂' },
        { id: 'layer', name: 'Layer', icon: '🎂' }
      ],
      muffin: [
        { id: 'standard', name: 'Standard', icon: '🧁' },
        { id: 'mini', name: 'Mini', icon: '🧁' },
        { id: 'jumbo', name: 'Jumbo', icon: '🧁' },
        { id: 'silicone', name: 'Silicone', icon: '🧁' },
        { id: 'nonstick', name: 'Non-stick', icon: '🧁' },
        { id: 'metal', name: 'Metal', icon: '🧁' }
      ],
      loaf: [
        { id: 'standard', name: 'Standard', icon: '🍞' },
        { id: 'mini', name: 'Mini', icon: '🍞' },
        { id: 'pullman', name: 'Pullman', icon: '🍞' },
        { id: 'silicone', name: 'Silicone', icon: '🍞' },
        { id: 'nonstick', name: 'Non-stick', icon: '🍞' },
        { id: 'glass', name: 'Glass', icon: '🍞' }
      ],
      casserole: [
        { id: 'glass', name: 'Glass', icon: '🥘' },
        { id: 'ceramic', name: 'Ceramic', icon: '🥘' },
        { id: 'metal', name: 'Metal', icon: '🥘' },
        { id: 'small', name: 'Small', icon: '🥘' },
        { id: 'medium', name: 'Medium', icon: '🥘' },
        { id: 'large', name: 'Large', icon: '🥘' }
      ],
      pie: [
        { id: 'glass', name: 'Glass', icon: '🥧' },
        { id: 'ceramic', name: 'Ceramic', icon: '🥧' },
        { id: 'metal', name: 'Metal', icon: '🥧' },
        { id: 'deep', name: 'Deep Dish', icon: '🥧' },
        { id: 'standard', name: 'Standard', icon: '🥧' },
        { id: 'mini', name: 'Mini', icon: '🥧' }
      ],
      spatula: [
        { id: 'silicone', name: 'Silicone', icon: '🥄' },
        { id: 'metal', name: 'Metal', icon: '🥄' },
        { id: 'wood', name: 'Wood', icon: '🥄' },
        { id: 'plastic', name: 'Plastic', icon: '🥄' },
        { id: 'fish', name: 'Fish', icon: '🥄' },
        { id: 'offset', name: 'Offset', icon: '🥄' }
      ],
      whisk: [
        { id: 'balloon', name: 'Balloon', icon: '🥄' },
        { id: 'french', name: 'French', icon: '🥄' },
        { id: 'flat', name: 'Flat', icon: '🥄' },
        { id: 'silicone', name: 'Silicone', icon: '🥄' },
        { id: 'metal', name: 'Metal', icon: '🥄' },
        { id: 'mini', name: 'Mini', icon: '🥄' }
      ],
      tongs: [
        { id: 'metal', name: 'Metal', icon: '🥄' },
        { id: 'silicone', name: 'Silicone-Tipped', icon: '🥄' },
        { id: 'locking', name: 'Locking', icon: '🥄' },
        { id: 'long', name: 'Long', icon: '🥄' },
        { id: 'short', name: 'Short', icon: '🥄' },
        { id: 'bbq', name: 'BBQ', icon: '🥄' }
      ],
      ladle: [
        { id: 'metal', name: 'Metal', icon: '🥄' },
        { id: 'silicone', name: 'Silicone', icon: '🥄' },
        { id: 'plastic', name: 'Plastic', icon: '🥄' },
        { id: 'small', name: 'Small', icon: '🥄' },
        { id: 'large', name: 'Large', icon: '🥄' },
        { id: 'soup', name: 'Soup', icon: '🥄' }
      ],
      spoon: [
        { id: 'wood', name: 'Wood', icon: '🥄' },
        { id: 'metal', name: 'Metal', icon: '🥄' },
        { id: 'silicone', name: 'Silicone', icon: '🥄' },
        { id: 'slotted', name: 'Slotted', icon: '🥄' },
        { id: 'solid', name: 'Solid', icon: '🥄' },
        { id: 'serving', name: 'Serving', icon: '🥄' }
      ],
      turner: [
        { id: 'metal', name: 'Metal', icon: '🥄' },
        { id: 'silicone', name: 'Silicone', icon: '🥄' },
        { id: 'plastic', name: 'Plastic', icon: '🥄' },
        { id: 'slotted', name: 'Slotted', icon: '🥄' },
        { id: 'solid', name: 'Solid', icon: '🥄' },
        { id: 'fish', name: 'Fish', icon: '🥄' }
      ],
      blender: [
        { id: 'countertop', name: 'Countertop', icon: '⚙️' },
        { id: 'immersion', name: 'Immersion', icon: '⚙️' },
        { id: 'personal', name: 'Personal', icon: '⚙️' },
        { id: 'high_speed', name: 'High-Speed', icon: '⚙️' },
        { id: 'standard', name: 'Standard', icon: '⚙️' },
        { id: 'professional', name: 'Professional', icon: '⚙️' }
      ],
      mixer: [
        { id: 'stand', name: 'Stand', icon: '⚙️' },
        { id: 'hand', name: 'Hand', icon: '⚙️' },
        { id: 'kitchenaid', name: 'KitchenAid', icon: '⚙️' },
        { id: 'planetary', name: 'Planetary', icon: '⚙️' },
        { id: 'compact', name: 'Compact', icon: '⚙️' },
        { id: 'professional', name: 'Professional', icon: '⚙️' }
      ],
      processor: [
        { id: 'full_size', name: 'Full Size', icon: '⚙️' },
        { id: 'mini', name: 'Mini', icon: '⚙️' },
        { id: 'chopper', name: 'Chopper', icon: '⚙️' },
        { id: 'manual', name: 'Manual', icon: '⚙️' },
        { id: 'electric', name: 'Electric', icon: '⚙️' },
        { id: 'professional', name: 'Professional', icon: '⚙️' }
      ],
      toaster: [
        { id: 'two_slice', name: '2-Slice', icon: '⚙️' },
        { id: 'four_slice', name: '4-Slice', icon: '⚙️' },
        { id: 'toaster_oven', name: 'Toaster Oven', icon: '⚙️' },
        { id: 'convection', name: 'Convection', icon: '⚙️' },
        { id: 'smart', name: 'Smart', icon: '⚙️' },
        { id: 'retro', name: 'Retro', icon: '⚙️' }
      ],
      microwave: [
        { id: 'countertop', name: 'Countertop', icon: '⚙️' },
        { id: 'built_in', name: 'Built-in', icon: '⚙️' },
        { id: 'convection', name: 'Convection', icon: '⚙️' },
        { id: 'small', name: 'Small', icon: '⚙️' },
        { id: 'medium', name: 'Medium', icon: '⚙️' },
        { id: 'large', name: 'Large', icon: '⚙️' }
      ],
      airfryer: [
        { id: 'basket', name: 'Basket', icon: '⚙️' },
        { id: 'oven', name: 'Oven', icon: '⚙️' },
        { id: 'combo', name: 'Combo', icon: '⚙️' },
        { id: 'small', name: 'Small', icon: '⚙️' },
        { id: 'medium', name: 'Medium', icon: '⚙️' },
        { id: 'large', name: 'Large', icon: '⚙️' }
      ],
      chef: [
        { id: 'german', name: 'German Style', icon: '🔪' },
        { id: 'japanese', name: 'Japanese Style', icon: '🔪' },
        { id: 'small', name: '6 inch', icon: '🔪' },
        { id: 'medium', name: '8 inch', icon: '🔪' },
        { id: 'large', name: '10 inch', icon: '🔪' },
        { id: 'carbon', name: 'Carbon Steel', icon: '🔪' }
      ],
      paring: [
        { id: 'straight', name: 'Straight', icon: '🔪' },
        { id: 'bird_beak', name: 'Bird Beak', icon: '🔪' },
        { id: 'sheep_foot', name: 'Sheep Foot', icon: '🔪' },
        { id: 'small', name: '3 inch', icon: '🔪' },
        { id: 'medium', name: '4 inch', icon: '🔪' },
        { id: 'ceramic', name: 'Ceramic', icon: '🔪' }
      ],
      bread: [
        { id: 'serrated', name: 'Serrated', icon: '🔪' },
        { id: 'offset', name: 'Offset', icon: '🔪' },
        { id: 'straight', name: 'Straight', icon: '🔪' },
        { id: 'short', name: '7 inch', icon: '🔪' },
        { id: 'medium', name: '9 inch', icon: '🔪' },
        { id: 'long', name: '10+ inch', icon: '🔪' }
      ],
      utility: [
        { id: 'straight', name: 'Straight', icon: '🔪' },
        { id: 'serrated', name: 'Serrated', icon: '🔪' },
        { id: 'small', name: '4-5 inch', icon: '🔪' },
        { id: 'medium', name: '6-7 inch', icon: '🔪' },
        { id: 'japanese', name: 'Japanese', icon: '🔪' },
        { id: 'german', name: 'German', icon: '🔪' }
      ],
      santoku: [
        { id: 'traditional', name: 'Traditional', icon: '🔪' },
        { id: 'hollow', name: 'Hollow Edge', icon: '🔪' },
        { id: 'small', name: '5 inch', icon: '🔪' },
        { id: 'medium', name: '7 inch', icon: '🔪' },
        { id: 'large', name: '8+ inch', icon: '🔪' },
        { id: 'damascus', name: 'Damascus', icon: '🔪' }
      ],
      cleaver: [
        { id: 'chinese', name: 'Chinese', icon: '🔪' },
        { id: 'butcher', name: 'Butcher', icon: '🔪' },
        { id: 'vegetable', name: 'Vegetable', icon: '🔪' },
        { id: 'small', name: 'Small', icon: '🔪' },
        { id: 'medium', name: 'Medium', icon: '🔪' },
        { id: 'large', name: 'Large', icon: '🔪' }
      ]
    },
    categoryTypes: {
      pots: ['stock', 'sauce', 'dutch', 'pressure', 'slow', 'multi'],
      pans: ['frying', 'saute', 'grill', 'griddle', 'wok', 'crepe'],
      bakeware: ['sheet', 'cake', 'muffin', 'loaf', 'casserole', 'pie'],
      utensils: ['spatula', 'whisk', 'tongs', 'ladle', 'spoon', 'turner'],
      appliances: ['blender', 'mixer', 'processor', 'toaster', 'microwave', 'airfryer'],
      knives: ['chef', 'paring', 'bread', 'utility', 'santoku', 'cleaver']
    }
  };

  // Get subcategories for a given category
  const getSubcategories = (category) => {
    if (!category) return [];
    return ingredientData.categoryTypes[category] || [];
  };

  // Get cookware subcategories for a given category
  const getCookwareSubcategories = (category) => {
    if (!category) return [];
    return cookwareData.categoryTypes[category] || [];
  };

  // Specific variants for the selected subcategory
  const getVariants = (subcategory) => {
    if (!subcategory) return [];
    
    // This would be expanded with actual data
    return [
      'Variant 1', 'Variant 2', 'Variant 3', 'Variant 4', 'Variant 5', 'Variant 6'
    ];
  };

  // Get cookware varieties for the selected subcategory
  const getCookwareVarieties = (subcategory) => {
    if (!subcategory) return [];
    return cookwareData.varieties[subcategory] || [];
  };

  const handleCaptureImage = () => {
    setScanning(true);
    
    // Simulate image capture and processing
    setTimeout(() => {
      const mockScanResult = [
        { name: 'Chicken Breast', category: 'protein', confidence: 0.92 },
        { name: 'Garlic', category: 'veggies', confidence: 0.87 },
        { name: 'Olive Oil', category: 'pantry', confidence: 0.95 }
      ];
      
      setScanResult(mockScanResult);
      setScanning(false);
    }, 2000);
  };

  const handleAddScannedItems = () => {
    if (scanResult) {
      scanResult.forEach(item => {
        addIngredient({
          name: item.name,
          category: item.category,
          quantity: 1,
          unit: 'item'
        });
      });
      
      setScanResult(null);
      setShowCamera(false);
    }
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    
    if (newIngredient.name.trim()) {
      addIngredient(newIngredient);
      
      setNewIngredient({
        name: '',
        category: '',
        type: '',
        cut: '',
        quantity: 1,
        unit: 'item'
      });
    }
  };

  const handleAddCookware = (e) => {
    e.preventDefault();
    
    if (newCookware.name.trim()) {
      addCookware(newCookware);
      
      setNewCookware({
        name: '',
        type: '',
        quantity: 1,
        unit: 'item'
      });
    }
  };

  // Function to toggle card flip
  const toggleCardFlip = (recipeId) => {
    setFlippedCards(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  // Function to toggle modal flip
  const toggleModalFlip = () => {
    setModalFlipped(!modalFlipped);
  };

  // Function to add recipe to cookbook
  const addRecipeToCookbookLocal = (recipe) => {
    addToCookbook(recipe).then(result => {
      if (result.success) {
        alert(`Added ${recipe.name || recipe.title} to your cookbook!`);
      } else {
        alert(result.message || 'This recipe is already in your cookbook.');
      }
      toggleCardFlip(recipe.id);
    });
  };

  // Function to open recipe detail modal
  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
    setModalFlipped(false); // Reset flip state when opening modal
  };

  // Function to close recipe detail modal
  const closeRecipeModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  // Find matching recipes and switch to recipes tab
  const handleFindRecipes = () => {
    console.log('Find Matching Recipes button clicked');
    paginate(1); // Reset to first page when finding new recipes
    findMatchingRecipes();
    setActiveTab('recipes');
    
    // Add a delay to check matchedRecipes after they've been loaded
    setTimeout(() => {
      console.log('Total matched recipes:', matchedRecipes.length);
      console.log('Total pages:', totalPages);
      console.log('Current page:', currentPage);
    }, 1000);
  };

  // Add a useEffect to monitor matchedRecipes and ensure pagination works
  useEffect(() => {
    console.log('matchedRecipes changed:', matchedRecipes.length);
    // Reset to page 1 when recipes change
    paginate(1);
  }, [matchedRecipes]);

  return (
    <Layout>
      {/* Apply the card flip styles */}
      <style>{cardStyles}</style>
      
      <div className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6 relative">
        <h2 className="font-retro text-2xl mb-6 border-b-4 border-retro-yellow pb-2">
          What's in My Kitchen
        </h2>
        
        {/* Camera Scanning Section */}
        {showCamera ? (
          <div className="mb-8">
            <div className="relative">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-64 object-cover rounded-retro border-2 border-gray-800"
              />
              
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-retro">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Scanning ingredients...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => setShowCamera(false)} 
                className="retro-button bg-retro-red text-white"
              >
                Cancel
              </button>
              
              {scanResult ? (
                <button 
                  onClick={handleAddScannedItems} 
                  className="retro-button"
                >
                  Add {scanResult.length} Items
                </button>
              ) : (
                <button 
                  onClick={handleCaptureImage} 
                  className="retro-button"
                  disabled={scanning}
                >
                  {scanning ? 'Scanning...' : 'Capture Image'}
                </button>
              )}
            </div>
            
            {scanResult && (
              <div className="mt-4 p-4 bg-retro-cream rounded-md">
                <h3 className="font-bold mb-2">Detected Items:</h3>
                <ul className="space-y-2">
                  {scanResult.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{item.name} ({item.category})</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setShowCamera(true)} 
            className="retro-button mb-8 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Scan Ingredients
          </button>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'ingredients' ? 'text-retro-red border-b-2 border-retro-red' : 'text-gray-500'}`}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'cookware' ? 'text-retro-red border-b-2 border-retro-red' : 'text-gray-500'}`}
            onClick={() => setActiveTab('cookware')}
          >
            Cookware
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'recipes' ? 'text-retro-red border-b-2 border-retro-red' : 'text-gray-500'}`}
            onClick={() => {
              setActiveTab('recipes');
            }}
          >
            Matched Recipes
          </button>
        </div>
        
        {/* Ingredients Tab */}
        {activeTab === 'ingredients' && (
          <div>
            {/* Card-based Ingredient Selector */}
            <div className="mb-6">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center mb-4 text-sm">
                <button 
                  onClick={() => {
                    setSelectorLevel('category');
                    setSelectedCategory('');
                    setSelectedType('');
                  }}
                  className={`font-medium ${selectorLevel === 'category' ? 'text-retro-red' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Categories
                </button>
                
                {selectedCategory && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => {
                        setSelectorLevel('type');
                        setSelectedType('');
                      }}
                      className={`font-medium ${selectorLevel === 'type' ? 'text-retro-red' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {ingredientData.categories.find(cat => cat.id === selectedCategory)?.name}
                    </button>
                  </>
                )}
                
                {selectedType && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => {
                        setSelectorLevel('cut');
                      }}
                      className={`font-medium ${selectorLevel === 'cut' ? 'text-retro-red' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {ingredientData.types[selectedCategory]?.find(type => type.id === selectedType)?.name}
                    </button>
                  </>
                )}
              </div>
              
              {/* Category Selection */}
              {selectorLevel === 'category' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {ingredientData.categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectorLevel('type');
                        setNewIngredient({...newIngredient, category: category.id});
                      }}
                      className="retro-card hover:shadow-retro-hover transition-all p-4 flex flex-col items-center"
                    >
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-3`}>
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <h3 className="font-retro text-lg">{category.name}</h3>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Type Selection */}
              {selectorLevel === 'type' && selectedCategory && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {ingredientData.types[selectedCategory].map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setSelectorLevel('cut');
                        setNewIngredient({...newIngredient, type: type.id});
                      }}
                      className="retro-card hover:shadow-retro-hover transition-all p-4 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-retro-cream rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">{type.icon}</span>
                      </div>
                      <h4 className="font-retro text-sm text-center">{type.name}</h4>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Cut Selection */}
              {selectorLevel === 'cut' && selectedType && ingredientData.cuts[selectedType] && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {ingredientData.cuts[selectedType].map(cut => (
                    <button
                      key={cut.id}
                      onClick={() => {
                        // Set the ingredient name based on the selections
                        const categoryName = ingredientData.categories.find(c => c.id === selectedCategory)?.name;
                        const typeName = ingredientData.types[selectedCategory]?.find(t => t.id === selectedType)?.name;
                        
                        // Create a descriptive name
                        const ingredientName = `${cut.name} ${typeName}`;
                        
                        // Add the ingredient
                        addIngredient({
                          name: ingredientName,
                          category: selectedCategory,
                          type: selectedType,
                          cut: cut.id,
                          quantity: 1,
                          unit: 'item'
                        });
                        
                        // Show a brief confirmation message
                        const confirmMessage = document.createElement('div');
                        confirmMessage.className = 'fixed bottom-4 right-4 bg-retro-green text-white px-4 py-2 rounded-md shadow-md z-50';
                        confirmMessage.textContent = `Added ${ingredientName} to My Ingredients`;
                        document.body.appendChild(confirmMessage);
                        
                        // Remove the confirmation message after 2 seconds
                        setTimeout(() => {
                          document.body.removeChild(confirmMessage);
                        }, 2000);
                        
                        // Reset the selector
                        setSelectorLevel('category');
                        setSelectedCategory('');
                        setSelectedType('');
                      }}
                      className="retro-card hover:shadow-retro-hover transition-all p-4 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-retro-cream rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">{cut.icon}</span>
                      </div>
                      <h4 className="font-retro text-sm text-center">{cut.name}</h4>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Manual Ingredient Form (for custom ingredients) */}
            <div className="mb-8">
              <h3 className="font-retro text-xl mb-4">Custom Ingredient</h3>
              <form onSubmit={handleAddIngredient} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="ingredient-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredient Name
                  </label>
                  <input
                    id="ingredient-name"
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                    className="retro-input w-full"
                    placeholder="e.g. Chicken Breast"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="ingredient-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    id="ingredient-quantity"
                    type="number"
                    min="1"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: parseInt(e.target.value)})}
                    className="retro-input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="ingredient-unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    id="ingredient-unit"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                    className="retro-input w-full"
                  >
                    <option value="item">Item</option>
                    <option value="g">Grams</option>
                    <option value="kg">Kilograms</option>
                    <option value="oz">Ounces</option>
                    <option value="lb">Pounds</option>
                    <option value="cup">Cups</option>
                    <option value="tbsp">Tablespoons</option>
                    <option value="tsp">Teaspoons</option>
                    <option value="ml">Milliliters</option>
                    <option value="l">Liters</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button type="submit" className="retro-button w-full">
                    Add Custom Ingredient
                  </button>
                </div>
              </form>
            </div>
            
            {/* Ingredient List */}
            <div>
              <h3 className="font-retro text-xl mb-4">My Ingredients</h3>
              {ingredients.length === 0 ? (
                <p className="text-gray-500 italic">No ingredients added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="retro-card p-4 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        <div className="text-sm text-gray-500">
                          {ingredient.quantity} {ingredient.unit}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeIngredient(index)} 
                        className="text-retro-red hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Find Matching Recipes Button */}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleFindRecipes} 
                className="retro-button"
                disabled={loading}
              >
                {loading ? 'Finding Recipes...' : 'Find Matching Recipes'}
              </button>
            </div>
          </div>
        )}
        
        {/* Cookware Tab */}
        {activeTab === 'cookware' && (
          <div>
            {/* Card-based Cookware Selector */}
            <div className="mb-6">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center mb-4 text-sm">
                <button 
                  onClick={() => {
                    setCookwareSelectorLevel('category');
                    setSelectedCookwareCategory('');
                    setSelectedCookwareType('');
                  }}
                  className={`font-medium ${cookwareSelectorLevel === 'category' ? 'text-retro-red' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Categories
                </button>
                
                {selectedCookwareCategory && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => {
                        setCookwareSelectorLevel('type');
                        setSelectedCookwareType('');
                      }}
                      className={`font-medium ${cookwareSelectorLevel === 'type' ? 'text-retro-red' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {cookwareData.categories.find(cat => cat.id === selectedCookwareCategory)?.name}
                    </button>
                  </>
                )}
                
                {selectedCookwareType && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => {
                        setCookwareSelectorLevel('variety');
                      }}
                      className={`font-medium ${cookwareSelectorLevel === 'variety' ? 'text-retro-red' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {cookwareData.types[selectedCookwareCategory]?.find(type => type.id === selectedCookwareType)?.name}
                    </button>
                  </>
                )}
              </div>
              
              {/* Category Selection */}
              {cookwareSelectorLevel === 'category' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {cookwareData.categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCookwareCategory(category.id);
                        setCookwareSelectorLevel('type');
                        setNewCookware({...newCookware, category: category.id});
                      }}
                      className="retro-card hover:shadow-retro-hover transition-all p-4 flex flex-col items-center"
                    >
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-3`}>
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <h3 className="font-retro text-lg">{category.name}</h3>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Type Selection */}
              {cookwareSelectorLevel === 'type' && selectedCookwareCategory && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {cookwareData.types[selectedCookwareCategory].map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedCookwareType(type.id);
                        setCookwareSelectorLevel('variety');
                        setNewCookware({...newCookware, type: type.id});
                      }}
                      className="retro-card hover:shadow-retro-hover transition-all p-4 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-retro-cream rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">{type.icon}</span>
                      </div>
                      <h4 className="font-retro text-sm text-center">{type.name}</h4>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Variety Selection */}
              {cookwareSelectorLevel === 'variety' && selectedCookwareType && cookwareData.varieties[selectedCookwareType] && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {cookwareData.varieties[selectedCookwareType].map(variety => (
                    <button
                      key={variety.id}
                      onClick={() => {
                        // Set the cookware name based on the selections
                        const categoryName = cookwareData.categories.find(c => c.id === selectedCookwareCategory)?.name;
                        const typeName = cookwareData.types[selectedCookwareCategory]?.find(t => t.id === selectedCookwareType)?.name;
                        
                        // Create a descriptive name
                        const cookwareName = `${variety.name} ${typeName}`;
                        
                        // Add the cookware
                        addCookware({
                          name: cookwareName,
                          category: selectedCookwareCategory,
                          type: selectedCookwareType,
                          variety: variety.id,
                          quantity: 1,
                          unit: 'item'
                        });
                        
                        // Show a brief confirmation message
                        const confirmMessage = document.createElement('div');
                        confirmMessage.className = 'fixed bottom-4 right-4 bg-retro-green text-white px-4 py-2 rounded-md shadow-md z-50';
                        confirmMessage.textContent = `Added ${cookwareName} to My Cookware`;
                        document.body.appendChild(confirmMessage);
                        
                        // Remove the confirmation message after 2 seconds
                        setTimeout(() => {
                          document.body.removeChild(confirmMessage);
                        }, 2000);
                        
                        // Reset the selector
                        setCookwareSelectorLevel('category');
                        setSelectedCookwareCategory('');
                        setSelectedCookwareType('');
                      }}
                      className="retro-card hover:shadow-retro-hover transition-all p-4 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-retro-cream rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">{variety.icon}</span>
                      </div>
                      <h4 className="font-retro text-sm text-center">{variety.name}</h4>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Manual Cookware Form */}
            <div className="mb-8">
              <h3 className="font-retro text-xl mb-4">Custom Cookware</h3>
              <form onSubmit={handleAddCookware} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="cookware-name" className="block text-gray-700 text-sm font-bold mb-2">
                    Cookware Name
                  </label>
                  <input
                    id="cookware-name"
                    type="text"
                    className="retro-input w-full"
                    value={newCookware.name}
                    onChange={(e) => setNewCookware({...newCookware, name: e.target.value})}
                    placeholder="e.g. Cast Iron Skillet"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cookware-type" className="block text-gray-700 text-sm font-bold mb-2">
                    Cookware Type
                  </label>
                  <select
                    id="cookware-type"
                    value={newCookware.type}
                    onChange={(e) => setNewCookware({...newCookware, type: e.target.value})}
                    className="retro-input w-full"
                  >
                    <option value="">Select a type</option>
                    {cookwareData.categories.map(category => (
                      <optgroup key={category.id} label={category.name}>
                        {cookwareData.types[category.id].map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="cookware-quantity" className="block text-gray-700 text-sm font-bold mb-2">
                    Quantity
                  </label>
                  <input
                    id="cookware-quantity"
                    type="number"
                    min="1"
                    value={newCookware.quantity}
                    onChange={(e) => setNewCookware({...newCookware, quantity: parseInt(e.target.value)})}
                    className="retro-input w-full"
                  />
                </div>
                
                <div className="flex items-end">
                  <button type="submit" className="retro-button w-full">
                    Add Custom Cookware
                  </button>
                </div>
              </form>
            </div>
            
            {/* Cookware List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-retro text-xl">My Cookware</h3>
                {cookware.length > 0 && (
                  <button 
                    onClick={clearCookware}
                    className="text-sm text-retro-red hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {cookware.length === 0 ? (
                <p className="text-gray-500 italic">No cookware added yet. Add some cookware to get started!</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cookware.map((item, index) => (
                    <li key={index} className="retro-card p-3 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeCookware(index)}
                        className="text-retro-red hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Find Matching Recipes Button */}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleFindRecipes} 
                className="retro-button"
                disabled={loading}
              >
                {loading ? 'Finding Recipes...' : 'Find Matching Recipes'}
              </button>
            </div>
          </div>
        )}
        
        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-retro-red"></div>
                <p className="ml-4 font-retro">Finding recipes for you...</p>
              </div>
            ) : matchedRecipes.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-retro-yellow mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-retro text-xl mb-2">No Matching Recipes Found</h3>
                <p className="text-gray-600 mb-6">Try adding more ingredients or different cookware to find matching recipes.</p>
                <button 
                  onClick={() => setActiveTab('ingredients')} 
                  className="retro-button"
                >
                  Back to Ingredients
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-retro text-xl mb-4">Matched Recipes ({matchedRecipes.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRecipes.map((recipe, index) => (
                    <div 
                      key={index} 
                      className={`recipe-card ${flippedCards[recipe.id] ? 'flipped' : ''}`}
                    >
                      <div className="recipe-card-inner">
                        {/* Front of the card */}
                        <div className="recipe-card-front">
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              className="w-full h-32 object-cover rounded-t-lg" 
                              src={recipe.image_url || recipe.image || `/src/assets/images/${recipe.name || recipe.title || 'Vegetable Pasta'}.png`} 
                              alt={recipe.name || recipe.title || 'Recipe'} 
                              onError={(e) => {
                                // Fallback to a local default image if the recipe image fails to load
                                e.target.onerror = null;
                                // Try to find a matching image in assets based on recipe name
                                const recipeName = recipe.name || recipe.title;
                                if (recipeName) {
                                  e.target.src = `/src/assets/images/${recipeName}.png`;
                                } else {
                                  e.target.src = `/src/assets/images/Vegetable Pasta.png`;
                                }
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-retro text-lg truncate">{recipe.name || recipe.title}</h4>
                                {recipe.cuisine && (
                                  <div className="flex items-center ml-2 bg-retro-yellow bg-opacity-90 px-2 py-0.5 rounded-full text-black text-xs">
                                    <span className="mr-1">🌎</span>
                                    <span className="font-medium">{recipe.cuisine}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <div className="flex items-center mb-2">
                                <div className="flex text-retro-yellow">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < (recipe.rating || 4) ? 'text-retro-yellow' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">{recipe.cook_time || recipe.cookTime || 30} mins</span>
                              </div>
                              
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">
                                  Matching Ingredients: {recipe.matchedIngredients?.length || 0}/{recipe.totalIngredients || recipe.ingredients?.length || 0}
                                </h5>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-retro-green" 
                                    style={{ 
                                      width: `${recipe.ingredients && recipe.matchedIngredients ? 
                                        (recipe.matchedIngredients.length / recipe.totalIngredients * 100) : 
                                        recipe.score ? Math.min(recipe.score, 100) : 50}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Ingredients list on front of card */}
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">Key Ingredients:</h5>
                                <ul className="text-sm list-disc list-inside">
                                  {(recipe.ingredients && recipe.ingredients.length > 0) ? 
                                    recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                                      <li key={i} className="truncate">
                                        {typeof ingredient === 'string' ? ingredient : ingredient.name}
                                      </li>
                                    )) : 
                                    <li>Ingredients not available</li>
                                  }
                                  {(recipe.ingredients && recipe.ingredients.length > 3) && (
                                    <li className="italic">...and {recipe.ingredients.length - 3} more</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-sm">
                                <span className="font-medium">Difficulty:</span> {recipe.difficulty || 'Medium'}
                              </span>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => openRecipeModal(recipe)} 
                                  className="retro-button-sm"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCardFlip(recipe.id);
                                  }} 
                                  className="retro-button-sm bg-retro-blue hover:bg-blue-600"
                                >
                                  Flip
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Back of the card */}
                        <div className="recipe-card-back">
                          <div className="p-4 flex flex-col h-full">
                            <div>
                              <h4 className="font-retro text-lg mb-2">{recipe.name || recipe.title}</h4>
                              <p className="text-gray-700">{recipe.description || 'A delicious recipe perfect for any occasion.'}</p>
                              
                              {/* Instructions on back of card */}
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">Instructions:</h5>
                                <ol className="text-sm list-decimal list-inside">
                                  {(recipe.steps && recipe.steps.length > 0) ? 
                                    recipe.steps.slice(0, 3).map((step, i) => (
                                      <li key={i} className="text-xs mb-1">
                                        {typeof step === 'string' ? step : step.description}
                                      </li>
                                    )) : 
                                    <li>Instructions not available</li>
                                  }
                                  {(recipe.steps && recipe.steps.length > 3) && (
                                    <li className="italic text-xs">...and {recipe.steps.length - 3} more steps</li>
                                  )}
                                </ol>
                              </div>
                              
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">Ingredients:</h5>
                                <ul className="text-sm list-disc list-inside">
                                  {(recipe.ingredients && recipe.ingredients.length > 0) ? 
                                    recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                                      <li key={i} className="truncate">
                                        {typeof ingredient === 'string' ? ingredient : ingredient.name}
                                      </li>
                                    )) : 
                                    <li>Ingredients not available</li>
                                  }
                                  {(recipe.ingredients && recipe.ingredients.length > 3) && (
                                    <li className="italic">...and {recipe.ingredients.length - 3} more</li>
                                  )}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-1">Cookware Needed:</h5>
                                <ul className="text-sm list-disc list-inside">
                                  {(recipe.required_cookware && recipe.required_cookware.length > 0) ? 
                                    recipe.required_cookware.slice(0, 2).map((item, i) => (
                                      <li key={i} className="truncate">
                                        {typeof item === 'string' ? item : item.name}
                                      </li>
                                    )) : 
                                    <li>Basic kitchen equipment</li>
                                  }
                                  {(recipe.required_cookware && recipe.required_cookware.length > 2) && (
                                    <li className="italic">...and {recipe.required_cookware.length - 2} more</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="mt-auto flex justify-between">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCardFlip(recipe.id);
                                }} 
                                className="retro-button-sm"
                              >
                                Back
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const recipeWithImage = {
                                    ...recipe,
                                    image_url: `/src/assets/images/${recipe.name || recipe.title || 'Vegetable Pasta'}.png`
                                  };
                                  setRecipeToAdd(recipeWithImage);
                                  setShowCollectionModal(true);
                                  closeRecipeModal();
                                }} 
                                className="retro-button-sm bg-retro-yellow hover:bg-yellow-600"
                              >
                                Add to Cookbook
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => {
                      console.log('Previous button clicked, current page:', currentPage);
                      paginate(currentPage - 1);
                    }} 
                    className="retro-button-sm mr-4"
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>
                  <span className="mx-4 text-lg">{currentPage} of {totalPages}</span>
                  <button 
                    onClick={() => {
                      console.log('Next button clicked, current page:', currentPage);
                      console.log('Total pages:', totalPages);
                      paginate(currentPage + 1);
                    }} 
                    className="retro-button-sm ml-4"
                    disabled={currentPage >= totalPages}
                    style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Recipe Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-retro text-2xl text-retro-red">{selectedRecipe.name || selectedRecipe.title}</h3>
                <button 
                  onClick={closeRecipeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-6">
                      <img 
                        src={selectedRecipe.image_url || selectedRecipe.image || `/src/assets/images/${selectedRecipe.name || selectedRecipe.title || 'Vegetable Pasta'}.png`}
                        alt={selectedRecipe.name || selectedRecipe.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          // Try to find a matching image in assets based on recipe name
                          const recipeName = selectedRecipe.name || selectedRecipe.title;
                          if (recipeName) {
                            e.target.src = `/src/assets/images/${recipeName}.png`;
                          } else {
                            e.target.src = `/src/assets/images/Vegetable Pasta.png`;
                          }
                        }}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-2">Description</h4>
                      <p className="text-gray-700">{selectedRecipe.description || 'A delicious recipe perfect for any occasion.'}</p>
                      
                      {/* Instructions on back of card */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-1">Instructions:</h5>
                        <ol className="text-sm list-decimal list-inside">
                          {(selectedRecipe.steps && selectedRecipe.steps.length > 0) ? 
                            selectedRecipe.steps.slice(0, 3).map((step, i) => (
                              <li key={i} className="text-xs mb-1">
                                {typeof step === 'string' ? step : step.description}
                              </li>
                            )) : 
                            <li>Instructions not available</li>
                          }
                          {(selectedRecipe.steps && selectedRecipe.steps.length > 3) && (
                            <li className="italic text-xs">...and {selectedRecipe.steps.length - 3} more steps</li>
                          )}
                        </ol>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-1">Ingredients:</h5>
                        <ul className="text-sm list-disc list-inside">
                          {(selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0) ? 
                            selectedRecipe.ingredients.slice(0, 3).map((ingredient, i) => (
                              <li key={i} className="truncate">
                                {typeof ingredient === 'string' ? ingredient : ingredient.name}
                              </li>
                            )) : 
                            <li>Ingredients not available</li>
                          }
                          {(selectedRecipe.ingredients && selectedRecipe.ingredients.length > 3) && (
                            <li className="italic">...and {selectedRecipe.ingredients.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1">Cookware Needed:</h5>
                        <ul className="text-sm list-disc list-inside">
                          {(selectedRecipe.required_cookware && selectedRecipe.required_cookware.length > 0) ? 
                            selectedRecipe.required_cookware.slice(0, 2).map((item, i) => (
                              <li key={i} className="truncate">
                                {typeof item === 'string' ? item : item.name}
                              </li>
                            )) : 
                            <li>Basic kitchen equipment</li>
                          }
                          {(selectedRecipe.required_cookware && selectedRecipe.required_cookware.length > 2) && (
                            <li className="italic">...and {selectedRecipe.required_cookware.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div>
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-2">Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Prep Time</p>
                          <p className="font-medium">{selectedRecipe.prep_time || selectedRecipe.prepTime || 15} mins</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Cook Time</p>
                          <p className="font-medium">{selectedRecipe.cook_time || selectedRecipe.cookTime || 30} mins</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Difficulty</p>
                          <p className="font-medium">{selectedRecipe.difficulty || 'Medium'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rating</p>
                          <div className="flex text-retro-yellow">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < (selectedRecipe.rating || 4) ? 'text-retro-yellow' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-2">Ingredients</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {(selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0) ? 
                          selectedRecipe.ingredients.map((ingredient, i) => (
                            <li key={i}>
                              {typeof ingredient === 'string' ? ingredient : ingredient.name}
                              {typeof ingredient !== 'string' && ingredient.quantity && ingredient.unit && 
                                ` (${ingredient.quantity} ${ingredient.unit})`
                              }
                            </li>
                          )) : 
                          <li>Ingredients not available</li>
                        }
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-2">Cookware Needed</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {(selectedRecipe.required_cookware && selectedRecipe.required_cookware.length > 0) ? 
                          selectedRecipe.required_cookware.map((item, i) => (
                            <li key={i}>
                              {typeof item === 'string' ? item : item.name}
                            </li>
                          )) : 
                          <li>Basic kitchen equipment</li>
                        }
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg mb-2">Instructions</h4>
                      <ol className="list-decimal list-inside space-y-3">
                        {(selectedRecipe.steps && selectedRecipe.steps.length > 0) ? 
                          selectedRecipe.steps.map((step, i) => (
                            <li key={i} className="pl-2">
                              <span className="font-medium">Step {i+1}:</span>{' '}
                              {typeof step === 'string' ? step : step.description}
                            </li>
                          )) : 
                          <li>Instructions not available</li>
                        }
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="border-t p-4 flex justify-between">
                <button 
                  onClick={closeRecipeModal}
                  className="retro-button-sm"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    const recipeWithImage = {
                      ...selectedRecipe,
                      image_url: `/src/assets/images/${selectedRecipe.name || selectedRecipe.title || 'Vegetable Pasta'}.png`
                    };
                    setRecipeToAdd(recipeWithImage);
                    setShowCollectionModal(true);
                    closeRecipeModal();
                  }}
                  className="retro-button-sm bg-retro-yellow hover:bg-yellow-600"
                >
                  Add to Cookbook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Collection Selection Modal */}
      {showCollectionModal && recipeToAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-retro text-2xl text-retro-red">Add to Collection</h3>
              <button 
                onClick={() => {
                  setShowCollectionModal(false);
                  setRecipeToAdd(null);
                  setSelectedCollection('');
                  setNewCollectionName('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Add <span className="font-medium">{recipeToAdd.name || recipeToAdd.title}</span> to your cookbook and select a collection:
              </p>
              
              <div className="mb-4">
                <select
                  className="retro-input w-full py-2 px-3"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  <option value="">Select a collection...</option>
                  <option value="favorites">Favorites</option>
                  {collections
                    .filter(c => c.id !== 'all' && c.id !== 'favorites')
                    .map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  <option value="__new__">+ Create new collection</option>
                </select>
              </div>
              
              {selectedCollection === '__new__' && (
                <div className="mb-4">
                  <label htmlFor="newCollectionName" className="block text-gray-700 text-sm font-bold mb-2">
                    New Collection Name
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
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowCollectionModal(false);
                  setRecipeToAdd(null);
                  setSelectedCollection('');
                  setNewCollectionName('');
                }}
                className="retro-button mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // First add the recipe to the cookbook
                  addToCookbook(recipeToAdd).then(result => {
                    if (result.success) {
                      if (selectedCollection === '__new__' && newCollectionName.trim()) {
                        // Create a new collection and add the recipe to it
                        createCollection(newCollectionName).then(collectionResult => {
                          if (collectionResult.success && collectionResult.collectionId) {
                            // Add the recipe to the new collection
                            toggleRecipeInCollection(recipeToAdd.id, collectionResult.collectionId);
                          }
                        });
                      } else if (selectedCollection && selectedCollection !== 'all') {
                        // Add the recipe to the selected collection
                        toggleRecipeInCollection(recipeToAdd.id, selectedCollection);
                      }
                      
                      // Show a success message
                      alert('Recipe added to cookbook!');
                    } else {
                      // Show an error message
                      alert(result.message || 'Failed to add recipe to cookbook');
                    }
                  }).catch(error => {
                    console.error('Error adding recipe to cookbook:', error);
                    alert('An error occurred while adding the recipe to cookbook');
                  });
                  
                  // Close the modal
                  setShowCollectionModal(false);
                  setRecipeToAdd(null);
                  setSelectedCollection('');
                  setNewCollectionName('');
                }}
                className="retro-button bg-retro-green text-white"
                disabled={selectedCollection === '__new__' && !newCollectionName.trim()}
              >
                Add to Cookbook
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chef Freddie */}
      <div className="mt-8">
        <ChefFreddie 
          currentPage="kitchen" 
          contextData={{
            ingredients,
            cookware,
            matchedRecipes,
            ingredientCount: ingredients.length,
            cookwareCount: cookware?.length || 0,
            scanningActive: showCamera
          }} 
        />
      </div>
    </Layout>
  );
};

export default Kitchen;
