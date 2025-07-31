import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const isExpired = course.enrollmentStatus === 'expired' || (course.endDate && new Date(course.endDate) < new Date());

  // Format dates to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-sm mx-auto">
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1.5 ${isExpired ? 'bg-yellow-500' : 'bg-green-500'}`}>
        <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-yellow-300' : 'bg-green-300'}`}></div>
        {isExpired ? 'Expired' : 'Active'}
      </div>
      <img
        src={course.thumbnail || 'https://via.placeholder.com/300x150?text=Course+Thumbnail'}
        alt={course.title}
        className="w-full h-36 sm:h-40 object-cover"
      />
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{course.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-3">{course.description || 'No description'}</p>
        <div className="mt-3 text-xs sm:text-sm text-gray-500 space-y-1">
          <p>Start: {formatDate(course.startDate)}</p>
          <p>End: {formatDate(course.endDate)}</p>
        </div>
        {isExpired ? (
          <button
            className="mt-4 block w-full text-center bg-yellow-200 text-gray-500 text-sm sm:text-base py-2 rounded cursor-not-allowed"
            disabled
          >
            Course Expired
          </button>
        ) : (
          <Link
            to={`/studentdashboard/mycourses/viewcourse/${course._id}`}
            className="mt-4 block w-full text-center bg-green-500 text-white text-sm sm:text-base py-2 rounded hover:bg-green-600 transition duration-200"
          >
            View Course
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
