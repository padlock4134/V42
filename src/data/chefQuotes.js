/**
 * Chef Quotes System
 * 
 * This file contains a collection of quotes from famous chefs along with their caricatures.
 * The system rotates through quotes based on the day of the year, resetting at midnight.
 */

// Import path to chef caricatures
const CHEF_CARICATURE_PATH = '/assets/chef-caricatures';

// Collection of chefs with their quotes and image paths
const chefQuotes = [
  {
    chef: "Julia Child",
    image: `${CHEF_CARICATURE_PATH}/julia-child.svg`,
    quotes: [
      "The only real stumbling block is fear of failure. In cooking you've got to have a what-the-hell attitude.",
      "Cooking is like love. It should be entered into with abandon or not at all.",
      "You don't have to cook fancy or complicated masterpieces - just good food from fresh ingredients.",
      "Find something you're passionate about and keep tremendously interested in it.",
      "The only time to eat diet food is while you're waiting for the steak to cook.",
      "I think every woman should have a blowtorch.",
      "It's so beautifully arranged on the plate - you know someone's fingers have been all over it.",
      "I enjoy cooking with wine, sometimes I even put it in the food.",
      "If you're afraid of butter, use cream.",
      "A party without cake is just a meeting.",
      "People who love to eat are always the best people.",
      "The measure of achievement is not winning awards. It's doing something that you appreciate, something you believe is worthwhile.",
      "Always remember: If you're alone in the kitchen and you drop the lamb, you can always just pick it up. Who's going to know?",
      "The secret of a happy marriage is finding the right person. You know they're right if you love to be with them all the time.",
      "I was 32 when I started cooking; up until then, I just ate.",
      "Drama is very important in life: You have to come on with a bang. You never want to go out with a whimper.",
      "In department stores, so much kitchen equipment is bought indiscriminately by people who just come in for men's underwear.",
      "Life itself is the proper binge."
    ]
  },
  {
    chef: "Gordon Ramsay",
    image: `${CHEF_CARICATURE_PATH}/gordon-ramsay.svg`,
    quotes: [
      "The minute you start compromising for the sake of massaging somebody's ego, that's it, game over.",
      "I don't like looking back. I'm always constantly looking forward. I'm not the one to sort of sit and cry over spilled milk.",
      "If you want to become a great chef, you have to work with great chefs. And that's exactly what I did.",
      "I train my chefs completely different to anyone else. My young girls and guys, when they come to the kitchen, the first thing they get is a blindfold. They get blindfolded and I make them touch and feel and taste everything.",
      "I cook, I create, I'm incredibly excited by what I do, I've still got a lot to achieve.",
      "Put your head down and work hard. Never wait for things to happen, make them happen for yourself through hard graft and not giving up.",
      "I still love football, though, and I think cooking is like football. It's not a job, it's a passion. When you become good at it, it's a dream job and financially you need never to worry. Ever.",
      "Cooking is about passion, so it may look slightly temperamental in a way that it's too assertive to the naked eye.",
      "Swearing is industry language. For as long as we're alive it's not going to change. You've got to be boisterous to get results.",
      "I don't like looking back. I'm always constantly looking forward. I'm not the one to sort of sit and cry over spilled milk.",
      "Find what's hot, find what's just opened and then look for the worst review of the week. There is so much to learn from watching a restaurant getting absolutely panned and having a bad experience. Go and see it for yourself.",
      "I act on impulse and I go with my instincts.",
      "I've had a lot of success; I've had failures, so I learn from the failure.",
      "When you cook under pressure you trade perfection.",
      "There's no bigger pain anywhere in the world than a vegetarian."
    ]
  },
  {
    chef: "Anthony Bourdain",
    image: `${CHEF_CARICATURE_PATH}/anthony-bourdain.svg`,
    quotes: [
      "Your body is not a temple, it's an amusement park. Enjoy the ride.",
      "Travel isn't always pretty. It isn't always comfortable. Sometimes it hurts, it even breaks your heart. But that's okay. The journey changes you; it should change you.",
      "Skills can be taught. Character you either have or you don't have.",
      "Good food is very often, even most often, simple food.",
      "Context and memory play powerful roles in all the truly great meals in one's life.",
      "I'm not afraid to look like an idiot.",
      "Without experimentation, a willingness to ask questions and try new things, we shall surely become static, repetitive, and moribund.",
      "You learn a lot about someone when you share a meal together.",
      "I'm a big believer in winging it. I'm a big believer that you're never going to find perfect city travel experience or the perfect meal without a constant willingness to experience a bad one.",
      "If I'm an advocate for anything, it's to move. As far as you can, as much as you can. Across the ocean, or simply across the river.",
      "The way you make an omelet reveals your character.",
      "Cooking is a craft, I like to think, and a good cook is a craftsman — not an artist.",
      "I don't have to agree with you to like you or respect you.",
      "As you move through this life and this world you change things slightly, you leave marks behind, however small.",
      "Food is everything we are. It's an extension of nationalist feeling, ethnic feeling, your personal history, your province, your region, your tribe, your grandma. It's inseparable from those from the get-go."
    ]
  },
  {
    chef: "Ina Garten",
    image: `${CHEF_CARICATURE_PATH}/ina-garten.svg`,
    quotes: [
      "Food is not about impressing people. It's about making them feel comfortable.",
      "It's so important to find what you love, and pursue it with passion.",
      "I always try to have the formula of a homemade meal, a store-bought item, and a prepared item.",
      "I try to greet my friends with a drink in my hand, a warm smile on my face, and great music in the background, because that's what gets a dinner party off to a fun start.",
      "The most important thing for having a party is that the hostess is having fun. I'm very organized. I make a plan for absolutely everything. I never have anything that has to be cooked while the guests are there.",
      "I like it when guests help in the kitchen. It makes me less lonely.",
      "I absolutely adore cooking for people. It's so much fun. I love doing it.",
      "I think the biggest mistake people make is to try and make something really complicated.",
      "Cooking is one of the great gifts you can give to those you love.",
      "The most important thing for having a party is that the hostess is having fun.",
      "Store-bought is fine.",
      "How easy is that?",
      "If it's not fun, you're not doing it right.",
      "You can be miserable before you have a cookie and you can be miserable after you eat a cookie but you can't be miserable while you are eating a cookie.",
      "Never serve anything that won't be absolutely delicious."
    ]
  },
  {
    chef: "Jamie Oliver",
    image: `${CHEF_CARICATURE_PATH}/jamie-oliver.svg`,
    quotes: [
      "My general rule is, if you're not prepared to eat it, don't feed it to your dog.",
      "Cooking is, without a doubt, one of the most important skills a person can ever learn. Once you can cook, you can spend the rest of your life learning the nuances and refining your skills.",
      "I'm probably a bit romantic about it, but I think we humans miss having contact with fire. We need it.",
      "What I've enjoyed most, though, is meeting people who have a real interest in food and sharing ideas with them. Good food is a global thing and I find that there is always something new and amazing to learn - I love it!",
      "I'm not a chef. I'm a cheeky chappy who loves food and cooking.",
      "If you only design menus that are essentially junk or fast food, the whole infrastructure supports junk.",
      "Stop being a vegan and start enjoying what you eat.",
      "The public health of five million children should not be left to luck or chance.",
      "I profoundly believe that the power of food has a primal place in our homes that binds us to the best bits of life.",
      "Cooking with kids is not just about ingredients, recipes, and cooking. It's about harnessing imagination, empowerment, and creativity.",
      "I believe that every kid in the world can be taught how to cook good food from scratch within a term of school, ten weeks.",
      "I've cooked just about everything really.",
      "Many kids can tell you about drugs but do not know what celery or courgettes taste like.",
      "I wouldn't say that processed food, ready meals and even takeaways aren't relevant to modern life, it's just that over the past 40 years there are three generations of people who have come out of school and gone through their home life without ever being shown how to cook properly.",
      "The kitchen oven is reliable, but it's made us lazy."
    ]
  }
];

