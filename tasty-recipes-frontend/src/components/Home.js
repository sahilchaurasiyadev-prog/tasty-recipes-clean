import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="my-5">
      <Card className="text-center p-5 shadow-sm">
        <Card.Body>
          <h1 className="mb-4">Welcome to Recipe Generator</h1>
          <Card.Text className="mb-4">
            Generate delicious recipes based on ingredients you have at home and your dietary preferences.
            Save your favorite recipes and access them anytime!
          </Card.Text>
          <Button as={Link} to="/recipe-search" variant="primary" size="lg">
            Generate a Recipe
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;