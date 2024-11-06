// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Для перевірки, виведіть стан автентифікації
  console.log("PrivateRoute - IsAuthenticated:", isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;