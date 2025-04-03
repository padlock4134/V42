import React from 'react';
import { useChefFreddie } from '../contexts/ChefFreddieContext';

/**
 * ChefQuoteOfTheDay component displays the daily chef quote with caricature
 * This component can be reused across different pages
 */
const ChefQuoteOfTheDay = ({ className = "" }) => {
  const { chefQuote = { 
    chef: 'Chef Freddie', 
    quote: 'Cooking is like love. It should be entered into with abandon or not at all.', 
    image: '/assets/chef-caricatures/placeholder.svg' 
  }} = useChefFreddie() || {};
  
  const { chef, quote, image } = chefQuote;

  return (
    <div className={`bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6 ${className}`}>
      <h2 className="font-retro text-2xl mb-4 border-b-4 border-retro-yellow pb-2">
        Chef Quote of the Day
      </h2>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-32 h-32 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
          <img 
            src={image} 
            alt={chef} 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/chef-caricatures/placeholder.svg';
            }}
          />
        </div>
        <div>
          <blockquote className="text-xl italic font-medium text-gray-800 mb-2">
            "{quote}"
          </blockquote>
          <cite className="text-right block font-bold text-retro-red">— {chef}</cite>
        </div>
      </div>
    </div>
  );
};

export default ChefQuoteOfTheDay;
