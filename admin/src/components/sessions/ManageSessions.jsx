import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useOutletContext, Outlet } from 'react-router-dom';

const ManageSessions = () => {
  const { token } = useAuth();
  const { courses, sessions, setSessions } = useOutletContext();
  const [filteredSessions, setFilteredSessions] = useState(sessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.platform.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = filterCourse === '' || session.courseId?._id === filterCourse;
      return matchesSearch && matchesCourse;
    });
    setFilteredSessions(filtered);
  }, [searchTerm, filterCourse, sessions]);

  const getCourseName = (courseId) => {
    if (!courseId) return 'Unknown Course';
    const id = typeof courseId === 'object' && courseId?._id ? courseId._id : courseId;
    const course = courses.find((c) => c._id === id);
    return course ? course.title : 'Unknown Course';
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/livesession/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessions.filter((s) => s._id !== sessionId));
      toast.success('Session deleted successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Failed to delete session: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (session) => {
    navigate(`/live/manage/${session._id}/edit`);
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Live Sessions</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search sessions by title or platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 pl-10"
            disabled={isLoading}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        >
          <option value="">All Courses</option>
          {courses && courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading sessions...</p>
        ) : filteredSessions.length === 0 ? (
          <p className="text-gray-600 text-center">No sessions found.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Session Title</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr
                  key={session._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{session.title}</td>
                  <td className="p-4 text-gray-800">{getCourseName(session.courseId)}</td>
                  <td className="p-4 text-gray-800">{session.platform}</td>
                  <td className="p-4 text-gray-800">{new Date(session.scheduledAt).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-800">{new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-4 flex space-x-2">
                    <a
                      href={session.link}
                      target="_self"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>Join</span>
                    </a>
                    <button
                      onClick={() => handleEdit(session)}
                      className="text-amber-600 hover:text-amber-700 font-semibold flex items-center space-x-1 transition-colors"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 transition-colors"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Outlet context={{ courses, sessions, setSessions }} />
    </div>
  );
};

export default ManageSessions;