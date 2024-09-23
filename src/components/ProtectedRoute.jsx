import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext'; // Adjust the path if needed
import Auth from '../utils/auth';

const ProtectedRoute = ({ element }) => {
  const { accesToken, authLoading, user  } = useContext(AuthContext);
  if (authLoading) return null;

    // Check if user exists or if the access token is valid
    if (user || (accesToken && !Auth.isTokenExpired(accesToken))) {
        return element;
    } else {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
