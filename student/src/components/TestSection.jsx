import React from 'react';
import { Link } from 'react-router-dom';

const TestSection = () => {
  const tests = [
    { name: 'Mock Tests', description: 'Simulate the real exam experience with full-length mock tests.' },
    { name: 'Topic-Wise Tests', description: 'Master individual topics with targeted practice tests.' },
    { name: 'Sectional Tests', description: 'Focus on specific sections to improve your weak areas.' },
  ];

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
        rel="stylesheet"
      />
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-100 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 bg-white shadow-lg rounded-2xl py-6 sm:py-8 md:py-10 lg:py-12">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-center text-indigo-700 font-[Poppins] mb-6 sm:mb-8 md:mb-10">
            Master Your Tests
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center text-gray-600 mt-3 sm:mt-4 md:mt-5 mb-6 sm:mb-8 md:mb-10 font-[Poppins] font-medium">
            Discover curated tests to boost your exam preparation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {tests.map((test) => (
              <div
                key={test.name}
                className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl p-[1px] w-full sm:w-60 md:w-64 lg:w-72 mx-auto"
              >
                <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center text-center h-full hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                    <span className="text-base sm:text-lg md:text-xl">📝</span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-indigo-900 mb-2 sm:mb-3 md:mb-4 font-[Poppins]">
                    {test.name}
                  </h3>
                  <div className="hidden sm:block text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4 font-[Poppins] font-normal">
                    {test.description}
                  </div>
                  <Link
                    to={`/tests/${test.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    Start Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestSection;