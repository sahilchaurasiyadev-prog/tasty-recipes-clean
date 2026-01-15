import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    preferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // In a real app, fetch user profile from API
    // For now, we'll use the current user from auth context and add mock data
    if (currentUser) {
      // Simulate API call
      setTimeout(() => {
        setProfile({
          username: currentUser.username || '',
          email: currentUser.email || '',
          bio: 'Food enthusiast and home cook. I love trying new recipes!',
          preferences: {
            vegetarian: false,
            vegan: false,
            glutenFree: true,
            dairyFree: false,
          },
        });
        setLoading(false);
      }, 800);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send update to API
    console.log('Updating profile:', profile);
    
    // Simulate API call success
    setTimeout(() => {
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success',
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }, 1000);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <p className="text-center">Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Profile</h1>
      
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${profile.username}&background=random&size=150`}
                  alt="Profile"
                  className="rounded-circle"
                />
              </div>
              <h3>{profile.username}</h3>
              <p className="text-muted">{profile.email}</p>
              <div className="d-grid">
                <Button variant="outline-primary">Change Photo</Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>Account Statistics</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Recipes Created:</span>
                <span className="fw-bold">12</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Recipes Saved:</span>
                <span className="fw-bold">24</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Comments:</span>
                <span className="fw-bold">8</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>Profile Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed. Contact support for assistance.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Dietary Preferences</Form.Label>
                  <div>
                    {Object.entries(profile.preferences).map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={key}
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        name={key}
                        checked={value}
                        onChange={handlePreferenceChange}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;