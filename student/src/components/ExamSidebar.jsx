import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ExamSidebar = () => {
  const exams = ['sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];
  const location = useLocation();

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-950 to-purple-950 text-white hidden lg:block font-sans shadow-md">
      <nav className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6 tracking-wide">Exams</h2>
        <ul className="space-y-3">
          {exams.map((exam) => (
            <li key={exam}>
              <Link
                to={`/exams/${exam}`}
                className={`block px-4 py-3 rounded-lg text-base font-medium uppercase transition-all duration-200 transform ${
                  location.pathname === `/exams/${exam}`
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-200 hover:bg-purple-700 hover:text-white hover:scale-105 hover:shadow-sm'
                }`}
              >
                {exam}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ExamSidebar;