import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { predefinedRecipes } from '../components/predefinedRecipes';

const BrowseRecipes = () => {
  return (
    <Container className="my-4">
      <h2 className="mb-4">Browse Recipes</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {predefinedRecipes.map(recipe => (
          <Col key={recipe._id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text className="text-muted">
                  ⏱️ {recipe.cookingTime} | ⚡ {recipe.difficulty}
                </Card.Text>
                <Card.Text>
                  <strong>Ingredients:</strong> {recipe.ingredients.slice(0, 3).join(', ')}...
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button 
                  as={Link} 
                  to={`/recipe/${recipe._id}`}
                  variant="primary"
                >
                  View Recipe
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BrowseRecipes;