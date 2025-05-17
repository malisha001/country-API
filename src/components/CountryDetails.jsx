import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const CountryDetails = () => {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const countryResponse = await axios.get(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        setCountry(countryResponse.data[0]);
        
        if (countryResponse.data[0]?.currencies) {
          const currencyCode = Object.keys(countryResponse.data[0].currencies)[0];
          const exchangeResponse = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/USD`
          );
          setExchangeRate(exchangeResponse.data.rates[currencyCode]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchCountryData();
  }, [countryCode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <p className="text-xl text-gray-300">Country not found</p>
      </div>
    );
  }

  const currency = country.currencies ? Object.values(country.currencies)[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Countries
        </motion.button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700"
        >
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gray-800/50">
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="max-h-64 object-contain rounded-lg shadow-lg"
              />
              <h2 className="mt-6 text-2xl font-bold text-white">
                {country.name.common}
              </h2>
              <p className="text-gray-400">{country.name.official}</p>
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Country Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Capital</h3>
                        <p className="text-gray-300">{country.capital?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Region</h3>
                        <p className="text-gray-300">{country.region} {country.subregion && `(${country.subregion})`}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-pink-500/20 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Population</h3>
                        <p className="text-gray-300">{country.population.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-500/20 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Area</h3>
                        <p className="text-gray-300">{country.area?.toLocaleString()} km²</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Languages & Currency
                  </h2>
                  
                  <div className="mb-8">
                    <div className="flex items-start mb-6">
                      <div className="bg-yellow-500/20 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Languages</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {country.languages && Object.values(country.languages).map((lang) => (
                            <span key={lang} className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {currency && (
                      <div className="flex items-start">
                        <div className="bg-green-500/20 p-2 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Currency</h3>
                          <p className="text-gray-300">
                            {currency.name} ({currency.symbol || 'N/A'})
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {currency && exchangeRate && (
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 backdrop-blur-sm"
                >
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
                    Currency Exchange
                  </h2>
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-full md:w-2/5">
                      <label className="block text-sm font-medium text-gray-300 mb-2">USD Amount</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="w-full md:w-2/5">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Converted Amount</label>
                      <div className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
                        {(amount * exchangeRate).toFixed(2)} {Object.keys(country.currencies)[0]}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-teal-300">
                    1 USD = {exchangeRate.toFixed(4)} {Object.keys(country.currencies)[0]}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CountryDetails;