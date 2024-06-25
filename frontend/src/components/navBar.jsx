import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode, InvalidTokenError } from 'jwt-decode';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  let username = '';
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.username;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return (
    <nav>
      <div>
        {token && (
          <>
            <span>Welcome, {username}</span> <hr />
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
