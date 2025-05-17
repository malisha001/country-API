import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaSearch, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filterRegion, setFilterRegion] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items per page
  const navigate = useNavigate();

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('countryFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('countryFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        console.log(response)
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false);
      }
    };
    
    fetchCountries();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (cca3) => {
    if (favorites.includes(cca3)) {
      setFavorites(favorites.filter(id => id !== cca3));
    } else {
      setFavorites([...favorites, cca3]);
    }
  };

  // Get unique regions and languages for filters
  const regions = [...new Set(countries.map(country => country.region))].filter(Boolean);
  const languages = [...new Set(
    countries.flatMap(country => 
      country.languages ? Object.values(country.languages) : []
    )
  )].filter(Boolean).sort();

  // Filter countries based on search and filters
  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !filterRegion || country.region === filterRegion;
    const matchesLanguage = !filterLanguage || 
      (country.languages && Object.values(country.languages).includes(filterLanguage));
    
    return matchesSearch && matchesRegion && matchesLanguage;
  });

  // Get favorite countries
  const favoriteCountries = countries.filter(country => 
    favorites.includes(country.cca3)
  );

  // Determine which countries to display
  const countriesToDisplay = showFavorites ? favoriteCountries : filteredCountries;

  // Get current countries for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = countriesToDisplay.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(countriesToDisplay.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRegion, filterLanguage, showFavorites]);

  if (loading) {
    return (
      <div  className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <motion.div
          data-testid="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header and controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
          >
            Countries of the World
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                showFavorites 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
              }`}
            >
              {showFavorites ? (
                <FaHeart className="text-white" />
              ) : (
                <FaRegHeart className="text-pink-400" />
              )}
              {showFavorites ? 'Show All' : `Favorites (${favorites.length})`}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                showFilters
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
              }`}
            >
              <FaFilter className={showFilters ? 'text-white' : 'text-purple-400'} />
              Filters
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 relative"
        >
          <div className="relative max-w-lg">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries by name..."
              className="w-full pl-12 p-4 bg-gray-800/70 border border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-gray-800/70 rounded-xl border border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Filter Countries
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="region-filter" className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                <select
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  id="region-filter"
                >
                  <option value="">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="language-filter" className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  id="language-filter"
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                >
                  <option value="">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
            {(filterRegion || filterLanguage) && (
              <button
                onClick={() => {
                  setFilterRegion('');
                  setFilterLanguage('');
                }}
                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Active filters display */}
        {(filterRegion || filterLanguage) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {filterRegion && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300">
                {filterRegion}
                <button 
                  onClick={() => setFilterRegion('')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-500/30"
                >
                  <FaTimes className="w-2 h-2" />
                </button>
              </span>
            )}
            {filterLanguage && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-300">
                {filterLanguage}
                <button 
                  onClick={() => setFilterLanguage('')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-pink-400 hover:bg-pink-500/30"
                >
                  <FaTimes className="w-2 h-2" />
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* Countries grid */}
        {showFavorites && favoriteCountries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <FaRegHeart className="mx-auto text-5xl text-pink-400/30 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No favorites yet</h3>
              <p className="text-gray-400 mb-4">Click the heart icon on countries to add them to your favorites</p>
              <button
                onClick={() => setShowFavorites(false)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Browse All Countries
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentCountries.map((country) => (
                <motion.div
                  key={country.cca3}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-800/70 rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-700 backdrop-blur-sm transition-all"
                >
                  <div className="h-48 bg-gray-900/50 flex items-center justify-center relative">
                    <img 
                      src={country.flags.png} 
                      alt={`Flag of ${country.name.common}`}
                      className="h-full w-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(country.cca3);
                      }}
                      className="absolute top-3 right-3 bg-gray-900/80 p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all"
                    >
                      {favorites.includes(country.cca3) ? (
                        <FaHeart
                          data-testid="favorite-icon-filled" 
                          className="text-pink-500" 
                        />
                      ) : (
                        <FaRegHeart data-testid="favorite-icon-outline"
                         className="text-gray-400 hover:text-pink-400" 
                        />
                      )}
                    </motion.button>
                  </div>
                  <div 
                    className="p-5 cursor-pointer" 
                    onClick={() => navigate(`/country/${country.cca3}`)}
                  >
                    <h3 className="font-bold text-xl text-white mb-3">
                      {country.name.common}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-start">
                        <div className="bg-blue-500/20 p-1 rounded mr-3">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <p>{country.capital?.join(', ') || 'N/A'}</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-pink-500/20 p-1 rounded mr-3">
                          <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p>{country.population?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-500/20 p-1 rounded mr-3">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p>{country.region || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {countriesToDisplay.length > itemsPerPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-10"
              >
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first, last and nearby pages
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => paginate(totalPages)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentPage === totalPages
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
                    aria-label="Next page"
                  >
                    <FaChevronRight />
                  </button>
                </nav>
              </motion.div>
            )}
          </>
        )}
        
        {!showFavorites && filteredCountries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <FaSearch className="mx-auto text-5xl text-blue-400/30 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                {filterRegion || filterLanguage || searchTerm 
                  ? "No countries match your search" 
                  : "No countries found"}
              </h3>
              {(filterRegion || filterLanguage || searchTerm) && (
                <button
                  data-testid="clear-filters"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRegion('');
                    setFilterLanguage('');
                  }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CountryList;