import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const location = useLocation(); // Get the current URL path

  const sidebarItems = [
    { name: 'Dashboard', path: '/', icon: assets.dashboard_icon },
    { name: 'Course Management', path: '/courses', icon: assets.course_management_icon },
    { name: 'Test Management', path: '/tests', icon: assets.test_management_icon },
    { name: 'Student Management', path: '/students', icon: assets.student_management_icon },
    { name: 'Sales and Payments', path: '/sales', icon: assets.sales_and_payments_icon },
    { name: 'Update Content', path: '/content', icon: assets.content_upload_icon },
    { name: 'Live Class', path: '/live', icon: assets.live_class_icon },
    { name: 'Free Test Access', path: '/free-tests', icon: assets.test_management_icon },
    { name: 'Announcements', path: '/announcements', icon: assets.announcements_icon },
    { name: 'Support and Feedback', path: '/support', icon: assets.support_and_feedback_icon },
  ];

  return (
    <aside className="bg-white/80 backdrop-blur-md w-64 h-[calc(100vh-80px)] fixed top-20 left-0 z-40 border-r border-gray-300 shadow-sm">
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-lg font-medium transition-colors rounded-md border border-gray-300 ${
                  isActive
                    ? 'text-gray-800 bg-gray-100 font-semibold shadow-md border-teal-500 border-2'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <img src={item.icon} alt={`${item.name} icon`} className="w-6 h-6 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
