// src/context/FavoriteContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getFavoriteCountries } from '../services/api';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { token, favoritesLoading } = useAuth(); // Use AuthContext's loading state
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [error, setError] = useState(null);

  const loadFavoriteCountries = async () => {
    if (!token) return;
    
    try {
      setError(null);
      const data = await getFavoriteCountries();
      setFavoriteCountries(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadFavoriteCountries();
  }, [token]);

  return (
    <FavoriteContext.Provider value={{ 
      favoriteCountries, 
      loading: favoritesLoading, // Use the same loading state
      error,
      refreshFavorites: loadFavoriteCountries 
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);