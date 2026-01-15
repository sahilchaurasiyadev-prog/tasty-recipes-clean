import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import RecipeDetail from './components/RecipeDetails';
import HomePage from './components/Home';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';
import RecipeSearch from './components/RecipeSearch';
import Favorites from './components/Favorites';
import BrowseRecipes from './components/BrowseRecipes';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Container fluid className="app-container p-0">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe-search" element={<RecipeSearch />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/browse" element={<BrowseRecipes />} />
            
            {/* Protected routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-recipes" 
              element={
                <ProtectedRoute>
                  <div>My Recipes Page</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <div>Favorites Page</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;