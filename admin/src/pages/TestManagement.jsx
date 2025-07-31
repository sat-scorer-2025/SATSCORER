import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const TestManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header and Tabs */}
      <div className="sticky top-20 z-30 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 px-6 py-4">Test Management Dashboard</h1>
        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {['create', 'manage', 'analytics'].map((tab) => (
            <NavLink
              key={tab}
              to={`/tests/${tab}`}
              className={({ isActive }) =>
                `px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
                  isActive ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {tab === 'create' ? 'Create Test' : tab === 'manage' ? 'Manage Tests' : 'Test Analysis'}
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

export default TestManagement;
