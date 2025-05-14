import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiUser, FiHeart, FiLogIn } from 'react-icons/fi';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search term, region, and language
  useEffect(() => {
    let results = countries;

    if (searchTerm) {
      results = results.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== 'All') {
      results = results.filter(country => country.region === selectedRegion);
    }

    if (selectedLanguage !== 'All') {
      results = results.filter(country => {
        if (!country.languages) return false;
        return Object.values(country.languages).includes(selectedLanguage);
      });
    }

    setFilteredCountries(results);
  }, [searchTerm, selectedRegion, selectedLanguage, countries]);

  // Get unique regions for filter dropdown
  const regions = ['All', ...new Set(countries.map(country => country.region))].filter(Boolean);

  // Get unique languages for filter dropdown
  const allLanguages = countries.reduce((acc, country) => {
    if (country.languages) {
      return [...acc, ...Object.values(country.languages)];
    }
    return acc;
  }, []);
  const languages = ['All', ...new Set(allLanguages)].filter(Boolean);

  // Toggle favorite country
  const toggleFavorite = (countryCode) => {
    if (favorites.includes(countryCode)) {
      setFavorites(favorites.filter(code => code !== countryCode));
    } else {
      setFavorites([...favorites, countryCode]);
    }
  };

  // Fetch country details
  const fetchCountryDetails = async (countryCode) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const data = await response.json();
      setSelectedCountry(data[0]);
    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Country Explorer</h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FiUser className="text-indigo-600" />
                </button>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                <FiLogIn />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a country..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <button
                className="flex items-center justify-between px-4 py-2 w-full md:w-48 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              >
                <span>{selectedRegion}</span>
                <FiChevronDown className={`transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showRegionDropdown && (
                <div className="absolute z-10 mt-1 w-full md:w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  {regions.map(region => (
                    <button
                      key={region}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedRegion === region ? 'bg-indigo-50 text-indigo-600' : ''}`}
                      onClick={() => {
                        setSelectedRegion(region);
                        setShowRegionDropdown(false);
                      }}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Filter */}
            <div className="relative">
              <button
                className="flex items-center justify-between px-4 py-2 w-full md:w-48 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <span>{selectedLanguage}</span>
                <FiChevronDown className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showLanguageDropdown && (
                <div className="absolute z-10 mt-1 w-full md:w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {languages.map(language => (
                    <button
                      key={language}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedLanguage === language ? 'bg-indigo-50 text-indigo-600' : ''}`}
                      onClick={() => {
                        setSelectedLanguage(language);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600">
            {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Countries Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map(country => (
              <div 
                key={country.cca3} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => fetchCountryDetails(country.cca3)}
              >
                <div className="relative">
                  <img 
                    src={country.flags.png} 
                    alt={`Flag of ${country.name.common}`} 
                    className="w-full h-48 object-cover"
                  />
                  {isLoggedIn && (
                    <button 
                      className={`absolute top-2 right-2 p-2 rounded-full ${favorites.includes(country.cca3) ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(country.cca3);
                      }}
                    >
                      <FiHeart />
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{country.name.common}</h2>
                  <p className="text-gray-600 mb-1"><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                  <p className="text-gray-600 mb-1"><span className="font-semibold">Region:</span> {country.region}</p>
                  <p className="text-gray-600 mb-1"><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                  {country.languages && (
                    <p className="text-gray-600"><span className="font-semibold">Languages:</span> {Object.values(country.languages).join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No countries found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Country Detail Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedCountry.flags.png} 
                alt={`Flag of ${selectedCountry.name.common}`} 
                className="w-full h-64 object-cover"
              />
              <button 
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">{selectedCountry.name.common}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Official Name:</span> {selectedCountry.name.official}</p>
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Capital:</span> {selectedCountry.capital?.[0] || 'N/A'}</p>
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Region:</span> {selectedCountry.region}</p>
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Subregion:</span> {selectedCountry.subregion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Population:</span> {selectedCountry.population.toLocaleString()}</p>
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Area:</span> {selectedCountry.area.toLocaleString()} km²</p>
                  {selectedCountry.languages && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Languages:</span> {Object.values(selectedCountry.languages).join(', ')}
                    </p>
                  )}
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Currency:</span> {selectedCountry.currencies ? 
                      Object.values(selectedCountry.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedCountry.borders && selectedCountry.borders.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Border Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.borders.map(borderCode => (
                      <button 
                        key={borderCode}
                        className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                        onClick={() => fetchCountryDetails(borderCode)}
                      >
                        {borderCode}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;