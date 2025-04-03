import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing. Please check your .env file.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey.substring(0, 10) + '...');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    
    // Try to fetch recipes
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }
    
    console.log(`Successfully fetched ${data.length} recipes from Supabase!`);
    
    if (data.length > 0) {
      console.log('First recipe:', {
        id: data[0].id,
        name: data[0].name || data[0].title,
        ingredients: data[0].ingredients ? (Array.isArray(data[0].ingredients) ? data[0].ingredients.length : 'Not an array') : 'None'
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
