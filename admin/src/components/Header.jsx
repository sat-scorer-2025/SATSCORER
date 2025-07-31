import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import NotificationDialog from './NotificationDialog';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProfileOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 500);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsNotificationOpen(false);
    }, 500);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm border-b border-gray-300">
      <div className="mx-auto pl-8 pr-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side: Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold text-gray-800">SATscorer</span>
              <span className="text-sm font-medium text-gray-600">Admin</span>
            </div>
          </Link>
          {/* Right side: Notification Bell and Profile Icon */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={handleNotificationClick}
              >
                <img src={assets.notification_bell} alt="Notifications" className="w-6 h-6" />
              </button>
              <NotificationDialog 
                isOpen={isNotificationOpen} 
                onClose={handleNotificationClose} 
              />
            </div>
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="p-2 rounded-full hover:bg-gray-100">
                <img src={assets.profile} alt="Profile" className="w-6 h-6" />
              </div>
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;