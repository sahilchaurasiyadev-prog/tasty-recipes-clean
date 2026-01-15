import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Create this file for custom styles

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavLinkClass = (path) => 
    location.pathname === path ? 'active-nav-link' : '';

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect>
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="brand-icon">🍳</span>
          <span className="ms-2">Tasty Recipes</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="main-navbar" className="border-0" />
        
        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={getNavLinkClass('/')}
            >
              Home
            </Nav.Link>
            
            <Nav.Link as={Link} to="/browse">Browse Recipes</Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/my-recipes" 
                  className={getNavLinkClass('/my-recipes')}
                >
                  My Recipes
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/favorites" 
                  className={getNavLinkClass('/favorites')}
                >
                  Favorites
                </Nav.Link>

                
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <>
                    <span className="visually-hidden">User menu</span>
                    {currentUser?.username || 'Account'}
                  </>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex">
                <Button 
                  variant="outline-light" 
                  className="me-2"
                  onClick={() => navigate('/login')}
                  aria-label="Login"
                >
                  Log In
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => navigate('/register')}
                  aria-label="Register"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;