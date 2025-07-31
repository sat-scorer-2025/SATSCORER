import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FreeTestAccess = () => {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testsResponse, coursesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/test`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/course`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTests(testsResponse.data.tests || []);
        setCourses(coursesResponse.data.courses || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        toast.error('Failed to fetch data', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header and Tabs */}
      <div className="sticky top-20 z-10 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 px-6 py-4">Free Test Access Dashboard</h1>
        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {['available', 'manage'].map((tab) => (
            <NavLink
              key={tab}
              to={`/free-tests/${tab}`}
              className={({ isActive }) =>
                `px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                  isActive ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {tab === 'available' ? 'Available Free Tests' : 'Manage Free/Paid Tests'}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6 z-0">
        <Outlet context={{ tests, setTests, courses, loading, error }} />
      </div>
    </div>
  );
};

export default FreeTestAccess;