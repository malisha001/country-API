import React from 'react';
import { FiUser, FiHeart, FiLogIn, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn, favoritesCount }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">Country Explorer</Link>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-1 hover:text-indigo-600">
            <FiHome />
            <span>Home</span>
          </Link>
          
          {isLoggedIn && (
            <Link to="/favorites" className="flex items-center space-x-1 hover:text-indigo-600 relative">
              <FiHeart />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FiUser className="text-indigo-600" />
              </Link>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <FiLogIn />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;