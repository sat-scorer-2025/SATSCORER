import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PopularCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Sort courses by enrollment count (assuming enrollments array length)
        const sortedCourses = response.data.courses
          .map(course => ({
            id: course._id,
            name: course.title,
            enrollments: course.enrollments?.length || 0,
          }))
          .sort((a, b) => b.enrollments - a.enrollments)
          .slice(0, 5); // Get top 5 courses

        setCourses(sortedCourses);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch popular courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPopularCourses();
    }
  }, [token]);

  if (loading) {
    return <div className="p-4">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-sm border border-gray-300">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Courses</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="pb-2">Course Name</th>
            <th className="pb-2 text-center">Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-2">
                <Link to={`/courses/manage`} className="text-blue-500 hover:underline">
                  {course.name}
                </Link>
              </td>
              <td className="py-2 text-center">{course.enrollments}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/courses/manage" className="text-blue-500 hover:underline mt-4 block">
        View All
      </Link>
    </div>
  );
};

export default PopularCourses;