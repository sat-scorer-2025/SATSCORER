import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

const ManageFreePaidTests = () => {
  const { tests, setTests, courses, loading, error } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async (testId, currentIsFree) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/test/${testId}`,
        { isFree: !currentIsFree },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTests(tests.map((t) => (t._id === testId ? response.data.test : t)));
      toast.success(`Test marked as ${currentIsFree ? 'paid' : 'free'} successfully.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error('Failed to update test status', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.status === 'published' &&
      (selectedCourse === '' || (test.courseId && courses.find((course) => course._id === test.courseId)?.title === selectedCourse)) &&
      (searchQuery === '' ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.courseId && courses.find((course) => course._id === test.courseId)?.title.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Free/Paid Tests</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">{error}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search tests by title or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course.title}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      {isLoading || loading ? (
        <p className="text-gray-600 text-center">Loading tests...</p>
      ) : filteredTests.length === 0 ? (
        <p className="text-gray-600 text-center">No tests match the search or selected course.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Test</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr
                  key={test._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{test.title}</td>
                  <td className="p-4 text-gray-800">
                    {courses.find((course) => course._id === test.courseId)?.title || 'Unknown Course'}
                  </td>
                  <td className="p-4 text-gray-800">{test.duration} min</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        test.isFree ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {test.isFree ? 'Free' : 'Paid'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(test._id, test.isFree)}
                      className={`text-${
                        test.isFree ? 'red' : 'teal'
                      }-600 hover:text-${
                        test.isFree ? 'red' : 'teal'
                      }-700 font-semibold flex items-center space-x-1 transition-colors`}
                      disabled={isLoading}
                    >
                      <span className="text-lg">₹</span>
                      <span>{test.isFree ? 'Mark Paid' : 'Mark Free'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageFreePaidTests;