// src/services/api.js
import axios from 'axios';

const API_BASE = '/api/countries';

export const getAllCountries = async (page = 1, limit = 5, keyword = '') => {
  try {
    const response = await axios.get(`/api/countries/all`, {
      params: {
        page,
        limit,
        keyword, // ✅ send selectedKeyword as query param
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching countries:', err);
    throw err;
  }
};

export const searchCountries = async (query, filterType = 'name') => {
  try {
    const endpointMap = {
      'name': `${API_BASE}/name/${query}`,
      'code': `${API_BASE}/code/${query}`,
      'language': `${API_BASE}/language/${query}`,
      'region': `${API_BASE}/region/${query}`,
      'subregion': `${API_BASE}/subregion/${query}`,
      'capital': `${API_BASE}/capital/${query}`,
      'translation': `${API_BASE}/translation/${query}`
    };

    const response = await axios.get(endpointMap[filterType]);
    return response.data;
  } catch (err) {
    console.error('Error searching countries:', err);
    throw err;
  }
};

axios.defaults.withCredentials = true;

export const getProfileImage = async () => {
  try {
    const response = await axios.get(`/api/users/profile-image`, {
      responseType: 'blob',
      withCredentials: true, // Ensure cookies are sent
    });
    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error('Profile image error:', {
      status: err.response?.status,
      message: err.message,
    });
    return null;
  }
};

// Favorites API
export const addFavorite = async (countryData) => {
  try {
    const response = await axios.post('/api/favorites', countryData);
    return response.data;
  } catch (err) {
    console.error('Error adding favorite:', err);
    throw err;
  }
};

export const removeFavorite = async (code) => {
  try {
    const response = await axios.delete(`/api/favorites/${code}`);
    return response.data;
  } catch (err) {
    console.error('Error removing favorite:', err);
    throw err;
  }
};

export const getFavorites = async () => {
  try {
    const response = await axios.get('/api/favorites');
    return response.data;
  } catch (err) {
    console.error('Error fetching favorites:', err);
    throw err;
  }
};

export const getFavoriteCountries = async () => {
  try {
    const response = await axios.get('/api/favorites/countries');
    return response.data;
  } catch (err) {
    console.error('Error fetching favorite countries:', err);
    throw err;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const formData = new FormData();
    
    // Append all fields to formData
    if (profileData.username) formData.append('username', profileData.username);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.phone) formData.append('phone', profileData.phone);
    if (profileData.profilePic) formData.append('profilePic', profileData.profilePic);
    
    const response = await axios.put('/api/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating profile:', err);
    throw err;
  }
};