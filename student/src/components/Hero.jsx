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
    <section
      className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 relative overflow-hidden"
      style={{
        marginTop: '8rem',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none' viewBox='0 0 200 200'%3E%3Cpath d='M0 100C50 50 150 150 200 100' stroke='%239ca3af' stroke-opacity='.1' stroke-width='2'/%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-20 bg-blue-200/20 animate-wave"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 bg-white shadow-md rounded-2xl py-16 relative">
        <div className="absolute -top-6 -left-6 bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full animate-fadeIn">
          95% Success Rate
        </div>
        <div className="absolute -top-6 -right-6 bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full animate-fadeIn delay-200">
          50+ Courses
        </div>

        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight mb-4 animate-slideInLeft">
            Ace Your International Exams with Confidence
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-600 animate-fadeIn">
            Expert instructors, personalized learning paths, and real test simulations – all in one place.
          </p>
          <div className="flex items-center justify-center md:justify-start mb-6">
            <span className="bg-blue-100 text-blue-900 text-sm font-semibold px-4 py-2 rounded-full animate-bounce">
              Trusted by 2,000+ Students
              <span className="ml-2 text-blue-500">✔</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => navigate("/courses")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-xl font-medium hover:bg-blue-700 transition-all duration-300 animate-pulse"
            >
              Browse Courses
            </button>
            <button
              onClick={handleTryFreeTest}
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-md text-xl font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Try Free Test
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          <div className="relative w-80 h-80 rounded-xl rotate-2 hover:brightness-110 transition-all duration-300 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-transparent rounded-xl -z-10"></div>
            <img
              src={heroImg}
              alt="SAT Scorer Hero Image"
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ExamSelectionModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default Hero;