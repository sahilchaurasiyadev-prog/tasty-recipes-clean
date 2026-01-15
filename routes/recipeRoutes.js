const express = require('express');
const router = express.Router();

const { generateRecipe } = require('../services/huggingFaceService'); // Gemini service
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

/**
 * POST /api/recipes/generate-recipe
 * Generates a recipe using Gemini (JSON-only output),
 * saves it to MongoDB, and returns it.
 */
router.post('/generate-recipe', async (req, res) => {
  const { ingredients, dietaryPreferences } = req.body;

  try {
    // Call Gemini service
    const generatedRecipeText = await generateRecipe(
      ingredients,
      dietaryPreferences
    );

    if (!generatedRecipeText) {
      return res.status(500).json({
        message: 'Failed to generate recipe'
      });
    }

    let parsedRecipe;

    // ✅ STRICT JSON PARSING
    try {
      parsedRecipe = JSON.parse(generatedRecipeText);
    } catch (err) {
      console.error('❌ AI returned invalid JSON:\n', generatedRecipeText);
      return res.status(500).json({
        message: 'AI returned invalid JSON format'
      });
    }

    // Basic safety defaults (prevents frontend crashes)
    parsedRecipe.title ||= 'Untitled Recipe';
    parsedRecipe.ingredients ||= [];
    parsedRecipe.instructions ||= [];
    parsedRecipe.cookingTime ||= 'Not specified';
    parsedRecipe.difficulty ||= 'Not specified';
    parsedRecipe.nutritionalInfo ||= 'Not specified';

    // Save to database
    const newRecipe = new Recipe(parsedRecipe);
    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);

  } catch (error) {
    console.error('❌ Error generating recipe:', error);
    res.status(500).json({
      message: 'Error generating recipe',
      error: error.message
    });
  }
});

/**
 * POST /api/recipes/save-recipe
 * Saves a recipe manually (from frontend).
 */
router.post('/save-recipe', async (req, res) => {
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    difficulty,
    nutritionalInfo
  } = req.body;

  try {
    const existingRecipe = await Recipe.findOne({ title });

    if (existingRecipe) {
      return res.status(200).json({
        message: 'Recipe already exists in your collection!',
        recipe: existingRecipe
      });
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      nutritionalInfo
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json({
      message: 'Recipe saved successfully!',
      recipe: savedRecipe
    });

  } catch (error) {
    console.error('❌ Error saving recipe:', error);
    res.status(500).json({
      message: 'Error saving recipe',
      error: error.message
    });
  }
});

/**
 * GET /api/recipes/saved-recipes
 * Fetch all saved recipes.
 */
router.get('/saved-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error('❌ Error fetching saved recipes:', error);
    res.status(500).json({
      message: 'Failed to fetch saved recipes'
    });
  }
});

/**
 * GET /api/recipes/:id
 * Fetch a single recipe by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);

  } catch (error) {
    console.error('❌ Error fetching recipe:', error);
    res.status(500).json({
      message: 'Failed to fetch recipe'
    });
  }
});

/**
 * DELETE /api/recipes/:id
 * Delete a recipe.
 */
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting recipe:', error);
    res.status(500).json({
      message: 'Failed to delete recipe'
    });
  }
});

module.exports = router;
