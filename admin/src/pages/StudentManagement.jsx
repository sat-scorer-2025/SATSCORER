import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const StudentManagement = () => {
  const tabs = [
    { id: 'registered', label: 'Registered Students', path: 'registered' },
    { id: 'enrollments', label: 'Enrollments', path: 'enrollments' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header and Tabs */}
      <div className="sticky top-20 z-10 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 p-4">
          Student Management Dashboard
        </h1>
        <div className="flex border-b border-gray-200 px-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                  isActive
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              aria-label={`Select ${tab.label} tab`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentManagement;
