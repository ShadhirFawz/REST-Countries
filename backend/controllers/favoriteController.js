// backend/controllers/favoriteController.js
import User from '../model/User.js';
import axios from 'axios'

/**
 * @desc Add a country to favorites
 * @route POST /api/favorites
 * @access Private
 */
export const addFavorite = async (req, res) => {
  const userId = req.user._id;
  const { code, name, flag } = req.body;

  try {
    const user = await User.findById(userId);
    const alreadyExists = user.favorites.find(c => c.code === code);
    if (alreadyExists) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }

    user.favorites.push({ code, name, flag });
    await user.save();
    res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite', error: err.message });
  }
};

/**
 * @desc Remove a country from favorites
 * @route DELETE /api/favorites/:code
 * @access Private
 */
export const removeFavorite = async (req, res) => {
  const userId = req.user._id;
  const { code } = req.params;

  try {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(c => c.code !== code);
    await user.save();
    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite', error: err.message });
  }
};

/**
 * @desc Get all favorite countries
 * @route GET /api/favorites
 * @access Private
 */
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ 
      message: 'Error fetching favorites', 
      error: err.message 
    });
  }
};

/**
 * @desc Get all favorite countries with full data
 * @route GET /api/favorites/countries
 * @access Private
 */
export const getFavoriteCountries = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no favorites, return empty array immediately
    if (user.favorites.length === 0) {
      return res.status(200).json([]);
    }

    // First try to fetch all data from REST Countries API
    try {
      const countryCodes = user.favorites.map(fav => fav.code);
      const response = await axios.get(
        `https://restcountries.com/v3.1/alpha?codes=${countryCodes.join(',')}&fields=name,flags,cca3,cca2,region,subregion,capital,currencies,languages,population,area,latlng,timezones,car,independent,unMember,maps,postalCode,startOfWeek`
      );

      // Map the API data to maintain order from user's favorites
      const orderedCountries = user.favorites.map(fav => {
        const fullData = response.data.find(c => c.cca3 === fav.code);
        if (fullData) {
          return {
            ...fullData,
            // Ensure we have all required fields
            name: {
              common: fullData.name?.common || fav.name,
              official: fullData.name?.official || fav.name
            },
            flags: {
              svg: fullData.flags?.svg || fav.flag,
              png: fullData.flags?.png || fav.flag
            }
          };
        }
        
        // Fallback to basic data if country not found in API response
        return {
          cca3: fav.code,
          name: {
            common: fav.name,
            official: fav.name
          },
          flags: {
            svg: fav.flag,
            png: fav.flag
          },
          region: 'Unknown',
          capital: ['Unknown'],
          currencies: {},
          languages: {},
          population: 0,
          area: 0,
          latlng: [0, 0],
          timezones: ['UTC'],
          car: {
            side: 'right',
            signs: []
          },
          maps: {
            googleMaps: '',
            openStreetMaps: ''
          }
        };
      });

      return res.status(200).json(orderedCountries);
    } catch (apiError) {
      console.error('Failed to fetch from REST Countries API:', apiError.message);
      // If API fails, return the basic data we have from user favorites
      const fallbackCountries = user.favorites.map(fav => ({
        cca3: fav.code,
        name: {
          common: fav.name,
          official: fav.name
        },
        flags: {
          svg: fav.flag,
          png: fav.flag
        },
        region: 'Unknown',
        capital: ['Unknown'],
        currencies: {},
        languages: {},
        population: 0,
        area: 0,
        latlng: [0, 0],
        timezones: ['UTC'],
        car: {
          side: 'right',
          signs: []
        },
        maps: {
          googleMaps: '',
          openStreetMaps: ''
        }
      }));
      
      return res.status(200).json(fallbackCountries);
    }
  } catch (error) {
    console.error('Error fetching favorite countries:', error);
    res.status(500).json({ 
      message: 'Error fetching favorite countries', 
      error: error.message 
    });
  }
};

