import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    
    // Redirect to the home page
    navigate('/');
  }, [navigate]);
  
  // This component doesn't render anything
  return null;
};

export default Logout;