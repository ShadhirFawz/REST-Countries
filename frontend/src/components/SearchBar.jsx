// src/components/SearchBar.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const filterOptions = [
  { value: 'code', label: 'Country Code' },
  { value: 'language', label: 'Language' },
  { value: 'region', label: 'Region' },
  { value: 'subregion', label: 'Subregion' },
  { value: 'capital', label: 'Capital' },
  { value: 'translation', label: 'Translation' }
];

export default function SearchBar({ onSearch, isLoading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery === '' && activeFilter) {
      onSearch('', activeFilter);
    }
  }, [searchQuery, activeFilter, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filterType = activeFilter || 'name';
      onSearch(searchQuery, filterType);
    }
  };

  const handleFilterSelect = (filterValue) => {
    setActiveFilter(activeFilter === filterValue ? null : filterValue);
    setShowFilters(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value === '' && searchQuery !== '') {
      onSearch('', activeFilter || 'name');
    }
  };

  return (
    <div className={`relative ${isMobile ? 'mb-4 px-4 w-auto' : 'mb-8 max-w-3xl mx-auto'}`}>
      <form onSubmit={handleSearch} className={`flex ${isMobile ? 'flex-row gap-2' : 'gap-3'} w-full`}>
        {/* Search input container */}
        <div className="relative flex-1 group">
          {/* Search icon - updated positioning */}
          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 h-full pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Input field - adjusted padding */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            style={{ fontFamily: 'sans-serif' }}
            placeholder={
              activeFilter 
                ? `Search by ${filterOptions.find(f => f.value === activeFilter)?.label || 'Name'}...`
                : "Search by country name..."
            }
            className={`w-full ${isMobile ? 'pl-10 pr-9 py-2.5 text-sm' : 'pl-12 pr-11 py-3.5'} bg-gray-800/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 text-white placeholder-gray-400/70 transition-all ${isMobile ? 'backdrop-blur-none' : 'backdrop-blur-sm'} shadow-lg`}
          />
          
          {/* Filter toggle button - adjusted positioning */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute inset-y-0 right-0 flex items-center pr-3 h-full ${isMobile ? 'px-2' : 'px-3'} rounded-lg transition-all ${
              activeFilter 
                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700/50'
            }`}
            aria-label="Filter options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Search button - Mobile shows below input */}
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          style={{ fontFamily: 'sans-serif' }}
          className={`${isMobile ? 'w-13' : 'px-6'} py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-white disabled:opacity-50 disabled:from-gray-600 disabled:to-gray-600 font-medium transition-all duration-200 flex items-center justify-center ${isMobile ? '' : 'min-w-[120px]'} shadow-lg hover:shadow-blue-500/20`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isMobile ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </form>

      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute z-10 mt-3 ${isMobile ? 'w-64 left-0' : 'w-full'} bg-gray-800/95 border border-gray-700 rounded-xl shadow-xl overflow-hidden ${isMobile ? 'absolute backdrop-blur-none w-auto' : 'backdrop-blur-lg'}`}
          >
            <div className={`p-2 ${isMobile ? 'h-60 w-xs' : 'space-y-1'}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400/80 mb-2 px-3 py-1.5">Filter by:</h3>
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-1'}`}>
                {filterOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      activeFilter === option.value 
                        ? 'bg-blue-500/10' 
                        : 'hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleFilterSelect(option.value)}
                  >
                    <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors ${
                      activeFilter === option.value 
                        ? 'bg-blue-500 border-blue-500 shadow-inset-blue' 
                        : 'border-gray-500 hover:border-blue-400'
                    }`}>
                      {activeFilter === option.value && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      activeFilter === option.value ? 'text-blue-400 font-medium' : 'text-gray-300'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter(null);
                    setShowFilters(false);
                    onSearch('', 'name');
                  }}
                  className="w-full text-xs text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-gray-700/30 transition-colors text-left flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear filter (search by name)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter indicator */}
      {activeFilter && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 flex items-center ${isMobile ? 'justify-center' : ''}`}
        >
          <span className="text-xs text-gray-400/80 mr-2">Filtering by:</span>
          <div className="inline-flex items-center bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-600/50 backdrop-blur-sm">
            <span className="text-xs font-medium text-blue-400">
              {filterOptions.find(f => f.value === activeFilter)?.label}
            </span>
            <button
              onClick={() => setActiveFilter(null)}
              className="ml-2 -mr-1 p-0.5 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-gray-600/30"
              aria-label="Remove filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}