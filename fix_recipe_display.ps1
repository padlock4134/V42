# Fix script for recipe display issues

# 1. Fix the recipe service to use the correct image paths
$recipeServicePath = "c:\Users\paddy\OneDrive\Desktop\V4\src\services\recipeService.js"
$recipeServiceContent = Get-Content $recipeServicePath -Raw

# Update the image paths in processRecipeData function
$recipeServiceContent = $recipeServiceContent -replace '`/assets/images/default-recipe.png`', '`/src/assets/images/${recipe.name || recipe.title || "Vegetable Pasta"}.png`'

# Update the CSV file paths to look in the correct location
$recipeServiceContent = $recipeServiceContent -replace "'/assets/csv/recipes_rows.csv'", "'/src/assets/csv/recipes_rows.csv', '/assets/csv/recipes_rows.csv'"

# Save the updated file
Set-Content -Path $recipeServicePath -Value $recipeServiceContent

# 2. Fix the Kitchen component to use the correct image paths
$kitchenPath = "c:\Users\paddy\OneDrive\Desktop\V4\src\pages\Kitchen.jsx"
$kitchenContent = Get-Content $kitchenPath -Raw

# Update the image paths in the recipe card
$kitchenContent = $kitchenContent -replace '`/assets/images/default-recipe.png`', '`/src/assets/images/${recipe.name || recipe.title || "Vegetable Pasta"}.png`'

# Save the updated file
Set-Content -Path $kitchenPath -Value $kitchenContent

Write-Host "Recipe display fixes applied successfully!"
