import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const { enrolledcourseId } = useParams();
  const isViewCourse = location.pathname.startsWith('/studentdashboard/mycourses/viewcourse');

  const dashboardNavItems = [
    { name: 'My Courses', path: '/studentdashboard/mycourses' },
    { name: 'Support', path: '/studentdashboard/support' },
    { name: 'Settings', path: '/studentdashboard/settings' },
  ];

  const courseNavItems = [
    { name: 'Videos/Lectures', path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/lectures` },
    { name: 'Notes', path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/notes` },
    { name: 'Live Sessions/Class', path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/classes` },
    { name: 'Tests', path: `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests` },
  ];

  const navItems = isViewCourse ? courseNavItems : dashboardNavItems;

  return (
    <div className="bg-gray-800 text-white w-full md:w-64 md:fixed md:top-16 md:h-[calc(100vh-64px)] p-4 md:p-6 flex flex-col">
      <h2 className="text-lg sm:text-xl font-semibold mb-6 hidden md:block">
        {isViewCourse ? 'Course Menu' : 'Dashboard Menu'}
      </h2>
      <hr className="border-b-2 border-gray-400"/>
      <nav className="flex-1 my-8">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded text-sm sm:text-base transition duration-200 ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
