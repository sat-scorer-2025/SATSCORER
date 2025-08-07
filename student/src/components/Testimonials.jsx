import React, { useRef } from 'react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'SAT Student',
      quote: 'SAT Scorer transformed my prep! The mock tests and mentorship helped me score 1500 on my SAT.',
    },
    {
      name: 'Rahul Sharma',
      role: 'GRE Aspirant',
      quote: 'The topic-wise tests and live sessions were a game-changer. I scored 325 on the GRE thanks to SAT Scorer!',
    },
    {
      name: 'Emily Chen',
      role: 'GMAT Candidate',
      quote: 'The sectional tests and expert guidance made all the difference. I achieved a 720 on my GMAT!',
    },
  ];

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
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

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 bg-white shadow-lg rounded-2xl py-6 sm:py-8 md:py-10 lg:py-12">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-center text-indigo-700 font-[Poppins] mb-6 sm:mb-8 md:mb-10">
            What Our Students Say
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center text-gray-600 mt-3 sm:mt-4 md:mt-5 mb-6 sm:mb-8 md:mb-10 font-[Poppins] font-medium">
            Hear from students who achieved their dreams with SAT Scorer.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={scrollLeft}
              className="flex text-indigo-400 w-8 sm:w-10 h-8 sm:h-10 items-center justify-center rounded-xl hover:text-indigo-500 hover:scale-105 transition-all duration-300 ease-in-out mr-4 sm:mr-4 md:hidden"
              aria-label="Scroll Left"
            >
              ❮
            </button>
            <div
              ref={scrollRef}
              className="flex flex-row sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hidden snap-x snap-mandatory w-full max-w-[calc(100%-64px)] sm:max-w-full md:max-w-full md:overflow-hidden"
            >
              <style>{`
                .scrollbar-hidden::-webkit-scrollbar {
                  display: none;
                }
                .snap-x {
                  scroll-snap-type: x mandatory;
                }
                .snap-mandatory > div {
                  scroll-snap-align: center;
                }
                .clip-path-triangle {
                  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
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
              `}</style>
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl p-[1px] w-full sm:w-60 md:w-64 lg:w-72 mx-auto flex-none snap-center md:snap-none"
                >
                  <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center text-center h-full hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out animate-popIn">
                    <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                      <span className="text-base sm:text-lg md:text-xl">👤</span>
                    </div>
                    <p className="text-sm sm:text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4 font-[Poppins] font-medium relative">
                      <span className="absolute -left-3 sm:-left-4 top-0 text-indigo-600 text-lg sm:text-xl md:text-2xl">"</span>
                      {testimonial.quote}
                      <span className="absolute -right-3 sm:-right-4 bottom-0 text-indigo-600 text-lg sm:text-xl md:text-2xl">"</span>
                    </p>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-indigo-900 mb-1 sm:mb-2 font-[Poppins]">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 font-[Poppins] font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="flex text-indigo-400 w-8 sm:w-10 h-8 sm:h-10 items-center justify-center rounded-xl hover:text-indigo-500 hover:scale-105 transition-all duration-300 ease-in-out ml-4 sm:ml-4 md:hidden"
              aria-label="Scroll Right"
            >
              ❯
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialSection;