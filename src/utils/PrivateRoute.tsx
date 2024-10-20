import React from "react";
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode; // Type for children
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    const isAuthenticated = token && !isTokenExpired(token);

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Function to check if the token is expired
const isTokenExpired = (token: string) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
};

export default PrivateRoute;
