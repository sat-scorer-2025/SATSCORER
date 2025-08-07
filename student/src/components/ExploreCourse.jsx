import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../assets/home-illustration.svg";

const ExploreCourse = () => {
  const navigate = useNavigate();

  const [shapeColors, setShapeColors] = useState({
    triangle: 'bg-indigo-500',
    circle: 'bg-purple-400',
    smallCircle: 'bg-indigo-300',
  });

  const handleShapeClick = (shape) => {
    const colors = ['bg-indigo-500', 'bg-purple-400', 'bg-indigo-300'];
    const currentColor = shapeColors[shape];
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setShapeColors({
      ...shapeColors,
      [shape]: colors[nextIndex],
    });
  };

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
        rel="stylesheet"
      />
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-100 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 relative overflow-hidden backdrop-blur-sm bg-opacity-90">
        {/* Geometric Background Shapes */}
        <div className="absolute top-0 left-0 w-16 sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 bg-indigo-200 clip-path-triangle animate-bounce opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-purple-200 rounded-full animate-bounce delay-200 opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-indigo-300 clip-path-triangle animate-bounce delay-400 opacity-30"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 bg-white shadow-lg rounded-2xl py-6 sm:py-8 md:py-10 lg:py-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
            {/* Left Side: Text and Button */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left px-3 sm:px-0">
              <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-indigo-700 font-[Poppins] mb-4 sm:mb-5 md:mb-6 relative animate-popIn">
                Explore Our Courses
                <span className="absolute -bottom-2 left-0 w-3/4 h-1 bg-indigo-500 rounded-full animate-underline"></span>
              </h2>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-4 sm:mb-5 md:mb-6 font-[Poppins] font-medium animate-slideInRight">
                Unlock your potential with our expert-led courses.<br />
                Prepare smarter for SAT, GRE, and more!
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 sm:px-5 md:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Explore Now
              </button>
            </div>

            {/* Right Side: Image with Geometric Elements */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center">
              {/* Interactive Geometric Shapes */}
              <div
                className={`absolute top-0 left-0 w-12 sm:w-14 md:w-16 lg:w-20 h-12 sm:h-14 md:h-16 lg:h-20 ${shapeColors.triangle} clip-path-triangle cursor-pointer animate-bounce`}
                onClick={() => handleShapeClick('triangle')}
              ></div>
              <div
                className={`absolute bottom-0 right-0 w-16 sm:w-18 md:w-20 lg:w-24 h-16 sm:h-18 md:h-20 lg:h-24 ${shapeColors.circle} rounded-full cursor-pointer animate-bounce delay-200`}
                onClick={() => handleShapeClick('circle')}
              ></div>
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 ${shapeColors.smallCircle} rounded-full cursor-pointer animate-bounce delay-400`}
                onClick={() => handleShapeClick('smallCircle')}
              ></div>

              {/* Image Container */}
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hover:scale-105 transition-all duration-300">
                <img
                  src={image}
                  alt="Student studying with books and laptop, surrounded by charts showing progress, highlighting the benefits of SAT Scorer courses"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for Triangle Shape and Animations */}
        <style jsx>{`
          .clip-path-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          .animate-underline {
            animation: underline 1s ease-in-out forwards;
          }
          @keyframes underline {
            0% {
              width: 0;
            }
            100% {
              width: 75%;
            }
          }
          .animate-popIn {
            animation: popIn 0.5s ease-out forwards;
          }
          @keyframes popIn {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-slideInRight {
            animation: slideInRight 0.5s ease-out forwards;
          }
          @keyframes slideInRight {
            0% {
              transform: translateX(20px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-bounce {
            animation: bounce 2s infinite ease-in-out;
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default ExploreCourse;