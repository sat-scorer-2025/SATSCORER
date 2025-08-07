import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import heroImg from '../assets/home-illustration.svg';
import ExamSelectionModal from '../components/ExamSelectionModal';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTryFreeTest = () => {
    if (!user) {
      navigate('/login');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;800&display=swap"
        rel="stylesheet"
      />
      <section
        className="bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-12 sm:pt-10 md:py-12 lg:py-16 xl:py-20 relative overflow-hidden min-h-[600px] sm:min-h-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none' viewBox='0 0 200 200'%3E%3Cpath d='M0 100C50 50 150 150 200 100' stroke='%239ca3af' stroke-opacity='.1' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px sm:200px 200px md:250px 250px lg:300px 300px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full h-8 sm:h-10 md:h-12 lg:h-16 bg-blue-200/20 animate-wave"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 bg-white shadow-lg rounded-2xl py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 relative">
          {/* Tags for 95% Success Rate and 50+ Courses - hidden on mobile */}
          <div className="md:block ml-4 absolute top-[-1.5rem] left-[-1rem] bg-blue-500 text-white text-sm md:text-base font-semibold px-3 md:px-4 py-1.5 rounded-full animate-fadeIn transition-all duration-300 ease-in-out z-10">
            95% Success Rate
          </div>
          <div className="md:block mr-4 absolute top-[-1.5rem] right-[-1rem] bg-blue-500 text-white text-sm md:text-base font-semibold px-3 md:px-4 py-1.5 rounded-full animate-fadeIn delay-200 transition-all duration-300 ease-in-out z-10">
            50+ Courses
          </div>

          <div className="md:w-1/2 text-center md:text-left my-8 sm:my-8 md:my-10 lg:my-0 px-3 sm:px-4 md:px-6">
            {/* Image for mobile */}
            <div className="md:hidden flex justify-center mb-8">
              <img
                src={heroImg}
                alt="SAT Scorer Hero Image"
                className="w-64 sm:w-72 h-auto object-cover"
              />
            </div>
            <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-blue-900 leading-tight mb-4 sm:mb-5 md:mb-6 font-[Poppins] animate-slideInLeft">
              <span className="block">Your Will & Our Drill</span>
              <span className="block">Create the Magic Skill</span>
            </h1>
            <p className="text-sm sm:text-sm md:text-base xl:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 font-[Poppins] font-medium animate-fadeIn">
              Excel in SAT, GRE, GMAT, and more with personalized study plans, expert-led courses, and realistic practice tests for top scores.
            </p>
            <div className="flex items-center justify-center md:justify-start mt-6 mb-4 sm:mb-5 md:mb-6">
              <span className="bg-blue-100 text-blue-900 text-sm md:text-base font-semibold px-3 md:px-4 py-1.5 rounded-full animate-bounce transition-all duration-300 ease-in-out">
                Trusted by 2,000+ Students
                <span className="ml-2 text-blue-500">✔</span>
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/courses")}
                className="w-full md:w-auto bg-blue-600 text-white px-4 sm:px-5 md:px-6 lg:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm md:text-base font-semibold hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Browse Courses
              </button>
              <button
                onClick={handleTryFreeTest}
                className="w-full md:w-auto border-2 border-blue-600 text-blue-600 px-4 sm:px-5 md:px-6 lg:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm md:text-base font-semibold hover:bg-blue-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Try Free Test
              </button>
            </div>
          </div>

          {/* Image for desktop */}
          <div className="hidden md:flex md:w-1/2 justify-center relative">
            <img
              src={heroImg}
              alt="SAT Scorer Hero Image"
              className="w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96 h-auto object-cover"
            />
          </div>
        </div>

        {isModalOpen && (
          <ExamSelectionModal
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </section>
    </>
  );
};

export default Hero;