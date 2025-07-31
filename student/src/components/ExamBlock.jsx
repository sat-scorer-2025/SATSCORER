import React, { useRef, useEffect } from 'react';
import {Link} from 'react-router-dom'
const ExamBlock = () => {
  const exams = [
    { name: 'SAT', description: 'Prepare for the SAT with comprehensive tests and personalized mentorship.' },
    { name: 'GRE', description: 'Ace the GRE with topic-wise and mock tests tailored to your needs.' },
    { name: 'GMAT', description: 'Boost your GMAT score with sectional tests and expert guidance.' },
    { name: 'IELTS', description: 'Excel in IELTS with practice tests and one-on-one mentorship.' },
    { name: 'AP', description: 'Get ready for AP exams with targeted topic-wise tests.' },
    { name: 'ACP', description: 'Master ACP exams with mock tests and personalized strategies.' },
  ];

  // Duplicate exams for infinite scrolling
  const infiniteExams = Array(5).fill(exams).flat().map((exam, index) => ({
    ...exam,
    id: `${exam.name}-${index}`, // Unique key for each card
  }));

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -336, behavior: 'smooth' }); // 336 = card width (320px) + space-x-6 (16px)
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 336, behavior: 'smooth' }); // 336 = card width (320px) + space-x-6 (16px)
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const threshold = 1; // Small threshold to prevent jitter
      if (scrollLeft + clientWidth >= scrollWidth - threshold) {
        container.scrollTo({ left: clientWidth, behavior: 'auto' });
      } else if (scrollLeft <= threshold) {
        container.scrollTo({ left: scrollWidth - clientWidth * 2, behavior: 'auto' });
      }
    };

    container.scrollTo({ left: 336 * exams.length, behavior: 'auto' });
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [exams.length]);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-teal-50 py-16">
      <div className="max-w-7xl mx-auto px-4 shadow-lg rounded-xl bg-white py-12">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text animate-fadeIn">
          Exams
        </h2>
        <p className="text-xl text-gray-800 text-center mt-4 mb-12 animate-fadeIn">
          Discover a wide range of exams to help you succeed.<br />
          Scroll through and find the perfect Exam for your goals.
        </p>
        <div className="flex items-center justify-center mb-12">
          <button
            onClick={scrollLeft}
            className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 mr-6 text-4xl font-bold animate-bounce"
            aria-label="Scroll Left"
          >
            ←
          </button>
          <div
            ref={scrollRef}
            className="flex flex-row overflow-hidden space-x-6"
          >
            {infiniteExams.map((exam, index) => (
              <div
                key={exam.id}
                className="border-2 border-transparent bg-gradient-to-r from-teal-600 to-indigo-600 rounded-lg p-[2px] flex-none w-80"
              >
                <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center h-full hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 relative">
                  {/* {exam.name === 'SAT' && index % exams.length === 0 && (
                    <span className="absolute -top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-300 to-teal-500 text-gray-900 text-base font-bold px-6 py-2 rounded-full shadow-md border border-white z-10 animate-shake">
                      Top Choice
                    </span>
                  )} */}
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {exam.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {exam.description}
                  </p>
                  <div className="w-full mb-4">
                    <div className="text-sm text-teal-600 font-medium animate-pulse">
                      Limited Time Offer: 3 Days Left!
                    </div>
                  </div>
                  <Link to={`/exams/${(exam.name).toLowerCase()}`} className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:animate-pulse transition-colors duration-200">
                    Click Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 ml-6 text-4xl font-bold animate-bounce"
            aria-label="Scroll Right"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExamBlock;