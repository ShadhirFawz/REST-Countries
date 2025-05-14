// src/pages/Home.jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAllCountries, searchCountries, getFavoriteCountries } from '../services/api';
import CountryCard from '../components/CountryCard';
import CountryModal from '../components/CountryModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileDrawer from '../components/ProfileDrawer';
import SearchBar from '../components/SearchBar';
import finalLogo from '../assets/FinalLogo.jpg'
import { FaSync, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};


export default function Home() {
  const { token, favorites, loadFavorites } = useAuth();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const favoritesContainerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [hasScrolledPastLogo, setHasScrolledPastLogo] = useState(false);
  const [logoHeight, setLogoHeight] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const observer = useRef();
  const itemsPerPage = 5;

  const isMobile = useMobile();

  const styles = `
    .favorites-scroll-container::-webkit-scrollbar {
      display: none;
    }
    .favorites-scroll-container {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .refresh-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 768px) {
      .mobile-filter-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
        margin-bottom: 16px;
      }
      .mobile-filter-chip {
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        font-size: 12px;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .mobile-filter-chip.active {
        background: rgba(59, 130, 246, 0.2);
        border-color: rgba(59, 130, 246, 0.5);
      }
    }
  `;

  // Categorized keywords
  const keywordCategories = {
    'Regions': ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'],
    'Languages': ['English', 'Spanish', 'French', 'German', 'Arabic'],
    'Subregions': ['Western Europe', 'Northern Africa', 'South America', 'Central America']
  };

  // Flatten keywords for mobile display
  const allKeywords = Object.values(keywordCategories).flat();

  // Mouse position tracker - only for desktop
  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        if (token) {
          await loadFavoriteCountries();
        }

        await fetchCountries();
      } catch (err) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
  
    initializeData();
  }, [token]);

  const handleRefreshFavorites = async () => {
    try {
      setFavoritesLoading(true);
      await loadFavoriteCountries();
    } catch (err) {
      console.error('Error refreshing favorites:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const loadFavoriteCountries = async () => {
    try {
      setFavoritesLoading(true);
      const favoriteCountriesData = await getFavoriteCountries();
      setFavoriteCountries(favoriteCountriesData);
      await loadFavorites(); // Still call this to maintain the simple favorites list
    } catch (err) {
      console.error('Error loading favorite countries:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const startScrolling = (direction) => {
    if (!favoritesContainerRef.current) return;
    
    const scrollStep = direction === 'left' ? -20 : 20;
    
    const interval = setInterval(() => {
      favoritesContainerRef.current.scrollLeft += scrollStep;
    }, 30);
    
    setScrollInterval(interval);
  };
  
  const stopScrolling = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
  
    const updateLogoState = () => {
      const logoElement = document.getElementById('standalone-logo');
      if (!logoElement) return;
  
      const scrollY = window.scrollY;
      const logoRect = logoElement.getBoundingClientRect();
      const appBarHeight = 64; // h-16 = 64px
  
      // Calculate the exact position where logo should attach/detach
      const attachThreshold = logoHeight * 0.5;
      const detachThreshold = logoHeight * 0.8;
  
      if (scrollY > lastScrollY) { // Scrolling down
        if (logoRect.top <= appBarHeight + attachThreshold && !hasScrolledPastLogo) {
          setHasScrolledPastLogo(true);
        }
      } else { // Scrolling up
        if (scrollY <= detachThreshold && hasScrolledPastLogo) {
          setHasScrolledPastLogo(false);
        }
      }
  
      lastScrollY = scrollY;
      setScrolled(scrollY > 10);
      ticking = false;
    };
  
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateLogoState);
        ticking = true;
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledPastLogo, logoHeight]);

  useEffect(() => {
    const logoElement = document.getElementById('standalone-logo');
    if (!logoElement) return;
  
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setLogoHeight(entry.contentRect.height);
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    });
  
    observer.observe(logoElement);
    return () => observer.disconnect();
  }, [isInitialLoad]);

  useEffect(() => {
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [scrollInterval]);

  const getFullCountryData = (fav) => {
    // First check favoriteCountries (loaded immediately)
    const fromFavorites = favoriteCountries.find(c => c.cca3 === fav.code);
    if (fromFavorites) return fromFavorites;
    
    // Then check regular countries (might not be loaded yet)
    return countries.find(c => c.cca3 === fav.code);
  };

  const handleSearch = async (query, filterType = 'name') => {
    if (!query.trim() && filterType === 'name') {
      resetSearch();
      return;
    }

    setSearchLoading(true);
    setError(null);
    try {
      const results = await searchCountries(query, filterType);
      setCountries(results);
      setSearchMode(query.trim() !== '');
      setPage(1);
      setHasMore(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching countries');
      setCountries([]);
      setSearchMode(false);
      resetSearch();
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchCountries = useCallback(async () => {
    if (loading || !hasMore || searchMode) return;
    
    setLoading(true);
    try {
      const paginatedData = await getAllCountries(page, itemsPerPage);
      
      setCountries(prev => {
        const existingCodes = new Set(prev.map(c => c.cca3));
        const newCountries = paginatedData.filter(
          country => !existingCodes.has(country.cca3)
        );
        return [...prev, ...newCountries];
      });
      
      setHasMore(paginatedData.length === itemsPerPage);
      setPage(prev => prev + 1);
    } catch (err) {
      setError('Failed to load countries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, searchMode]);

  const resetSearch = useCallback(() => {
    setSearchMode(false);
    setPage(1);
    setHasMore(true);
    setCountries([]);
    setError(null);
    fetchCountries();
  }, [fetchCountries]);

  const lastCountryElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchCountries();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchCountries]);

  const filteredCountries = selectedKeyword
    ? countries.filter(country =>
        country.region === selectedKeyword ||
        country.subregion === selectedKeyword ||
        (country.languages && Object.values(country.languages).includes(selectedKeyword))
      )
    : countries;

  useEffect(() => {
    if (!selectedKeyword && countries.length === 0) {
      resetSearch();
    }
  }, [selectedKeyword, countries, resetSearch]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden 
       bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800
       md:from-gray-900 md:via-black md:to-gray-800">
      <style>{styles}</style>

      {/* Fixed App Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-16 flex items-center justify-end px-6 z-30"
        initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0, 0, 0, 0)' }}
        animate={{
          backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
          backgroundColor: scrolled ? 'rgba(15, 23, 42, 0.7)' : 'rgba(0, 0, 0, 0)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo in app bar */}
        {hasScrolledPastLogo && (
          <motion.div
            key="appbar-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute pr-30"
          >
            <img src={finalLogo} alt="Logo" className="w-40" />
          </motion.div>
        )}
      </motion.div>

      {/* Standalone Logo */}
      <motion.div
        id="standalone-logo"
        key="standalone-logo"
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: hasScrolledPastLogo ? 0 : 1,
          y: hasScrolledPastLogo ? -logoHeight * 0.2 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: isMobile ? '0px' : '5px',
          left: isMobile ? '50%' : '70%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          pointerEvents: hasScrolledPastLogo ? 'none' : 'auto'
        }}
      >
        <img src={finalLogo} alt="Logo" className={isMobile ? 'w-35' : 'w-60'} />
      </motion.div>
      
      {/* Mouse hover background effect - Desktop only */}
      {!isMobile && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(1500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.3), transparent 98%)`,
          }}
          transition={{ type: 'spring', damping: 30 }}
        />
      )}

      {/* Profile Drawer */}
      <ProfileDrawer />

      {/* Desktop Filter Sidebar */}
      {!isMobile && (
        <div 
          className="fixed left-0 top-0 h-full w-56 pt-15 pb-4 px-4 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto z-50"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <h2 className="text-xl font-normal font-stretch-90% mb-4 text-gray-100">Filter By</h2>
          
          {Object.entries(keywordCategories).map(([category, keywords]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">{category}</h3>
              <div className="space-y-2">
                {keywords.map((kw) => (
                  <label key={kw} className="flex items-center space-x-3 cursor-pointer group">
                    <div 
                      className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
                        selectedKeyword === kw 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-500 group-hover:border-blue-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKeyword(selectedKeyword === kw ? null : kw);
                      }}
                    >
                      {selectedKeyword === kw && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span 
                      className="text-sm text-gray-300 group-hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKeyword(selectedKeyword === kw ? null : kw);
                      }}
                    >
                      {kw}
                    </span>
                  </label>
                ))}
              </div>
              <div className="h-[0.5px] bg-gray-700/50 w-full my-4"></div>
            </div>
          ))}
          
          {selectedKeyword && (
            <button
              onClick={() => {
                setSelectedKeyword(null);
                resetSearch();
              }}
              className="w-full mt-2 px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative z-10 ${isMobile ? 'pt-4' : 'ml-45 pt-20'} pb-20 transition-all duration-300`}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Mobile Header */}
          {isMobile && (
            <h1 className="text-lg pt-12 font-light font-serif text-gray-100 mb-1 px-2">  {/* Changed from text-2xl to text-xl */}
              Browse Countries
            </h1>
          )}

          {/* Mobile Filter Chips */}
          {isMobile && showMobileFilters && (
            <div className="mobile-filter-container">
              {allKeywords.map((kw) => (
                <div
                  key={kw}
                  className={`mobile-filter-chip ${selectedKeyword === kw ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedKeyword(selectedKeyword === kw ? null : kw);
                    setShowMobileFilters(false);
                  }}
                >
                  {kw}
                </div>
              ))}
              {selectedKeyword && (
                <div
                  className="mobile-filter-chip"
                  onClick={() => {
                    setSelectedKeyword(null);
                    setShowMobileFilters(false);
                  }}
                >
                  Clear
                </div>
              )}
            </div>
          )}

          <div className={`${isMobile ? 'px-2' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              {!isMobile && (
                <h1 className="text-3xl font-light font-serif text-gray-100">
                  Browse Countries
                </h1>
              )}
              {searchMode && (
                <button
                  onClick={resetSearch}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors"
                >
                  Show All Countries
                </button>
              )}
            </div>

            <SearchBar onSearch={handleSearch} isLoading={searchLoading} />

            {/* Favorites Horizontal Scroll Section */}
            {!searchMode && token && (
              <div className="mb-8">
                <div className="flex items-center justify-start mb-4">
                  <h2 className="text-xl font-light text-gray-200">
                    Your Favorites
                  </h2>
                  <button
                    onClick={handleRefreshFavorites}
                    className="flex items-center pl-3.5 text-sm cursor-pointer text-blue-400 hover:text-blue-300 transition-colors"
                    disabled={!token || favoritesLoading}
                  >
                    <FaSync className={`mr-2 ${favoritesLoading ? 'refresh-spin' : ''}`} />
                  </button>
                </div>
                
                {favorites.length > 0 ? (
                  <div className="relative group">
                    {/* Left scroll indicator - Desktop only */}
                    {!isMobile && (
                      <div 
                        className="absolute left-0 top-0 h-full w-20 flex items-center justify-start pl-2 z-20"
                        onMouseEnter={() => {
                          setIsHoveringLeft(true);
                          startScrolling('left');
                        }}
                        onMouseLeave={() => {
                          setIsHoveringLeft(false);
                          stopScrolling();
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: isHoveringLeft ? 1 : 0,
                            x: isHoveringLeft ? 0 : -10
                          }}
                          transition={{ duration: 0.2 }}
                          className="bg-black/50 rounded-full p-2"
                        >
                          <FaChevronLeft className="text-white text-xl" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Right scroll indicator - Desktop only */}
                    {!isMobile && (
                      <div 
                        className="absolute right-0 top-0 h-full w-20 flex items-center justify-end pr-2 z-20"
                        onMouseEnter={() => {
                          setIsHoveringRight(true);
                          startScrolling('right');
                        }}
                        onMouseLeave={() => {
                          setIsHoveringRight(false);
                          stopScrolling();
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ 
                            opacity: isHoveringRight ? 1 : 0,
                            x: isHoveringRight ? 0 : 10
                          }}
                          transition={{ duration: 0.2 }}
                          className="bg-black/50 rounded-full p-2"
                        >
                          <FaChevronRight className="text-white text-xl" />
                        </motion.div>
                      </div>
                    )}
                    <div 
                      ref={favoritesContainerRef}
                      className="favorites-scroll-container overflow-x-auto pb-4 pt-1"
                    >
                      <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
                        {favorites.map(fav => {
                          const fullData = getFullCountryData(fav);
                          if (!fullData) return null;
                          return (
                            <div key={fav.code} className="flex-shrink-0 w-64 relative">
                              <CountryCard
                                country={fullData}
                                onClick={() => setSelectedCountry(fullData)}
                                isFavorite={true} // Always true since these are favorites
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className={`relative left-0 right-0 mx-auto h-[5px] ${
                      isMobile ? 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500' : 
                      'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600'
                    } opacity-30 rounded-full ${
                      isMobile ? 'w-full max-w-[280px]' : 'w-220'
                    }`}></div>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    You haven't added any favorites yet
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-900 bg-opacity-20 text-red-300 border border-red-700 rounded-md max-w-3xl mx-auto">
                {error}
              </div>
            )}

            {/* Country Grid */}
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
              {filteredCountries.map((country, index) => (
                <motion.div 
                  key={`${country.cca3}-${index}`}
                  ref={filteredCountries.length === index + 1 ? lastCountryElementRef : null}
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <CountryCard
                    country={country}
                    onClick={() => setSelectedCountry(country)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Loading states */}
            {loading && (
              <div className="flex justify-center mt-8 py-4">
                <LoadingSpinner />
              </div>
            )}
            {!hasMore && !loading && countries.length > 0 && (
              <div className="text-center mt-8 text-gray-400">
                You've reached the end of the list
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCountry && (
        <CountryModal country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      )}
    </div>
  );
}