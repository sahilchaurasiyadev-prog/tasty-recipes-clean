import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedRecipe(null);
    setSaveStatus(null);
  
    try {
      const response = await axios.post('http://localhost:5000/api/recipes/generate-recipe', {
        ingredients: ingredients.split(',').map((item) => item.trim()),
        dietaryPreferences: dietaryPreferences.split(',').map((item) => item.trim()),
      });
  
      setGeneratedRecipe(response.data);
      console.log('Generated recipe:', response.data);
    } catch (error) {
      console.error('Error generating recipe:', error);
      if (error.response) {
        if (error.response.status === 500) {
          setError('The recipe service is currently unavailable. Please try again later.');
        } else {
          setError(`Error: ${error.response.data.message || 'Failed to generate recipe'}`);
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection and try again.');
      } else {
        setError(`Error: ${error.message || 'Something went wrong'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    try {
      setSaveStatus({ type: 'loading', message: 'Saving recipe...' });
      
      const response = await axios.post('http://localhost:5000/api/recipes/save-recipe', {
        title: generatedRecipe.title,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        cookingTime: generatedRecipe.cookingTime,
        difficulty: generatedRecipe.difficulty,
        nutritionalInfo: generatedRecipe.nutritionalInfo
      });
      
      setSaveStatus({ 
        type: 'success', 
        message: response.data.message 
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to save recipe. Please try again.' 
      });
    }
  };

  //new2
  const saveToFavorites = async () => {
    try {
      // Debug: Check what we're working with
      console.log('Current recipe:', generatedRecipe);
      
      if (!generatedRecipe) {
        throw new Error('No recipe generated yet');
      }
  
      const recipeId = generatedRecipe._id;
      if (!recipeId) {
        throw new Error('Recipe is missing ID - please generate again');
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to save favorites');
      }
  
      setSaveStatus({ type: 'loading', message: 'Saving to favorites...' });
      
      const response = await axios.post('http://localhost:5000/api/users/favorites', 
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSaveStatus({ 
        type: 'success', 
        message: response.data.message || 'Saved to favorites!' 
      });
    } catch (error) {
      console.error('Error saving to favorites:', error);
      setSaveStatus({
        type: 'error',
        message: error.response?.data?.message || error.message
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Generate Your Perfect Recipe</h1>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      
      {saveStatus && (
        <div className={`alert alert-${saveStatus.type === 'success' ? 'success' : saveStatus.type === 'loading' ? 'info' : 'danger'} alert-dismissible fade show`} role="alert">
          {saveStatus.type === 'loading' ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{saveStatus.message}</>
          ) : (
            <>{saveStatus.message}</>
          )}
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={() => setSaveStatus(null)}
          ></button>
        </div>
      )}
      
      <form onSubmit={handleGenerateRecipe}>
        <div className="mb-3">
          <label htmlFor="ingredients" className="form-label">
            Ingredients (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            placeholder="e.g., wheat, rice, bell pepper"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dietaryPreferences" className="form-label">
            Dietary Preferences (comma-separated, e.g., vegetarian, gluten-free)
          </label>
          <input
            type="text"
            className="form-control"
            id="dietaryPreferences"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="e.g., vegetarian, low-carb, dairy-free"
          />
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Generating Recipe...
            </>
          ) : (
            'Generate Recipe'
          )}
        </Button>
      </form>

      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Creating your recipe... This may take a moment</p>
        </div>
      )}

      {!loading && generatedRecipe && (
        <div className="mt-5 p-4 border rounded bg-light">
          <h2>{generatedRecipe.title || 'No Title'}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {generatedRecipe.ingredients?.length > 0 ? (
              generatedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))
            ) : (
              <li>No ingredients listed.</li>
            )}
          </ul>
          <h3>Instructions:</h3>
          <ol>
            {generatedRecipe.instructions?.length > 0 ? (
              generatedRecipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))
            ) : (
              <li>No instructions provided.</li>
            )}
          </ol>
          <h3>Cooking Time:</h3>
          <p>{generatedRecipe.cookingTime || 'Unknown'}</p>
          <h3>Difficulty:</h3>
          <p>{generatedRecipe.difficulty || 'Unknown'}</p>
          <h3>Nutritional Information:</h3>
          <p>{generatedRecipe.nutritionalInfo || 'Unknown'}</p>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <Button
              variant="success"
              onClick={saveRecipe}
              disabled={saveStatus?.type === 'loading'}
            >
              {saveStatus?.type === 'loading' ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-bookmark-plus me-2"></i>
                  Save Recipe
                </>
              )}
            </Button>
            
            <Button
  variant={saveStatus?.type === 'success' ? 'success' : 'primary'}
  onClick={saveToFavorites}
  disabled={!generatedRecipe?._id || saveStatus?.type === 'loading'}
  title={!generatedRecipe?._id ? 'Generate a recipe first' : 
         !localStorage.getItem('token') ? 'Please log in' : ''}
>
  {saveStatus?.type === 'loading' ? (
    <>
      <span className="spinner-border spinner-border-sm me-2"></span>
      Saving...
    </>
  ) : saveStatus?.type === 'success' ? (
    '✓ Saved!'
  ) : (
    '♡ Save to Favorites'
  )}
</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;