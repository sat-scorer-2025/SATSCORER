import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const CreateTest = () => {
  return (
    <div className="space-y-4 scrollbar-hidden">
      {/* Sub-tabs for Create Test */}
      <div className="flex px-6 py-2 bg-white border-b border-gray-200">
        <NavLink
          to="details"
          className={({ isActive }) =>
            `w-1/2 px-4 py-1.5 font-semibold text-sm transition-colors duration-200 rounded-md ${
              isActive
                ? 'border-2 border-teal-600 text-teal-600'
                : 'text-gray-500 hover:bg-gray-100 border-2 border-transparent'
            }`
          }
        >
          Test Details
        </NavLink>
        <NavLink
          to="questions"
          className={({ isActive }) =>
            `w-1/2 px-4 py-1.5 font-semibold text-sm transition-colors duration-200 rounded-md ${
              isActive
                ? 'border-2 border-teal-600 text-teal-600'
                : 'text-gray-500 hover:bg-gray-100 border-2 border-transparent'
            }`
          }
        >
          Add Questions
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default CreateTest;
