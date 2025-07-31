import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const LiveSessions = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.courses || []);
      } catch (error) {
        toast.error('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/livesession`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data.sessions || []);
      } catch (error) {
        toast.error('Failed to fetch sessions: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchSessions();
  }, [token]);

  const handleTabChange = (tab) => {
    navigate(`/live/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-20 z-10 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 px-6 py-4">Live Sessions Dashboard</h1>
        <div className="flex border-b border-gray-200 px-6">
          {['create', 'manage'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                location.pathname === `/live/${tab}` || (tab === 'manage' && location.pathname.startsWith('/live/manage'))
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'create' ? 'Create Session' : 'Join Sessions'}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-0">
            <Outlet context={{ courses, sessions, setSessions }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSessions;