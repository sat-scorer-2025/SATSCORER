import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import { toast } from 'react-toastify';
import EditCourseDrawer from './EditCourseDrawer';

const ManageCoursesTable = () => {
  const { token } = useAuth();
  const { courses, setCourses, isLoading } = useContext(CourseContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowDrawer(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course.');
    }
  };

  const handleUpdateCourse = async (updatedCourse) => {
    setCourses(courses.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    ));
    setShowDrawer(false);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterExam === '' || course.examType === filterExam)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Courses</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search courses..."
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
          value={filterExam}
          onChange={(e) => setFilterExam(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        >
          <option value="">All Exams</option>
          <option value="SAT">SAT</option>
          <option value="ACT">ACT</option>
          <option value="GRE">GRE</option>
          <option value="GMAT">GMAT</option>
          <option value="IELTS">IELTS</option>
          <option value="AP">AP</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-gray-600 text-center">No courses found.</p>
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
                <tr key={course._id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
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
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1 transition-colors"
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
                      onClick={() => handleDelete(course._id)}
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
      {showDrawer && (
        <div className="w-full mt-6">
          <EditCourseDrawer
            course={selectedCourse}
            onClose={() => setShowDrawer(false)}
            onUpdate={handleUpdateCourse}
          />
        </div>
      )}
    </div>
  );
};

export default ManageCoursesTable;