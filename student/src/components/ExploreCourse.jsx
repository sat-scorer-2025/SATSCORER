import React, { useState } from 'react';
import image from "../assets/home-illustration.svg";
import { Navigate, useNavigate } from 'react-router-dom';
const ExploreCourse = () => {

  const navigate = useNavigate();

  const [shapeColors, setShapeColors] = useState({
    triangle: 'bg-coral-500',
    circle: 'bg-yellow-400',
    smallCircle: 'bg-teal-500',
  });

  const handleShapeClick = (shape) => {
    const colors = ['bg-coral-500', 'bg-yellow-400', 'bg-teal-500'];
    const currentColor = shapeColors[shape];
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setShapeColors({
      ...shapeColors,
      [shape]: colors[nextIndex],
    });
  };

  return (
    <section className="bg-coral-50 py-16 relative overflow-hidden">
      {/* Geometric Background Shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 clip-path-triangle animate-bounce opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-400 rounded-full animate-bounce delay-200 opacity-30"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-coral-400 clip-path-triangle animate-bounce delay-400 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 bg-white border-4 border-teal-600 rounded-2xl py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side: Text and Button */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-teal-800  mb-4 relative animate-popIn">
              Explore Our Courses
              <span className="absolute -bottom-2 left-0 w-3/4 h-2 bg-teal-500 rounded-full animate-underline"></span>
            </h2>
            <br />
            <p className="text-lg text-coral-700 mb-6 animate-slideInRight">
              Unlock your potential with our expert-led courses.<br />
              Prepare smarter for SAT, GRE, and more!
            </p>
            <button onClick={ () => navigate("/courses")} className="bg-yellow-400 text-teal-800 px-8 py-4 rounded-full text-xl font-bold hover:rotate-3 hover:shadow-lg transition-all duration-300">
              Explore Now
            </button>
          </div>

          {/* Right Side: Image with Geometric Elements */}
          <div className="relative w-full h-96 flex items-center justify-center">
            {/* Interactive Geometric Shapes */}
            <div
              className={`absolute top-0 left-0 w-16 h-16 ${shapeColors.triangle} clip-path-triangle cursor-pointer animate-bounce`}
              onClick={() => handleShapeClick('triangle')}
            ></div>
            <div
              className={`absolute bottom-0 right-0 w-20 h-20 ${shapeColors.circle} rounded-full cursor-pointer animate-bounce delay-200`}
              onClick={() => handleShapeClick('circle')}
            ></div>
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 ${shapeColors.smallCircle} rounded-full cursor-pointer animate-bounce delay-400`}
              onClick={() => handleShapeClick('smallCircle')}
            ></div>

            {/* Image Container */}
            <div className="relative w-100 h-100 hover:scale-105 transition-all duration-300 animate-spinSlow">
              <img
                src={image}
                alt="Student studying with books and laptop, surrounded by charts showing progress, highlighting the benefits of SAT Scorer courses"
                className="w-full h-full  object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreCourse;