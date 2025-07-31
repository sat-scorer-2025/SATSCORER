import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const ProfileDialog = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${studentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStudent(response.data.user);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch student');
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (!student) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white border-2 border-gray-300 shadow-2xl rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-8">
          <p className="text-red-500">Student not found.</p>
          <button
            onClick={() => navigate('/students/registered')}
            className="mt-4 px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Back to Registered Students
          </button>
        </div>
      </div>
    );
  }

  const address = student.address || `${student.city || 'New York'}, NY, USA`;
  const profilePhoto = student.profilePhoto || 'https://via.placeholder.com/150';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-gray-300 shadow-2xl rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b-2 border-gray-300 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Profile: {student.name}
          </h2>
          <div className="flex items-center space-x-4">
            <img
              src={profilePhoto}
              alt={`${student.name}'s profile`}
              className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-md object-cover"
            />
            <button
              onClick={() => navigate('/students/registered')}
              className="text-gray-600 hover:bg-gray-100 rounded-full p-2.5 transition-colors"
              aria-label="Close profile dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Full Name:</strong> {student.name}</p>
              <p><strong>Email Address:</strong> {student.email}</p>
              <p><strong>Phone Number:</strong> {student.phone || 'Not provided'}</p>
              <p><strong>Date of Birth:</strong> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>University:</strong> {student.university || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDialog;