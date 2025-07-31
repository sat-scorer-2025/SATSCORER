import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

const AvailableFreeTests = () => {
  const { tests, setTests, courses, loading, error } = useOutletContext();

  const handleMarkPaid = async (test) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/test/${test._id}`,
        { isFree: false },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTests(tests.map((t) => (t._id === test._id ? response.data.test : t)));
      toast.success(`Test "${test.title}" marked as paid.`, {
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
    }
  };

  const freeTests = tests.filter((test) => test.isFree && test.status === 'published');

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Free Tests</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">{error}</div>
      ) : freeTests.length === 0 ? (
        <p className="text-gray-600 text-center">No free tests available at the moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Test Title</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Test Type</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Exam Type</th>
                <th className="p-4 font-medium">Attempts</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {freeTests.map((test) => (
                <tr
                  key={test._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{test.title}</td>
                  <td className="p-4 text-gray-800">
                    {courses.find((course) => course._id === test.courseId)?.title || 'Unknown Course'}
                  </td>
                  <td className="p-4 text-gray-800">{test.testType.replace('-', ' ').toUpperCase()}</td>
                  <td className="p-4 text-gray-800">{test.duration} min</td>
                  <td className="p-4 text-gray-800">{test.examType.toUpperCase()}</td>
                  <td className="p-4 text-gray-800">{test.noOfAttempts}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleMarkPaid(test)}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <span className="text-lg">₹</span>
                      <span>Mark Paid</span>
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

export default AvailableFreeTests;