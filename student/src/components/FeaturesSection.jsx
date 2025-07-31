import React, { useEffect, useRef } from 'react';
import liveclass from "../assets/liveclass.svg";
import syllabus from "../assets/syllabus.svg";
import learn from "../assets/learn.svg";

const FeaturesSection = () => {
  const features = [
    {
      title: 'Daily Live Classes',
      description: 'Engage with educators in real-time, ask questions, participate in live polls, and clear your doubts instantly.',
      img: liveclass,
    },
    {
      title: 'Practice and Revise',
      description: 'Boost your learning with our practice section, mock tests, and downloadable lecture notes for anytime revision.',
      img: syllabus,
    },
    {
      title: 'Learn Anytime, Anywhere',
      description: 'Access all live and recorded classes with one subscription, from any device, at your convenience.',
      img: learn,
    },
  ];

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Scroll Animation
  useEffect(() => {
    const handleScroll = () => {
      const cards = cardsRef.current;

      cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight * 0.85) {
          card.classList.add('opacity-100', 'translate-y-0');
          card.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax Tilt Effect
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * 15; // Max tilt 15 degrees
    const tiltY = -(x / rect.width) * 15;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100 relative overflow-hidden">
      {/* Bouncing Balls Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="ball ball-1"></div>
        <div className="ball ball-2"></div>
        <div className="ball ball-3"></div>
        <div className="ball ball-4"></div>
        <div className="ball ball-5"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-gray-800 text-center mb-16">
          Elevate Your Learning with SAT Scorer
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative bg-white rounded-xl p-6 flex flex-col items-center text-center opacity-0 translate-y-10 transition-all duration-700 ease-out shadow-lg hover:shadow-xl"
              onMouseMove={(e) => handleMouseMove(e, cardsRef.current[index])}
              onMouseLeave={() => handleMouseLeave(cardsRef.current[index])}
            >
              {/* Image with Accent Border */}
              <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <img
                  src={feature.img}
                  alt={`${feature.title} Icon`}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              {/* Text Content */}
              <h3 className="text-2xl font-sans font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed max-w-xs">
                {feature.description}
              </p>
              <a
                href="#learn-more"
                className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Parallax Effect and Bouncing Balls Animation */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .ball {
          position: absolute;
          border-radius: 50%;
          animation: bounce 2s infinite ease-in-out;
        }
        .ball-1 {
          width: 15px;
          height: 15px;
          background-color: #4CAF50;
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }
        .ball-2 {
          width: 12px;
          height: 12px;
          background-color: #2196F3;
          top: 30%;
          left: 70%;
          animation-delay: -0.5s;
        }
        .ball-3 {
          width: 18px;
          height: 18px;
          background-color: #F44336;
          top: 60%;
          left: 25%;
          animation-delay: -1s;
        }
        .ball-4 {
          width: 10px;
          height: 10px;
          background-color: #FF9800;
          top: 50%;
          left: 80%;
          animation-delay: -1.5s;
        }
        .ball-5 {
          width: 14px;
          height: 14px;
          background-color: #9C27B0;
          top: 80%;
          left: 40%;
          animation-delay: -2s;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;