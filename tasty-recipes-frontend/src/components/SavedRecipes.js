import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ message: '', type: '' });

  
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    fetchSavedRecipes();
  }, [userId]);


  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct endpoint and JWT auth
      const response = await axios.get('/api/users/saved-recipes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Assuming the backend returns the user's favorites array
      setSavedRecipes(response.data.favorites || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load saved recipes. Please log in and try again.'
      );
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`/api/recipes/saved-recipes/${userId}/${recipeId}`);
      
      // Update the UI by removing the deleted recipe
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
      
      // Show success message
      setDeleteStatus({
        message: 'Recipe removed from your collection',
        type: 'success'
      });
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setDeleteStatus({
        message: 'Failed to remove recipe. Please try again.',
        type: 'danger'
      });
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }


return (
  <Container className="my-4">
    <h2 className="mb-4">My Saved Recipes</h2>
    
    {loading ? (
      <Spinner animation="border" />
    ) : error ? (
      <Alert variant="danger">{error}</Alert>
    ) : savedRecipes.length === 0 ? (
      <Alert variant="info">No saved recipes yet. Save some first!</Alert>
    ) : (
      <Row xs={1} md={2} lg={3} className="g-4">
        {savedRecipes.map((recipe) => (
          <Col key={recipe._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {recipe.cookingTime} | {recipe.difficulty}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Ingredients:</strong> {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 && '...'}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white">
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleUnsaveRecipe(recipe._id)}
                >
                  Unsave
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    )}
  </Container>
);
}
export default SavedRecipes;