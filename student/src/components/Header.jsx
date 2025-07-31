import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import NotificationDialog from './NotificationDialog';

const Header = ({ onMenuClick }) => {
  const { user, logout, loading, fetchProtected, refreshUserData } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamsOpen, setIsExamsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(user || {});
  const examsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route starts with /studentdashboard
  const isStudentDashboard = location.pathname.startsWith('/studentdashboard');

  // Base API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch full user profile if name or profilePhoto is missing
  const fetchUserProfile = async () => {
    try {
      const profileResponse = await fetchProtected(`${API_URL}/api/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileData.message || 'Failed to fetch profile');
      }
      setUserDetails(profileData.user);
      await refreshUserData();
    } catch (err) {
      console.error('Error fetching user profile in Header:', err.message);
    }
  };

  useEffect(() => {
    if (!loading && user && (!user.name || !user.profilePhoto)) {
      fetchUserProfile();
    } else if (user) {
      setUserDetails(user);
    }
  }, [user, loading, fetchProtected, refreshUserData]);

  const studentName = userDetails?.name || 'User';

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsExamsOpen(false);
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleExamsDropdown = (e) => {
    e.preventDefault();
    setIsExamsOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault();
    setIsProfileOpen((prev) => !prev);
    setIsExamsOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleNotificationDialog = (e) => {
    e.preventDefault();
    setIsNotificationOpen((prev) => !prev);
    setIsExamsOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (examsDropdownRef.current && !examsDropdownRef.current.contains(event.target)) {
        setIsExamsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const exams = ['sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];

  const handleLogout = () => {
    console.log('Logout initiated');
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    setIsNotificationOpen(false);
    navigate('/');
  };

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white fixed top-0 left-0 right-0 z-50 h-16 font-sans">
        <div className={isStudentDashboard ? 'mx-auto flex items-center justify-between px-4 h-full' : 'max-w-7xl mx-auto flex items-center justify-between px-4 h-full'}>
          <div className="text-2xl font-bold animate-pulse">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white fixed top-0 left-0 right-0 z-50 h-16 font-sans shadow-md">
      <div className={isStudentDashboard ? 'mx-auto flex items-center justify-between px-4 h-full' : 'max-w-7xl mx-auto flex items-center justify-between px-4 h-full'}>
        <div className="flex items-center space-x-4">
          {user && (
            <button
              className="lg:hidden hover:text-purple-300 transition-all duration-200 hover:scale-105"
              onClick={onMenuClick}
              aria-label="Toggle Sidebar"
            >
              <Bars3Icon className="w-7 h-7" />
            </button>
          )}
          <div className="text-2xl font-bold">
            <Link to="/" className="hover:text-purple-300 transition-colors duration-200">
              SAT Scorer
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="sm:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <nav
            className={`${
              isMenuOpen
                ? 'flex flex-col absolute top-16 left-0 right-0 bg-gradient-to-r from-indigo-900 to-purple-900 transition-all duration-300 ease-in-out'
                : 'hidden'
            } sm:flex sm:items-center sm:space-x-6`}
          >
            <div className="relative" ref={examsDropdownRef}>
              <button
                className="flex items-center px-4 py-2 hover:text-purple-300 transition-all duration-200"
                onClick={toggleExamsDropdown}
                aria-label="Exams Menu"
              >
                Exams <span className="ml-1">▼</span>
              </button>
              {isExamsOpen && (
                <div className="bg-white text-gray-700 sm:shadow-md sm:rounded-lg sm:absolute sm:min-w-40 sm:top-10 sm:left-0 z-10 animate-in fade-in duration-200">
                  {exams.map((exam) => (
                    <Link
                      key={exam}
                      to={`/exams/${exam}`}
                      className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-600 uppercase transition-colors duration-200"
                      onClick={() => {
                        setIsExamsOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      {exam}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/aboutus"
              className="px-4 py-2 hover:text-purple-300 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contactus"
              className="px-4 py-2 hover:text-purple-300 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
          {user ? (
            <>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotificationDialog}
                  className="relative hover:text-purple-300 transition-all duration-200 hover:scale-110"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <NotificationDialog
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>
              <span className="hidden sm:inline text-base font-medium text-gray-100 hover:text-purple-300 transition-colors duration-200">
                Hi, {studentName}
              </span>
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center hover:text-purple-300 transition-all duration-200 hover:scale-105"
                  aria-label="Profile Menu"
                >
                  {userDetails.profilePhoto ? (
                    <img
                      src={userDetails.profilePhoto}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${studentName}&background=purple-200&color=indigo-900`;
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-indigo-900 font-semibold text-lg shadow-sm">
                      {studentName[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-md z-50 overflow-hidden animate-in fade-in duration-200">
                    <Link
                      to="/studentdashboard/myprofile"
                      className="block px-4 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/studentdashboard"
                      className="block px-4 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Student Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 sm:ml-4 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Login/SignUp
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;