import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { predefinedRecipes } from '../components/predefinedRecipes';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        
        // First check predefined recipes
        const predefined = predefinedRecipes.find(r => r._id === id);
        if (predefined) {
          setRecipe(predefined);
          setLoading(false);
          return;
        }

        // If not predefined, check database
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/recipes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (response.data) {
          setRecipe(response.data);
        } else {
          throw new Error('Recipe not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Recipe not found');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading recipe...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Header>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            &larr; Back
          </Button>
        </Card.Header>
        <Card.Body>
          <Card.Title as="h2">{recipe.title}</Card.Title>
          
          <div className="mb-3 text-muted">
            <strong>Cooking Time:</strong> {recipe.cookingTime} | 
            <strong> Difficulty:</strong> {recipe.difficulty}
          </div>
          
          <h4>Ingredients</h4>
          <ListGroup className="mb-4">
            {recipe.ingredients.map((ingredient, index) => (
              <ListGroup.Item key={index}>{ingredient}</ListGroup.Item>
            ))}
          </ListGroup>
          
          <h4>Instructions</h4>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecipeDetail;