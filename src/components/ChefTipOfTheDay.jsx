import { useState, useEffect } from 'react';
import { getTodaysChefTip } from '../data/chefTips';

const ChefTipOfTheDay = () => {
  const [tip, setTip] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get today's tip
    const todaysTip = getTodaysChefTip();
    setTip(todaysTip);

    // Check if we've shown the tip today
    const lastShownDate = localStorage.getItem('chefTipLastShown');
    const today = new Date().toDateString();
    
    // Reset viewed status at midnight
    if (lastShownDate !== today) {
      localStorage.setItem('chefTipViewed', 'false');
    }
    
    // Check if the tip has been viewed today
    const tipViewed = localStorage.getItem('chefTipViewed') === 'true';
    if (!tipViewed) {
      // Auto-show the tip if it hasn't been viewed today
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Mark the tip as viewed for today
    localStorage.setItem('chefTipViewed', 'true');
    localStorage.setItem('chefTipLastShown', new Date().toDateString());
  };

  return (
    <>
      {/* Tip Button */}
      <button 
        onClick={handleOpen}
        className="flex items-center px-3 py-2 rounded-retro text-sm font-medium hover:bg-retro-mint transition-colors"
        title="Chef Tip of the Day"
      >
        <span className="mr-1">💡</span>
        Chef Tip
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-retro border-4 border-gray-800 p-6 max-w-md mx-auto shadow-retro z-10">
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-retro-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="font-retro text-xl mb-2">Chef Tip of the Day</h3>
              <p className="text-lg mb-4">{tip}</p>
              <button 
                onClick={handleClose}
                className="retro-button bg-retro-green text-white"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChefTipOfTheDay;
