import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import HandholdingCard from '../components/HandholdingCard';

const ExamPage = () => {
  const { examType } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Static Exam Details
  const examDetails = {
    sat: {
      name: 'SAT',
      description: 'The SAT is a standardized test widely used for college admissions in the United States.',
      syllabus: 'Reading, Writing and Language, Math (with and without calculator), Essay (optional).',
      pattern: 'Total 1600 points, 3 hours (plus 50 minutes for Essay), multiple-choice and grid-in questions.',
      benefits: 'Accepted by most US colleges, showcases academic readiness, improves scholarship opportunities.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=400',
    },
    gre: {
      name: 'GRE',
      description: 'The GRE is required for admission to many graduate programs worldwide.',
      syllabus: 'Verbal Reasoning, Quantitative Reasoning, Analytical Writing.',
      pattern: 'Computer-based, 3 hours 45 minutes, scored 260-340 (plus writing 0-6).',
      benefits: 'Versatile for grad school, accepted globally, measures critical thinking.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=400',
    },
    gmat: {
      name: 'GMAT',
      description: 'The GMAT is used for admission to MBA and other business programs.',
      syllabus: 'Analytical Writing, Integrated Reasoning, Quantitative, Verbal.',
      pattern: '3 hours 7 minutes, scored 200-800, computer-adaptive.',
      benefits: 'Essential for MBA admissions, globally recognized, tests business aptitude.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=400',
    },
    ielts: {
      name: 'IELTS',
      description: 'IELTS tests English proficiency for study, work, or migration.',
      syllabus: 'Listening, Reading, Writing, Speaking.',
      pattern: '2 hours 45 minutes, scored 0-9, paper or computer-based.',
      benefits: 'Accepted for visas, universities, and jobs in English-speaking countries.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=400',
    },
    act: {
      name: 'ACT',
      description: 'The ACT is an alternative to the SAT for college admissions.',
      syllabus: 'English, Math, Reading, Science, Writing (optional).',
      pattern: '2 hours 55 minutes (plus 40 minutes for Writing), scored 1-36.',
      benefits: 'Widely accepted, tests curriculum-based skills, good for science-focused students.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=400',
    },
    ap: {
      name: 'AP',
      description: 'Advanced Placement courses for high school students to earn college credit.',
      syllabus: 'Varies by subject (e.g., AP Calculus, AP Literature).',
      pattern: '2-3 hours per exam, scored 1-5, mix of multiple-choice and free-response.',
      benefits: 'Earn college credits, stand out in admissions, prepare for college rigor.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=400',
    },
  };

  const details = examDetails[examType?.toLowerCase()] || examDetails['sat'];

  // Mock Reviews
  const reviews = [
    { name: 'John D.', rating: 5, comment: 'This SAT course was a game-changer! Scored 1500!' },
    { name: 'Sarah K.', rating: 4, comment: 'Great content, but I’d love more practice tests.' },
    { name: 'Mike P.', rating: 5, comment: 'Mentors were amazing, highly recommend!' },
  ];

  // Fetch Courses for the selected exam
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/course/`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log('Fetched courses:', data);

        if (response.ok) {
          // Filter courses by examType (case-insensitive)
          const filteredCourses = data.courses.filter(
            (course) => course.examType.toUpperCase() === examType.toUpperCase()
          );
          setCourses(filteredCourses);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setError('Network error: Unable to connect to the server');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [examType, API_URL]);

  return (
    <div className="space-y-6">
      {/* Exam Details Section */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{details.name}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img src={details.image} alt={details.name} className="w-full h-48 object-cover rounded-lg" />
          </div>
            <div className="space-y-2 text-gray-700">
              <div>
                <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 pb-1">About the Exam</h2>
                <p className="text-gray-600 text-sm">{details.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 pb-1">Syllabus</h3>
                <p className="text-gray-600 text-sm">{details.syllabus}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 pb-1">Pattern</h3>
                <p className="text-gray-600 text-sm">{details.pattern}</p>
              </div>
              <div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 pb-1">Why Take It?</h3>
                  <p className="text-gray-600 text-sm">{details.benefits}</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Handholding Card Section */}
      <section>
        <HandholdingCard />
      </section>

      {/* Related Courses Section */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Courses for {details.name}</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading courses...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={course._id}
                className="animate-zoom-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard
                  course={{
                    id: course._id,
                    title: course.title,
                    examType: course.examType,
                    startDate: course.startDate
                      ? new Date(course.startDate).toLocaleDateString()
                      : 'TBD',
                    endDate: course.endDate
                      ? new Date(course.endDate).toLocaleDateString()
                      : 'TBD',
                    price: course.price.toString(),
                    thumbnail: course.thumbnail || 'https://via.placeholder.com/600x400',
                    about: course.about || 'No description available',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No courses available for {details.name}</p>
        )}
      </section>

      {/* Reviews Section */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-xl shadow-sm animate-zoom-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-indigo-800 font-medium text-base mr-3">
                  {review.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-800">{review.name}</h3>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.63 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 0 0 0-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 0 0 0-.364-1.118L2.298 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 0 0 0 .95-.69l1.63-3.957z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExamPage;