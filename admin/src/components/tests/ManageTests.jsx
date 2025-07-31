import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TestContext } from '../../context/TestContext';
import { useNavigate, Outlet } from 'react-router-dom';

const ManageTests = () => {
  const { tests, courses, coursesLoading, fetchCourses, fetchTests } = useContext(TestContext);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!coursesLoading && courses.length === 0) {
      console.log('Triggering fetchCourses in ManageTests');
      fetchCourses();
    }
  }, [courses.length, coursesLoading, fetchCourses]);

  useEffect(() => {
    const filtered = tests.filter((test) => {
      const matchesSearch =
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.examType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = filterCourse === '' || test.courseId.toString() === filterCourse;
      
      return matchesSearch && matchesCourse;
    });
    setFilteredTests(filtered);
  }, [searchTerm, filterCourse, tests, courses]);

  const handleDelete = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/test/${testId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Test deleted successfully!');
      setFilteredTests(filteredTests.filter((test) => test._id !== testId));
      await fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (test) => {
    navigate(`/tests/manage/${test._id}/edit`);
  };

  const handleUpdate = async (updatedTest) => {
    if (!updatedTest || !updatedTest._id) {
      toast.error('Invalid test data received');
      return;
    }
    setFilteredTests(
      filteredTests.map((test) => (test._id === updatedTest._id ? { ...test, ...updatedTest } : test))
    );
    await Promise.all([fetchCourses(), fetchTests()]);
    navigate('/tests/manage');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Tests</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search tests by title or exam type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 pl-10"
            disabled={isLoading || coursesLoading}
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
          disabled={isLoading || coursesLoading}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        {isLoading || coursesLoading ? (
          <p className="text-gray-600 text-center">Loading tests...</p>
        ) : filteredTests.length === 0 ? (
          <p className="text-gray-600 text-center">No tests found.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Test</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Test Type</th>
                <th className="p-4 font-medium">Exam Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
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
                    {courses.find((c) => c._id === test.courseId.toString())?.title || 'Unassigned'}
                  </td>
                  <td className="p-4 text-gray-800">{test.testType}</td>
                  <td className="p-4 text-gray-800">{test.examType}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        test.status === 'published'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1 transition-colors"
                      disabled={isLoading || coursesLoading}
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
                      onClick={() => handleDelete(test._id)}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 transition-colors"
                      disabled={isLoading || coursesLoading}
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
      <Outlet />
    </div>
  );
};

export default ManageTests;