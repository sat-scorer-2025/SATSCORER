import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/StudentDashboard/Sidebar';

const StudentDashboard = () => {
  const location = useLocation();
  const isViewCourse = location.pathname.startsWith('/studentdashboard/mycourses/viewcourse');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:ml-64 mt-16 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        {!isViewCourse && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Student Dashboard</h1>
            <hr className="border-b-2 mt-4 border-gray-300"/>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;
