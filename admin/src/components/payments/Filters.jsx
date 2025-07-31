import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Filters = ({ searchQuery, setSearchQuery, startDate, setStartDate, endDate, setEndDate, selectedCourse, setSelectedCourse, courses }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Transactions</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search by email or transaction ID..."
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
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <label className="text-gray-700 text-sm font-medium mr-2">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="flex items-center mb-4 sm:mb-0">
            <label className="text-gray-700 text-sm font-medium mr-2">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {courses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
