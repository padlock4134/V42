import { createContext, useState, useContext, useEffect } from 'react';
import { getTodaysChefQuote } from '../data/chefQuotes';

const ChefFreddieContext = createContext();

export const useChefFreddie = () => useContext(ChefFreddieContext);

export const ChefFreddieProvider = ({ children }) => {
  // State for Chef Freddie interactions
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptsRemaining, setPromptsRemaining] = useState(10); // Default daily limit
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dailyTip, setDailyTip] = useState('Always preheat your oven for at least 10 minutes before baking for consistent results.');
  const [chefQuote, setChefQuote] = useState({
    chef: 'Unknown Chef',
    quote: 'Cooking is like love. It should be entered into with abandon or not at all.',
    image: '/assets/chef-caricatures/julia-child.svg'
  });
  
  // User preferences
  const [userPreferences, setUserPreferences] = useState({
    // Add user preferences properties here
  });

  // Load Chef Freddie data from localStorage on mount
  useEffect(() => {
    const loadChefFreddieData = () => {
      const savedConversations = localStorage.getItem('porkchop_chef_conversations');
      const savedPromptsRemaining = localStorage.getItem('porkchop_prompts_remaining');
      const lastResetDate = localStorage.getItem('porkchop_prompts_reset_date');
      
      // Check if we need to reset daily prompts
      const today = new Date().toDateString();
      if (lastResetDate !== today) {
        setPromptsRemaining(10);
        localStorage.setItem('porkchop_prompts_remaining', '10');
        localStorage.setItem('porkchop_prompts_reset_date', today);
        
        // Get a new chef quote for the day
        const todaysQuote = getTodaysChefQuote();
        setChefQuote(todaysQuote);
        localStorage.setItem('porkchop_chef_quote', JSON.stringify(todaysQuote));
      } else if (savedPromptsRemaining) {
        setPromptsRemaining(parseInt(savedPromptsRemaining));
        
        // Load saved chef quote if available
        const savedChefQuote = localStorage.getItem('porkchop_chef_quote');
        if (savedChefQuote) {
          setChefQuote(JSON.parse(savedChefQuote));
        } else {
          // If no saved quote, get today's quote
          const todaysQuote = getTodaysChefQuote();
          setChefQuote(todaysQuote);
          localStorage.setItem('porkchop_chef_quote', JSON.stringify(todaysQuote));
        }
      }
      
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
      
      // Set daily tip
      generateDailyTip();
    };

    loadChefFreddieData();
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('porkchop_chef_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save prompts remaining to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('porkchop_prompts_remaining', promptsRemaining.toString());
  }, [promptsRemaining]);

  // Generate a daily cooking tip
  const generateDailyTip = () => {
    const tips = [
      "Always read the entire recipe before you start cooking.",
      "Keep a bowl of cold water next to your cutting board to prevent your eyes from watering when cutting onions.",
      "Salt your pasta water until it tastes like the sea for perfectly seasoned pasta.",
      "Let meat rest after cooking to allow juices to redistribute.",
      "Sharpen your knives regularly for safer and more efficient cutting.",
      "Room temperature ingredients blend better than cold ones.",
      "Mise en place (preparing all ingredients before cooking) makes cooking less stressful.",
      "Don't overcrowd the pan when sautéing or food will steam instead of brown.",
      "Pat meat dry before searing for a better crust.",
      "Add acid (lemon juice, vinegar) to brighten flavors in almost any dish."
    ];
    
    // Get today's date as a number to use as an index
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Use the day of year to select a tip
    const tipIndex = dayOfYear % tips.length;
    setDailyTip(tips[tipIndex]);
  };

  // Ask Chef Freddie a question
  const askChefFreddie = async (question, currentContext = {}) => {
    // Check if user has prompts remaining
    if (promptsRemaining <= 0) {
      return {
        success: false,
        message: "You've reached your daily limit of 10 questions to Chef Freddie. Come back tomorrow for more cooking guidance!"
      };
    }
    
    setIsLoading(true);
    
    try {
      // Decrement prompts remaining
      setPromptsRemaining(prev => prev - 1);
      
      // This would be replaced with an actual API call to Claude Haiku 3.5
      // For now, we'll simulate with mock responses
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a response based on the question and context
      let response = "";
      
      if (question.toLowerCase().includes("temperature")) {
        response = "For perfect doneness, chicken should reach an internal temperature of 165°F (74°C), beef steaks medium-rare at 135°F (57°C), and fish at 145°F (63°C). Always use a meat thermometer for precision!";
      } else if (question.toLowerCase().includes("substitute")) {
        response = "No buttermilk? No problem! Mix 1 cup of milk with 1 tablespoon of lemon juice or vinegar and let it sit for 5 minutes. This works perfectly in most recipes calling for buttermilk.";
      } else if (question.toLowerCase().includes("knife")) {
        response = "Madonna mia! The knife is the extension of your hand in the kitchen! Keep it sharp—a dull knife is dangerous, capisce? Rock the blade forward when chopping herbs for the finest cut. For perfect slices, draw the knife back toward you in one smooth motion.";
      } else {
        response = "That's a great cooking question! The key is to trust your instincts but follow the fundamentals. Remember, cooking is part science, part art. Start with quality ingredients, understand your heat source, and taste as you go. That's how we did it in the old country!";
      }
      
      // Add the conversation to the history
      const newConversation = {
        id: `conv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        question,
        response,
        context: currentContext
      };
      
      setConversations(prev => [newConversation, ...prev]);
      
      return {
        success: true,
        response,
        promptsRemaining: promptsRemaining - 1
      };
    } catch (error) {
      console.error('Error asking Chef Freddie:', error);
      return {
        success: false,
        message: "Chef Freddie is having trouble right now. Please try again later."
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Get suggested prompts based on current context
  const getSuggestedPrompts = (context) => {
    // Default prompts
    const defaultPrompts = [
      "How do I know when it's done?",
      "What can I substitute for...",
      "Help! My dish is too..."
    ];
    
    // Context-specific prompts
    if (context.page === 'kitchen') {
      return [
        "How to store these ingredients?",
        "What dishes can I make?",
        "How fresh are these items?"
      ];
    } else if (context.page === 'recipe') {
      return [
        "Can I make substitutions?",
        "What technique is best for this?",
        "How to adjust portions?"
      ];
    } else if (context.page === 'cooking') {
      return [
        "What's the right temperature?",
        "How do I fix this texture?",
        "When is it perfectly done?"
      ];
    } else if (context.page === 'marketplace') {
      return [
        "How to choose fresh produce?",
        "What to look for in a local butcher?",
        "Benefits of buying from local farmers?"
      ];
    } else if (context.page === 'chefs-corner') {
      return [
        "Tips for sharing recipes?",
        "How to join cooking communities?",
        "What makes a recipe worth sharing?"
      ];
    } else if (context.page === 'cookbook') {
      return [
        "How to organize my recipes?",
        "Tips for meal planning?",
        "How to adapt recipes to my taste?"
      ];
    }
    
    return defaultPrompts;
  };

  // Clear conversation history
  const clearConversations = () => {
    setConversations([]);
  };

  // Update user preferences
  const updateUserPreferences = (newPreferences) => {
    setUserPreferences(newPreferences);
  };

  // Return context values
  return (
    <ChefFreddieContext.Provider
      value={{
        askChefFreddie,
        getSuggestedPrompts,
        isLoading,
        promptsRemaining,
        userPreferences,
        updateUserPreferences,
        conversationHistory,
        isExpanded,
        setIsExpanded,
        dailyTip,
        chefQuote
      }}
    >
      {children}
    </ChefFreddieContext.Provider>
  );
};

export default ChefFreddieContext;
