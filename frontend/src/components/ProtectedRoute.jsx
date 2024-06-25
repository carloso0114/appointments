import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode, InvalidTokenError } from 'jwt-decode';

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let userRole = '';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAuthenticated = true;
      userRole = decodedToken.role;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.error('Invalid token:', error.message);
      } else {
        console.error('Error decoding token:', error);
      }
      isAuthenticated = false;
    }
  }

  if (isAuthenticated && allowedRoles.includes(userRole)) {
    return <Component />
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
