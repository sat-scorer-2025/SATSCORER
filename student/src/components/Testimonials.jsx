import React from 'react';

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

  const rotations = ['rotate-2', '-rotate-3', 'rotate-1'];

  return (
    <section
      className="bg-gradient-to-b from-amber-50 to-amber-100 py-16 relative"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='none' viewBox='0 0 100 100'%3E%3Cpath fill='%23d97706' fill-opacity='.05' d='M0 0h100v100H0z'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Background Doodles */}
      <div className="absolute top-10 left-10 text-amber-400/30 text-4xl animate-fadeIn">★</div>
      <div className="absolute bottom-10 right-10 text-amber-400/30 text-4xl animate-fadeIn delay-200">♥</div>

      <div className="max-w-7xl mx-auto px-4 shadow-lg rounded-xl py-12 bg-amber-50/50">
        <h2 className="text-4xl font-handwritten text-amber-900 text-center rotate-1 mb-4 animate-fadeIn">
          What Our Students Say
        </h2>
        <p className="text-lg font-mono text-amber-700 text-center mt-4 mb-12 animate-fadeIn">
          Hear from students who achieved their dreams with SAT Scorer.<br />
          Their success stories inspire us every day!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`relative bg-white border-8 border-b-[24px] border-white shadow-md rounded-md p-6 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:rotate-0 transition-all duration-300 animate-popIn ${rotations[index]}`}
            >
              {/* Pushpin */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-md"></div>
              {/* Tape */}
              <div className="absolute top-0 right-0 w-12 h-6 bg-amber-300/70 rotate-45 transform translate-x-4 -translate-y-2"></div>

              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-6">
                <img
                  src=""
                  alt={`${testimonial.name} Avatar`}
                  className="w-full h-full rounded-full object-cover filter sepia-50"
                />
              </div>
              <p className="text-lg font-mono text-gray-800 mb-4 relative">
                <span className="absolute -left-4 top-0 text-amber-600 text-2xl">"</span>
                {testimonial.quote}
                <span className="absolute -right-4 bottom-0 text-amber-600 text-2xl">"</span>
              </p>
              <h3 className="text-xl font-handwritten text-amber-900 mb-2">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-600">
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;