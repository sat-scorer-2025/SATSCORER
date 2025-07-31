import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchFilter from './SearchFilter';

const EnrolledStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const exams = ['GRE', 'GMAT', 'IELTS', 'SAT', 'ACT', 'AP'];

  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollment`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEnrollments(response.data.enrollments || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch enrollments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const toggleEnrollmentStatus = async (id, studentName, studentEmail, courseTitle) => {
    try {
      const enrollment = enrollments.find((e) => e._id === id);
      const newStatus = enrollment.status === 'active' ? 'expired' : 'active';
      const confirmMessage = `Are you sure you want to ${
        newStatus === 'expired' ? 'expire' : 'activate'
      } the course "${courseTitle}" for ${studentName} (${studentEmail})? ${
        newStatus === 'expired'
          ? 'The student will remain enrolled but cannot access course content (tests, videos, notes, and live sessions).'
          : ''
      }`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/enrollment/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setEnrollments((prev) =>
        prev.map((e) =>
          e._id === id
            ? { ...e, status: newStatus }
            : e
        )
      );
      toast.success(
        `Enrollment status for ${studentName} updated to ${newStatus}`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update enrollment status');
    }
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      (!examFilter || enrollment.courseId?.examType === examFilter) &&
      (!searchQuery ||
        enrollment.userId?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        enrollment.userId?.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Enrollments</h2>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        examFilter={examFilter}
        setExamFilter={setExamFilter}
        exams={exams}
        showExamFilter={true}
      />
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading enrollments...</p>
        ) : filteredEnrollments.length === 0 ? (
          <p className="text-gray-600 text-center">No enrollments found.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">End Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => (
                <tr
                  key={enrollment._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{enrollment.userId?.name || 'N/A'}</td>
                  <td className="p-4 text-gray-800">{enrollment.courseId?.title || 'N/A'}</td>
                  <td className="p-4 text-gray-800">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-800">
                    {enrollment.courseId?.endDate
                      ? new Date(enrollment.courseId.endDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollment.status === 'active'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {enrollment.status.charAt(0).toUpperCase() +
                        enrollment.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() =>
                        toggleEnrollmentStatus(
                          enrollment._id,
                          enrollment.userId?.name,
                          enrollment.userId?.email,
                          enrollment.courseId?.title
                        )
                      }
                      className={`${
                        enrollment.status === 'active'
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-teal-600 hover:text-teal-700'
                      } font-semibold flex items-center space-x-1 transition-colors`}
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
                          d={
                            enrollment.status === 'active'
                              ? 'M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728'
                              : 'M5 13l4 4L19 7'
                          }
                        />
                      </svg>
                      <span>{enrollment.status === 'active' ? 'Expire' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudents;