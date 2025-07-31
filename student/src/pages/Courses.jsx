// import React, { useState, useEffect } from 'react';
// import CourseCard from '../components/CourseCard';
// import { Link } from 'react-router-dom';
// import Footer from '../components/Footer'

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedExam, setSelectedExam] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/course', {
//           headers: { 'Content-Type': 'application/json' },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setCourses(data.courses);
//           setFilteredCourses(data.courses);
//         } else {
//           setError(data.message || 'Failed to fetch courses');
//         }
//       } catch (err) {
//         setError('Network error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     let filtered = courses;
//     if (selectedExam !== 'all') {
//       filtered = filtered.filter((course) => course.examType.toLowerCase() === selectedExam);
//     }
//     if (searchQuery) {
//       filtered = filtered.filter((course) =>
//         course.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     setFilteredCourses(filtered);
//   }, [selectedExam, searchQuery, courses]);

//   const examTypes = ['all', 'sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <svg
//             className="animate-spin h-12 w-12 text-purple-700"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//             ></path>
//           </svg>
//           <p className="mt-4 text-gray-700 font-semibold animate-pulse">Loading your courses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <svg
//             className="mx-auto h-16 w-16 text-red-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <p className="mt-4 text-red-600 font-semibold text-lg">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const featuredCourse = filteredCourses[0];

//   return (
//     <>
//       <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen mt-16">
//         {/* Hero Section */}
//         <div
//           className="relative bg-cover bg-center py-24"
//           style={{
//             backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=1920&h=600')`,
//           }}
//         >
//           <div className="max-w-7xl mx-auto px-4 text-center text-white">
//             <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
//               Unlock Your Academic Potential
//             </h1>
//             <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in delay-200">
//               Join our top-tier courses for SAT, GRE, IELTS, and more, designed to help you excel.
//             </p>
//             <Link
//               to="/courses"
//               className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105 shadow-lg animate-fade-in delay-400"
//             >
//               Explore Courses
//             </Link>
//           </div>
//         </div>

//         {/* Filter and Search Section */}
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//             <h2 className="text-3xl font-extrabold text-gray-800">Find Your Courses</h2>
//             <input
//               type="text"
//               placeholder="Search courses..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full md:w-80 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm transition bg-white"
//             />
//           </div>
//           <div className="flex flex-wrap gap-3 mb-10">
//             {examTypes.map((exam) => (
//               <button
//                 key={exam}
//                 onClick={() => setSelectedExam(exam)}
//                 className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
//                   selectedExam === exam
//                     ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 {exam === 'all' ? 'All' : exam.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           {/* Featured Course */}
//           {featuredCourse && (
//             <div className="mb-12">
//               <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//                 Featured Course
//               </h3>
//               <div className="flex justify-center">
//                 <CourseCard
//                   course={{
//                     id: featuredCourse._id,
//                     title: featuredCourse.title,
//                     examType: featuredCourse.examType,
//                     startDate: featuredCourse.startDate
//                       ? new Date(featuredCourse.startDate).toLocaleDateString()
//                       : 'TBD',
//                     endDate: featuredCourse.endDate
//                       ? new Date(featuredCourse.endDate).toLocaleDateString()
//                       : 'TBD',
//                     price: featuredCourse.price.toString(),
//                     thumbnail:
//                       featuredCourse.thumbnail || 'https://via.placeholder.com/600x400',
//                     about: featuredCourse.about || 'No description available',
//                     isFeatured: true,
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Courses Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredCourses.length > 0 ? (
//               filteredCourses.map((course, index) => (
//                 <div
//                   key={course._id}
//                   className="animate-fade-in-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <CourseCard
//                     course={{
//                       id: course._id,
//                       title: course.title,
//                       examType: course.examType,
//                       startDate: course.startDate
//                         ? new Date(course.startDate).toLocaleDateString()
//                         : 'TBD',
//                       endDate: course.endDate
//                         ? new Date(course.endDate).toLocaleDateString()
//                         : 'TBD',
//                       price: course.price.toString(),
//                       thumbnail: course.thumbnail || 'https://via.placeholder.com/600x400',
//                       about: course.about || 'No description available',
//                     }}
//                   />
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-600 col-span-full text-lg">
//                 No courses found. Try adjusting your search or filters.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default Courses;


import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/course`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses);
          setFilteredCourses(data.courses);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (selectedExam !== 'all') {
      filtered = filtered.filter((course) => course.examType.toLowerCase() === selectedExam);
    }
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [selectedExam, searchQuery, courses]);

  const examTypes = ['all', 'sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-purple-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-700 font-semibold animate-pulse">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-red-600 font-semibold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredCourse = filteredCourses[0];

  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen mt-16">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center py-24"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=1920&h=600')`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
              Unlock Your Academic Potential
            </h1>
            <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in delay-200">
              Join our top-tier courses for SAT, GRE, IELTS, and more, designed to help you excel.
            </p>
            <Link
              to="/courses"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105 shadow-lg animate-fade-in delay-400"
            >
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Find Your Courses</h2>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-80 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm transition bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-3 mb-10">
            {examTypes.map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                  selectedExam === exam
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {exam === 'all' ? 'All' : exam.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Featured Course */}
          {featuredCourse && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Featured Course
              </h3>
              <div className="flex justify-center">
                <CourseCard
                  course={{
                    id: featuredCourse._id,
                    title: featuredCourse.title,
                    examType: featuredCourse.examType,
                    startDate: featuredCourse.startDate
                      ? new Date(featuredCourse.startDate).toLocaleDateString()
                      : 'TBD',
                    endDate: featuredCourse.endDate
                      ? new Date(featuredCourse.endDate).toLocaleDateString()
                      : 'TBD',
                    price: featuredCourse.price.toString(),
                    thumbnail:
                      featuredCourse.thumbnail || 'https://via.placeholder.com/600x400',
                    about: featuredCourse.about || 'No description available',
                    isFeatured: true,
                  }}
                />
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={course._id}
                  className="animate-fade-in-up"
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
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full text-lg">
                No courses found. Try adjusting your search or filters.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Courses;