/**
 * Get today's chef quote based on the day of the year
 * @returns {Object} Object containing chef name, quote, and image path
 */
export const getTodaysChefQuote = () => {
  // Get today's date and calculate day of year
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  
  // Calculate which chef to feature today
  const totalChefs = chefQuotes.length;
  const chefIndex = dayOfYear % totalChefs;
  const selectedChef = chefQuotes[chefIndex];
  
  // Calculate which quote to feature today
  const quotesForChef = selectedChef.quotes.length;
  const quoteIndex = Math.floor(dayOfYear / totalChefs) % quotesForChef;
  
  return {
    chef: selectedChef.chef,
    quote: selectedChef.quotes[quoteIndex],
    image: selectedChef.image
  };
};

/**
 * Get all chefs with their quotes
 * @returns {Array} Array of chef objects with their quotes and images
 */
export const getAllChefQuotes = () => {
  return chefQuotes;
};

/**
 * Get quotes for a specific chef
 * @param {string} chefName - Name of the chef
 * @returns {Object|null} Chef object with quotes and image, or null if not found
 */
export const getQuotesByChef = (chefName) => {
  const chef = chefQuotes.find(c => c.chef.toLowerCase() === chefName.toLowerCase());
  return chef || null;
};

/**
 * Get a random quote from any chef
 * @returns {Object} Object containing chef name, quote, and image path
 */
export const getRandomChefQuote = () => {
  const randomChefIndex = Math.floor(Math.random() * chefQuotes.length);
  const selectedChef = chefQuotes[randomChefIndex];
  const randomQuoteIndex = Math.floor(Math.random() * selectedChef.quotes.length);
  
  return {
    chef: selectedChef.chef,
    quote: selectedChef.quotes[randomQuoteIndex],
    image: selectedChef.image
  };
};
