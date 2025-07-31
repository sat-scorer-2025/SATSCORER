import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const FreeTestResult = () => {
  const { examType } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { score, total } = state || { score: 0, total: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-2xl rounded-lg p-10 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-blue-900 mb-4">{examType} Test Result</h2>
        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-2">Your Score</p>
          <div className="text-5xl font-extrabold text-green-600 animate-pulse">
            {score} / {total}
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md"
          >
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeTestResult;