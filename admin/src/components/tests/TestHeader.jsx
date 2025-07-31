import React, { useEffect } from 'react';

const TestHeader = ({
  selectedCourse,
  setSelectedCourse,
  testType,
  setTestType,
  examType,
  setExamType,
  title,
  setTitle,
  description,
  setDescription,
  duration,
  setDuration,
  attempts,
  setAttempts,
  markingScheme,
  setMarkingScheme,
  errors,
  examTypes,
  testTypes,
  courses,
}) => {
  // Auto-select exam type based on selected course
  useEffect(() => {
    if (selectedCourse && courses.length > 0) {
      const course = courses.find((c) => c._id === selectedCourse);
      if (course && course.examType && course.examType !== examType) {
        setExamType(course.examType);
      }
    }
  }, [selectedCourse, courses, setExamType]);

  return (
    <div className="bg-white rounded-xl p-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Test Details</h2>
      <div className="space-y-6">
        {/* First Row: Course and Exam Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.course && <p className="text-red-500 text-xs mt-2">{errors.course}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled
            >
              <option value="">{examType || 'Auto-selected based on course'}</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.examType && <p className="text-red-500 text-xs mt-2">{errors.examType}</p>}
          </div>
        </div>
        {/* Second Row: Test Title and Test Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Test Title</label>
            <input
              type="text"
              placeholder="Enter test title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            />
            {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Test Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            >
              <option value="">Select Test Type</option>
              {testTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.testType && <p className="text-red-500 text-xs mt-2">{errors.testType}</p>}
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Enter test description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            rows="4"
          />
        </div>
        {/* Third Row: Duration, Attempts, Marking Scheme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              min="1"
            />
            {errors.duration && <p className="text-red-500 text-xs mt-2">{errors.duration}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attempts</label>
            <input
              type="number"
              value={attempts}
              onChange={(e) => setAttempts(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              min="1"
            />
            {errors.attempts && <p className="text-red-500 text-xs mt-2">{errors.attempts}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Marking Scheme</label>
            <input
              type="text"
              placeholder="e.g., +1 for correct, -0.25 for incorrect"
              value={markingScheme}
              onChange={(e) => setMarkingScheme(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            />
            {errors.markingScheme && <p className="text-red-500 text-xs mt-2">{errors.markingScheme}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeader;
