import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Outlet } from 'react-router-dom';
import SearchFilter from './SearchFilter';

const RegisteredStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = 'http://localhost:5000/api';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/user/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { role: 'student' },
        });
        setStudents(response.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch students');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const toggleStudentStatus = async (id, name, email) => {
    try {
      const confirmMessage = `Are you sure you want to ${
        students.find((s) => s._id === id).status === 'active' ? 'disable' : 'enable'
      } ${name} (${email})? ${
        students.find((s) => s._id === id).status === 'active'
          ? 'The student will not be able to login and will see: "You have been blocked by the admin."'
          : ''
      }`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }

      const student = students.find((s) => s._id === id);
      const newStatus = student.status === 'active' ? 'blocked' : 'active';
      await axios.put(
        `${apiUrl}/user/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
      toast.success(`Student status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleViewProfile = (studentId) => {
    navigate(`/students/registered/${studentId}/profile`);
  };

  const filteredStudents = students.filter(
    (student) =>
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registered Students</h2>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showExamFilter={false}
      />
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-gray-600 text-center">No students found.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Registered</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-800">{student.email}</td>
                  <td className="p-4 text-gray-800">{student.phone || 'N/A'}</td>
                  <td className="p-4 text-gray-800">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.status === 'active'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleViewProfile(student._id)}
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => toggleStudentStatus(student._id, student.name, student.email)}
                      className={`${
                        student.status === 'active'
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
                            student.status === 'active'
                              ? 'M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728'
                              : 'M5 13l4 4L19 7'
                          }
                        />
                      </svg>
                      <span>{student.status === 'active' ? 'Disable' : 'Enable'}</span>
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

export default RegisteredStudents;
