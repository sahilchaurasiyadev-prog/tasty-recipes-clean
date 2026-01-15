import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.post('/api/users/forgot-password', { email });
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 
        'Failed to send password reset email. Please try again.'
      );
      console.error('Password reset error:', err);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow mx-auto" style={{ maxWidth: '500px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Reset Your Password</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {success ? (
            <Alert variant="success">
              <p>If an account exists with the email {email}, we've sent password reset instructions.</p>
              <p>Please check your email inbox and spam folder.</p>
              <div className="text-center mt-3">
                <Link to="/login" className="btn btn-primary">Back to Login</Link>
              </div>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
                <Form.Text className="text-muted">
                  We'll send password reset instructions to this email.
                </Form.Text>
              </Form.Group>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="py-2"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Sending...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
              
              <div className="text-center mt-3">
                <Link to="/login">Back to Login</Link>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;