# PorkChop - Your Retro Cooking Companion

PorkChop is a comprehensive cooking app with a delightful 1950s retro aesthetic. It helps home cooks manage ingredients, discover recipes, connect with the cooking community, and access local food suppliers.

## Features

- **What's in My Kitchen**: Scan or manually add ingredients and find matching recipes
- **My Cookbook**: Save and organize favorite recipes with personal notes
- **Chef's Corner**: Share recipes, watch tutorials, and borrow ingredients from neighbors
- **The Grange Marketplace**: Connect with local food suppliers (coming soon)
- **Chef Freddie AI Assistant**: Get cooking tips and answers to your culinary questions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/porkchop.git
cd porkchop
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Building for Production

To build the app for production, run:
```
npm run build
```

This will create a `dist` directory with the production-ready files.

### Deploying to Netlify

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)

2. Install the Netlify CLI:
```
npm install -g netlify-cli
```

3. Login to your Netlify account:
```
netlify login
```

4. Initialize a new Netlify site:
```
netlify init
```

5. Follow the prompts to set up your site:
   - Select "Create & configure a new site"
   - Choose your team
   - Provide a site name (or leave blank for a random name)
   - Build command: `npm run build`
   - Directory to deploy: `dist`

6. Deploy your site:
```
netlify deploy --prod
```

7. Your site will be live at the URL provided by Netlify!

### Alternative Deployment Options

- **GitHub Pages**: Perfect for static sites
- **Vercel**: Great for React applications with serverless functions
- **Firebase Hosting**: Good option if you're using other Firebase services

## Tech Stack

- **React**: Core library for building the UI
- **Vite**: Build tool for fast development
- **Tailwind CSS**: CSS framework for styling with a 1950s retro aesthetic
- **React Router**: For navigation between pages

## Accessibility Features

PorkChop is designed with accessibility in mind:
- Dyslexic font option
- High contrast mode
- Customizable text sizes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by vintage cookbooks and the warm, community-oriented cooking culture of the 1950s
- Special thanks to all the home cooks who shared their feedback during development
