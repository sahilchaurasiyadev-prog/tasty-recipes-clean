import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/users/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Handle both response structures
        const favoritesData = response.data?.favorites || response.data || [];
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // ... (keep your existing loading and error rendering) ...

  return (
    <Container className="my-4">
      <h2 className="mb-4">My Favorite Recipes</h2>
      
      {favorites.length === 0 ? (
        <Alert variant="info">
          You haven't saved any recipes yet. 
          <Link to="/recipe-search" className="ms-2">Browse recipes</Link>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {favorites.map((recipe) => (
            <Col key={recipe._id}>
              <Card className="h-100">
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
                <Card.Footer>
                  <Button 
                    as={Link} 
                    to={`/recipe/${recipe._id}`}
                    variant="primary"
                    size="sm"
                    onClick={() => console.log('Viewing recipe:', recipe._id)} // Debugging
                  >
                    View Recipe
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;