const axios = require('axios');
const Recipe = require('./models/Recipe'); // Import your Recipe model

const fetchRecipes = async () => {
  const apiKey = 'b6e3357e6cb7451c86958162a61a0a79'; // Replace with your Spoonacular API key
  const query = 'pasta'; // Example search query
  const numberOfRecipes = 5; // Number of recipes to fetch

  try {
    // Fetch recipes from Spoonacular API
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=${numberOfRecipes}&addRecipeInformation=true`
    );

    // Log the full API response
    console.log('API Response:', response.data);

    // Extract relevant data from the API response
    const recipes = response.data.results.map((recipe) => ({
      title: recipe.title,
      ingredients: recipe.extendedIngredients.map((ingredient) => ingredient.name),
      instructions: recipe.analyzedInstructions[0]?.steps.map((step) => step.step) || [],
      dietaryPreferences: recipe.diets,
      calories: recipe.nutrition.nutrients.find((nutrient) => nutrient.name === 'Calories')?.amount || 0,
      cuisine: recipe.cuisines[0] || 'Unknown',
      cookingTime: recipe.readyInMinutes ? `${recipe.readyInMinutes} minutes` : 'Unknown',
      difficulty: 'Medium', // Spoonacular doesn't provide difficulty, so you can set a default value
    }));

    // Save fetched recipes to your MongoDB database
    await Recipe.insertMany(recipes);
    console.log('Recipes fetched and saved to the database!');
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

fetchRecipes();