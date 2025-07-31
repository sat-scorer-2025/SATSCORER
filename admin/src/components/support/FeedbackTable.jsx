import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const FeedbackTable = ({ feedback, setFeedback }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({ course: '', rating: '', dateOrder: 'desc' });
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const courses = ['', 'GRE Prep', 'SAT Math', 'IELTS Prep'];
  const ratings = ['', '1', '2', '3', '4', '5'];

  const filteredFeedback = feedback
    .filter((item) => (filters.course ? item.courseName === filters.course : true))
    .filter((item) => (filters.rating ? item.rating === parseInt(filters.rating) : true))
    .sort((a, b) => {
      if (sortConfig.key === 'studentName') {
        return sortConfig.direction === 'asc'
          ? a.studentName.localeCompare(b.studentName)
          : b.studentName.localeCompare(a.studentName);
      } else if (sortConfig.key === 'courseName') {
        return sortConfig.direction === 'asc'
          ? a.courseName.localeCompare(b.courseName)
          : b.courseName.localeCompare(a.courseName);
      } else if (sortConfig.key === 'rating') {
        return sortConfig.direction === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      setFeedback(feedback.filter((item) => item.id !== id));
      alert('Feedback deleted successfully.');
    }
  };

  const handleToggleAddressed = (id) => {
    setFeedback(
      feedback.map((item) =>
        item.id === id ? { ...item, addressed: !item.addressed } : item
      )
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback from Students</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Filter by Course</label>
          <select
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            aria-label="Filter by course"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course || 'All Courses'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Filter by Rating</label>
          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            aria-label="Filter by rating"
          >
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating || 'All Ratings'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredFeedback.length === 0 ? (
        <p className="text-gray-600">No feedback available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort('studentName')}
                >
                  Student {getSortIcon('studentName')}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort('courseName')}
                >
                  Course {getSortIcon('courseName')}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort('rating')}
                >
                  Rating {getSortIcon('rating')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Comment
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date {getSortIcon('date')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-4 py-2">{item.studentName}</td>
                  <td className="px-4 py-2">{item.courseName}</td>
                  <td className="px-4 py-2">{'★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{item.comment}</td>
                  <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    {item.addressed ? 'Addressed' : 'Not Addressed'}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      aria-label={`View ${item.studentName}'s feedback`}
                    >
                      View/Reply
                    </button>
                    <button
                      onClick={() => handleToggleAddressed(item.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      aria-label={`${item.addressed ? 'Unmark' : 'Mark'} ${item.studentName}'s feedback as addressed`}
                    >
                      {item.addressed ? 'Unmark' : 'Mark Addressed'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                      aria-label={`Delete ${item.studentName}'s feedback`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FeedbackModal
        open={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        feedback={selectedFeedback}
        onUpdate={(updatedFeedback) =>
          setFeedback(feedback.map((item) => (item.id === updatedFeedback.id ? updatedFeedback : item)))
        }
      />
    </div>
  );
};

export default FeedbackTable;