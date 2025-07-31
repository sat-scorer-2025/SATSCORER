import React from 'react';

const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  examFilter,
  setExamFilter,
  exams,
  showExamFilter = true,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
      <div className="relative flex-grow mb-4 sm:mb-0">
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      {showExamFilter && (
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Exams</option>
          {exams.map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchFilter;
