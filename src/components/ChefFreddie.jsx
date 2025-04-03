import { useState, useRef, useEffect } from 'react';
import { useChefFreddie } from '../contexts/ChefFreddieContext';
import chefFreddieLogo from '../assets/chef-freddie-logo.svg';

const ChefFreddie = ({ currentPage, contextData = {}, autoExpand = false }) => {
  const [userInput, setUserInput] = useState('');
  const [currentChat, setCurrentChat] = useState([]);
  const chatContainerRef = useRef(null);
  
  const { 
    askChefFreddie, 
    getSuggestedPrompts, 
    promptsRemaining,
    isLoading,
    isExpanded,
    setIsExpanded
  } = useChefFreddie();

  // Get suggested prompts based on current page and context
  const suggestedPrompts = getSuggestedPrompts({ page: currentPage, ...contextData });

  // Auto expand only on initial login
  useEffect(() => {
    // Only auto-expand on initial login, not on every page navigation
    const hasAutoExpanded = localStorage.getItem('chef_freddie_auto_expanded');
    if (autoExpand && !isExpanded && !hasAutoExpanded) {
      setIsExpanded(true);
      localStorage.setItem('chef_freddie_auto_expanded', 'true');
    }
  }, [autoExpand, setIsExpanded, isExpanded]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim() || isLoading) return;
    
    // Add user message to chat
    setCurrentChat(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Clear input field
    setUserInput('');
    
    // Get response from Chef Freddie
    const context = { page: currentPage, ...contextData };
    const result = await askChefFreddie(userInput, context);
    
    if (result.success) {
      // Add Chef Freddie's response to chat
      setCurrentChat(prev => [...prev, { role: 'assistant', content: result.response }]);
    } else {
      // Add error message to chat
      setCurrentChat(prev => [...prev, { 
        role: 'assistant', 
        content: result.message || "Sorry, I'm having trouble responding right now. Please try again later."
      }]);
    }
  };

  const handleSuggestedPrompt = async (prompt) => {
    if (isLoading) return;
    
    // Add user message to chat
    setCurrentChat(prev => [...prev, { role: 'user', content: prompt }]);
    
    // Get response from Chef Freddie
    const context = { page: currentPage, ...contextData };
    const result = await askChefFreddie(prompt, context);
    
    if (result.success) {
      // Add Chef Freddie's response to chat
      setCurrentChat(prev => [...prev, { role: 'assistant', content: result.response }]);
    } else {
      // Add error message to chat
      setCurrentChat(prev => [...prev, { 
        role: 'assistant', 
        content: result.message || "Sorry, I'm having trouble responding right now. Please try again later."
      }]);
    }
  };

  // Clear the current chat and return to the welcome screen
  const handleBackButton = () => {
    setCurrentChat([]);
  };

  // Don't render on login or signup pages
  if (currentPage === 'login' || currentPage === 'signup' || currentPage === 'home') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isExpanded ? 'w-[420px] h-[525px]' : 'w-20 h-20'}`}>
      {/* Collapsed Chef Freddie Button */}
      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-20 h-20 rounded-full bg-retro-red border-4 border-gray-800 shadow-retro flex items-center justify-center hover:bg-retro-orange transition-colors"
          aria-label="Open Chef Freddie Assistant"
        >
          <img 
            src={chefFreddieLogo} 
            alt="Chef Freddie" 
            className="h-14 w-14"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/56';
            }}
          />
        </button>
      )}
      
      {/* Expanded Chef Freddie Chat */}
      {isExpanded && (
        <div className="w-full h-full bg-white rounded-retro border-4 border-gray-800 shadow-retro flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-retro-red p-4 flex justify-between items-center border-b-4 border-gray-800">
            <div className="flex items-center">
              <img 
                src={chefFreddieLogo} 
                alt="Chef Freddie" 
                className="h-10 w-10 mr-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
              <h3 className="font-retro text-white font-bold text-lg">Chef Freddie</h3>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close Chef Freddie"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Chat Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-retro-cream"
            style={{ minHeight: "300px" }}
          >
            {currentChat.length === 0 ? (
              <div className="text-center h-full flex flex-col justify-center py-6">
                <p className="font-retro text-gray-600 mb-4 text-lg">Welcome to Chef Freddie!</p>
                <p className="text-base text-gray-500 mb-4">Ask me anything about cooking techniques, ingredient substitutions, or troubleshooting your dishes.</p>
                {autoExpand && (
                  <div className="bg-retro-yellow p-3 rounded-md border-2 border-gray-800 max-w-md mx-auto">
                    <p className="text-sm font-bold">👋 Welcome back to your kitchen!</p>
                    <p className="text-sm mt-1">How can I help with your cooking adventures today?</p>
                  </div>
                )}
                
                {/* Suggested Prompts - Now centered in the welcome screen */}
                {suggestedPrompts.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">Try asking:</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                      {suggestedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedPrompt(prompt)}
                          className="text-sm bg-retro-yellow px-3 py-2 rounded-md border-2 border-gray-800 hover:bg-retro-orange transition-colors shadow-sm"
                          disabled={isLoading || promptsRemaining <= 0}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              currentChat.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg max-w-[85%] ${
                      message.role === 'user' 
                        ? 'bg-retro-blue text-white rounded-br-none text-base' 
                        : 'bg-white border-2 border-gray-800 rounded-bl-none text-base'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg max-w-[80%] bg-white border-2 border-gray-800 rounded-bl-none">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t-4 border-gray-800 bg-white">
            <div className="flex items-center">
              {currentChat.length > 0 && (
                <button
                  type="button"
                  onClick={handleBackButton}
                  className="mr-2.5 bg-retro-blue hover:bg-blue-700 text-white p-2.5 rounded-md border-2 border-gray-800 disabled:opacity-50"
                  aria-label="Back to start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={promptsRemaining > 0 ? "Ask Chef Freddie..." : "Daily limit reached"}
                className="flex-1 retro-input text-base p-2.5"
                disabled={isLoading || promptsRemaining <= 0}
              />
              <button
                type="submit"
                className="ml-2.5 bg-retro-red hover:bg-retro-orange text-white p-2.5 rounded-md border-2 border-gray-800 disabled:opacity-50"
                disabled={isLoading || !userInput.trim() || promptsRemaining <= 0}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-sm text-right text-gray-500">
              {promptsRemaining} questions remaining today
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChefFreddie;
