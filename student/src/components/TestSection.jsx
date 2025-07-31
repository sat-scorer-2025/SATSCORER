import React, { useRef, useEffect } from 'react';

const TestSection = () => {
  const tests = [
    { name: 'Mock Tests', description: 'Simulate the real exam experience with full-length mock tests.', progress: 75 },
    { name: 'Sectional Tests', description: 'Focus on specific sections to improve your weak areas.', progress: 60 },
    { name: 'Topic-Wise Tests', description: 'Master individual topics with targeted practice tests.', progress: 45 },
    { name: 'Adaptive Tests', description: 'Get personalized tests that adapt to your performance.', progress: 80 },
    { name: 'Timed Quizzes', description: 'Practice under time pressure with short, focused quizzes.', progress: 30 },
    { name: 'Past Papers', description: 'Solve previous years’ papers to understand exam patterns.', progress: 50 },
  ];

  // Duplicate tests for infinite scrolling
  const infiniteTests = Array(5).fill(tests).flat().map((test, index) => ({
    ...test,
    id: `${test.name}-${index}`, // Unique key for each card
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

    container.scrollTo({ left: 336 * tests.length, behavior: 'auto' });
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [tests.length]);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 shadow-lg rounded-xl bg-white py-12">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text animate-fadeIn">
          Tests
        </h2>
        <p className="text-xl text-gray-800 text-center mt-4 mb-12 animate-fadeIn">
          Take your prep to the next level with our curated tests.<br />
          Scroll to explore all available test types.
        </p>
        <div className="flex items-center justify-center mb-12">
          <button
            onClick={scrollLeft}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 mr-6 text-4xl font-bold animate-bounce"
            aria-label="Scroll Left"
          >
            ←
          </button>
          <div
            ref={scrollRef}
            className="flex flex-row overflow-hidden space-x-6"
          >
            {infiniteTests.map((test, index) => (
              <div
                key={test.id}
                className="border-2 border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-[2px] flex-none w-80"
              >
                <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center h-full hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 relative">
                  {/* {test.name === 'Mock Tests' && index % tests.length === 0 && (
                    <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-md animate-shake">
                      Featured Test
                    </span>
                  )} */}
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {test.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {test.description}
                  </p>
                  <div className="w-full mb-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Progress: {test.progress}%
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${test.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:animate-pulse transition-colors duration-200">
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 ml-6 text-4xl font-bold animate-bounce"
            aria-label="Scroll Right"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestSection;