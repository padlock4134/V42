import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate SQL update statements for recipes to add three-level tagging for cookware
 */
async function generateRecipeUpdateSQL() {
  try {
    console.log('Starting to generate SQL update statements for recipes...');
    
    // Check Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      return;
    }
    
    console.log('Connected to Supabase successfully');
    
    // Get all recipes
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*');
    
    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      return;
    }
    
    console.log(`Found ${recipes.length} recipes to process`);
    
    // Define the three-level tagging structure for cookware
    const cookwareTagStructure = {
      pots: ['stock', 'sauce', 'dutch', 'pressure', 'slow', 'multi'],
      pans: ['frying', 'saute', 'grill', 'griddle', 'wok', 'crepe'],
      bakeware: ['sheet', 'cake', 'muffin', 'loaf', 'casserole', 'pie'],
      utensils: ['spatula', 'whisk', 'tongs', 'ladle', 'spoon', 'turner'],
      appliances: ['blender', 'mixer', 'processor', 'toaster', 'microwave', 'airfryer'],
      knives: ['chef', 'paring', 'bread', 'utility', 'santoku', 'cleaver']
    };
    
    // Helper function to check if a cookware contains a specific term
    function cookwareContains(cookware, term) {
      return cookware.toLowerCase().includes(term.toLowerCase());
    }
    
    // Generate SQL statements
    let sqlStatements = `-- SQL update statements for recipes with three-level tagging for cookware\n`;
    sqlStatements += `-- Generated on ${new Date().toISOString()}\n\n`;
    
    // Add a transaction wrapper
    sqlStatements += `BEGIN;\n\n`;
    
    // Process each recipe
    for (const recipe of recipes) {
      const detailedTags = {
        cookware_category: [],
        cookware_type: [],
        cookware_variety: []
      };
      
      // Process required cookware
      if (Array.isArray(recipe.required_cookware) && recipe.required_cookware.length > 0) {
        detailedTags.cookware_category.push('cookware');
        
        recipe.required_cookware.forEach(cookware => {
          // Determine cookware type
          for (const [type, varieties] of Object.entries(cookwareTagStructure)) {
            if (cookwareContains(cookware, type) || 
                (type === 'pots' && (cookwareContains(cookware, 'pot') || cookwareContains(cookware, 'dutch') || cookwareContains(cookware, 'cooker'))) ||
                (type === 'pans' && (cookwareContains(cookware, 'pan') || cookwareContains(cookware, 'skillet'))) ||
                (type === 'bakeware' && (cookwareContains(cookware, 'dish') || cookwareContains(cookware, 'sheet') || cookwareContains(cookware, 'tin'))) ||
                (type === 'utensils' && (cookwareContains(cookware, 'spoon') || cookwareContains(cookware, 'spatula') || cookwareContains(cookware, 'tongs'))) ||
                (type === 'appliances' && (cookwareContains(cookware, 'blender') || cookwareContains(cookware, 'processor') || cookwareContains(cookware, 'mixer'))) ||
                (type === 'knives' && (cookwareContains(cookware, 'knife') || cookwareContains(cookware, 'cutter')))) {
              
              if (!detailedTags.cookware_type.includes(type)) {
                detailedTags.cookware_type.push(type);
              }
              
              // Determine cookware variety
              for (const variety of varieties) {
                if (cookwareContains(cookware, variety)) {
                  if (!detailedTags.cookware_variety.includes(variety)) {
                    detailedTags.cookware_variety.push(variety);
                  }
                  break;
                }
              }
              break;
            }
          }
        });
      }
      
      // Only generate SQL if we have tags to update
      if (detailedTags.cookware_category.length > 0 || 
          detailedTags.cookware_type.length > 0 || 
          detailedTags.cookware_variety.length > 0) {
        
        // Format arrays for SQL
        const formatArray = (arr) => `ARRAY[${arr.map(item => `'${item}'`).join(', ')}]`;
        
        // Generate SQL update statement
        sqlStatements += `-- Recipe: ${recipe.name || recipe.id}\n`;
        sqlStatements += `UPDATE recipes SET\n`;
        
        const updates = [];
        if (detailedTags.cookware_category.length > 0) {
          updates.push(`  cookware_category = ${formatArray(detailedTags.cookware_category)}`);
        }
        if (detailedTags.cookware_type.length > 0) {
          updates.push(`  cookware_type = ${formatArray(detailedTags.cookware_type)}`);
        }
        if (detailedTags.cookware_variety.length > 0) {
          updates.push(`  cookware_variety = ${formatArray(detailedTags.cookware_variety)}`);
        }
        
        sqlStatements += updates.join(',\n');
        sqlStatements += `\nWHERE id = '${recipe.id}';\n\n`;
      }
    }
    
    // Close the transaction
    sqlStatements += `COMMIT;\n`;
    
    // Write SQL to file
    const outputPath = path.join(process.cwd(), 'scripts', 'recipe-cookware-updates.sql');
    fs.writeFileSync(outputPath, sqlStatements);
    
    console.log(`SQL update statements generated and saved to: ${outputPath}`);
    console.log('You can now run these statements in the Supabase SQL editor');
  } catch (error) {
    console.error('Error generating SQL update statements:', error);
  }
}

// Run the function
generateRecipeUpdateSQL();
