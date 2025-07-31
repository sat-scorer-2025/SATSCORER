import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import UpdateCourseContentForm from '../components/content/UpdateCourseContentForm';
import { useNavigate } from 'react-router-dom';

const UpdateContent = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch courses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (examFilter ? course.examType === examFilter : true)
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    navigate(`/content/${course._id}/updatecontent`);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    navigate('/content');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-20 z-30 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 px-6 py-4">Update Course Content</h1>
      </div>
      {selectedCourse ? (
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Updating Content for: {selectedCourse.title}
              </h2>
              <button
                onClick={handleBackToCourses}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200"
              >
               &lt;  Back to Courses
              </button>
            </div>
            <UpdateCourseContentForm course={selectedCourse} />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select a Course</h2>
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
              <div className="relative flex-grow mb-4 sm:mb-0">
                <input
                  type="text"
                  placeholder="Search courses by title..."
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
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="">All Exams</option>
                <option value="SAT">SAT</option>
                <option value="ACT">ACT</option>
                <option value="GRE">GRE</option>
                <option value="IELTS">IELTS</option>
                <option value="GMAT">GMAT</option>
                <option value="AP">AP</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <p className="text-gray-600 text-center">Loading courses...</p>
              ) : courses.length === 0 ? (
                <p className="text-gray-600 text-center">No courses available. Please create a course first.</p>
              ) : (
                <table className="w-full border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="p-4 font-medium">Course</th>
                      <th className="p-4 font-medium">Exam</th>
                      <th className="p-4 font-medium">Price</th>
                      <th className="p-4 font-medium">Enrollments</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr
                        key={course._id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-800">{course.title}</td>
                        <td className="p-4 text-gray-800">{course.examType}</td>
                        <td className="p-4 text-gray-800">₹{course.price.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-gray-800">{course.enrollments?.length || 0}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              course.status === 'published'
                                ? 'bg-teal-100 text-teal-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1 transition-colors"
                            onClick={() => handleSelectCourse(course)}
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
                            <span>Update Content</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateContent;