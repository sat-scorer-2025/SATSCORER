import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const CourseManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header and Tabs */}
      <div className="sticky top-20 z-10 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 p-4">Course Management Dashboard</h1>
        <div className="flex border-b border-gray-200 px-4">
          <NavLink
            to="create"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                isActive
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Create Course
          </NavLink>
          <NavLink
            to="content"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                isActive
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Upload Content
          </NavLink>
          <NavLink
            to="manage"
            className={({ isActive }) =>
              `px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                isActive
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Manage Courses
          </NavLink>
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CourseManagement;
