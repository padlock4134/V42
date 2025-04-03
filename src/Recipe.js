import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  image_url: String,
  ingredients: [String],
  steps: [String],
  cook_time: Number,
  prep_time: Number,
  servings: Number,
  required_cookware: [String],
  protein_tags: [String],
  veggie_tags: [String],
  herb_tags: [String],
  created_at: Date,
  updated_at: Date,
  cuisine_type: String,
  
  // Three-level tagging system for ingredients
  protein_category: [String],
  protein_type: [String],
  protein_cut: [String],
  
  veggie_category: [String],
  veggie_type: [String],
  veggie_variety: [String],
  
  pantry_category: [String],
  pantry_type: [String],
  pantry_variety: [String],
  
  dairy_category: [String],
  dairy_type: [String],
  dairy_variety: [String],
  
  fruit_category: [String],
  fruit_type: [String],
  fruit_variety: [String],
  
  // Three-level tagging system for cookware
  cookware_category: [String],
  cookware_type: [String],
  cookware_variety: [String],
  
  // Custom ingredients
  custom_ingredients: { type: mongoose.Schema.Types.Mixed, default: [] }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
