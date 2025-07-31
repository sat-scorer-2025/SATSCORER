// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { handlePayment } from '../services/PaymentGateway';
// import Footer from '../components/Footer';

// const CourseDetails = () => {
//   const { id } = useParams();
//   const { user, fetchProtected } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [isProcessing, setIsProcessing] = useState(false);

//   const overviewRef = useRef(null);
//   const curriculumRef = useRef(null);
//   const instructorRef = useRef(null);
//   const reviewsRef = useRef(null);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       if (!id) {
//         setError('Course ID is missing');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetchProtected(`http://localhost:5000/api/course/${id}`, {
//           headers: { 'Content-Type': 'application/json' },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setCourse(data.course);
//         } else {
//           setError(data.message || 'Failed to fetch course');
//         }
//       } catch (err) {
//         setError('Network error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [id, fetchProtected]);

//   const handleBuyNow = async () => {
//     if (!user) {
//       alert('Please log in to purchase this course.');
//       navigate('/login');
//       return;
//     }

//     const confirmPurchase = window.confirm(`Are you sure you want to buy "${course.title}" for ₹${course.price}?`);
//     if (!confirmPurchase) return;

//     setIsProcessing(true);
//     try {
//       const result = await handlePayment(course._id, user.id, course.price);
//       if (result && result.message.includes('enrolled')) {
//         alert('Payment successful! You are now enrolled in the course.');
//         navigate('/studentdashboard/mycourses');
//       } else {
//         throw new Error('Payment or enrollment failed');
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       alert('Failed to process payment. Please try again or contact support.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleTabClick = (tab, ref) => {
//     setActiveTab(tab);
//     ref.current.scrollIntoView({ behavior: 'smooth' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-600 text-lg animate-pulse">Loading course...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 text-lg mb-4">{error}</p>
//           <Link
//             to="/courses"
//             className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
//           >
//             Back to Courses
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-gray-50 min-h-screen mt-16">
//         <div className="bg-gray-800 text-white py-16">
//           <div className="max-w-7xl mx-auto px-4">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
//             <p className="text-lg md:text-xl mb-6">{course.about}</p>
//             <div className="flex flex-wrap gap-4 mb-6">
//               <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{course.examType.toUpperCase()}</span>
//               <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">10 hours</span>
//               <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">25 Lessons</span>
//               <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">4.8 ★ (500 reviews)</span>
//             </div>
//             <button
//               onClick={handleBuyNow}
//               disabled={isProcessing}
//               className={`px-6 py-3 rounded-lg text-white transition-all duration-200 ${
//                 isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {isProcessing ? 'Processing...' : 'Enroll Now'}
//             </button>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3">
//             <div className="flex border-b border-gray-200 mb-6 sticky top-16 bg-gray-50 z-10">
//               <button
//                 onClick={() => handleTabClick('Overview', overviewRef)}
//                 className={`px-4 py-2 font-semibold ${
//                   activeTab === 'Overview' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => handleTabClick('Curriculum', curriculumRef)}
//                 className={`px-4 py-2 font-semibold ${
//                   activeTab === 'Curriculum' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Curriculum
//               </button>
//               <button
//                 onClick={() => handleTabClick('Instructor', instructorRef)}
//                 className={`px-4 py-2 font-semibold ${
//                   activeTab === 'Instructor' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Instructor
//               </button>
//               <button
//                 onClick={() => handleTabClick('Reviews', reviewsRef)}
//                 className={`px-4 py-2 font-semibold ${
//                   activeTab === 'Reviews' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Reviews
//               </button>
//             </div>

//             <div ref={overviewRef}>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Overview</h2>
//               <p className="text-gray-600 mb-4">{course.about}</p>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">What You'll Learn</h3>
//               <ul className="list-disc list-inside text-gray-600 mb-4">
//                 <li>Master exam strategies and concepts</li>
//                 <li>Improve time management for {course.examType.toUpperCase()}</li>
//                 <li>Practice with real exam questions</li>
//               </ul>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">Who This Course Is For</h3>
//               <p className="text-gray-600">Students preparing for the {course.examType.toUpperCase()} exam</p>
//             </div>

//             <div ref={curriculumRef} className="mt-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">Curriculum</h2>
//               <div className="space-y-4">
//                 <div className="border p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold text-gray-800">Module 1: Introduction</h3>
//                   <p className="text-gray-600">Lesson 1: Overview (20 mins)</p>
//                   <p className="text-gray-600">Lesson 2: Basics (30 mins)</p>
//                 </div>
//                 <div className="border p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold text-gray-800">Module 2: Advanced Topics</h3>
//                   <p className="text-gray-600">Lesson 1: Practice Questions (40 mins)</p>
//                   <p className="text-gray-600">Lesson 2: Mock Test (60 mins)</p>
//                 </div>
//               </div>
//             </div>

//             <div ref={instructorRef} className="mt-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructor</h2>
//               <div className="flex items-center gap-4">
//                 <img
//                   src="https://via.placeholder.com/80"
//                   alt="Instructor"
//                   className="w-20 h-20 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">John Doe</h3>
//                   <p className="text-gray-600">Expert with 10+ years in exam preparation</p>
//                 </div>
//               </div>
//             </div>

//             <div ref={reviewsRef} className="mt-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
//               <div className="flex items-center gap-2 mb-4">
//                 <span className="text-yellow-500">★★★★★</span>
//                 <span className="text-gray-600">4.8 (500 reviews)</span>
//               </div>
//               <div className="border-t py-4">
//                 <p className="text-gray-600">Great course, very helpful!</p>
//                 <p className="text-sm text-gray-500 mt-1">- Alex (June 1, 2025)</p>
//               </div>
//               <div className="border-t py-4">
//                 <p className="text-gray-600">Loved the practice questions!</p>
//                 <p className="text-sm text-gray-500 mt-1">- Sarah (June 3, 2025)</p>
//               </div>
//             </div>
//           </div>

//           <div className="lg:w-1/3">
//             <div className="sticky top-20 bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">₹{course.price}</h3>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={isProcessing}
//                 className={`w-full px-6 py-3 rounded-lg text-white transition-all duration-200 ${
//                   isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//                 }`}
//               >
//                 {isProcessing ? 'Processing...' : 'Enroll Now'}
//               </button>
//               <ul className="text-gray-600 text-sm space-y-2 mt-4">
//                 <li>✔ 30-Day Money-Back Guarantee</li>
//                 <li>✔ Lifetime Access</li>
//                 <li>✔ Certificate of Completion</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default CourseDetails;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { handlePayment } from '../services/PaymentGateway';
import Footer from '../components/Footer';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CourseDetails = () => {
  const { id } = useParams();
  const { user, fetchProtected } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isProcessing, setIsProcessing] = useState(false);

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchProtected(`${API_URL}/api/course/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setCourse(data.course);
        } else {
          setError(data.message || 'Failed to fetch course');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, fetchProtected]);

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please log in to purchase this course.');
      navigate('/login');
      return;
    }

    const confirmPurchase = window.confirm(`Are you sure you want to buy "${course.title}" for ₹${course.price}?`);
    if (!confirmPurchase) return;

    setIsProcessing(true);
    try {
      const result = await handlePayment(course._id, user.id, course.price);
      if (result && result.message.includes('enrolled')) {
        alert('Payment successful! You are now enrolled in the course.');
        navigate('/studentdashboard/mycourses');
      } else {
        throw new Error('Payment or enrollment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTabClick = (tab, ref) => {
    setActiveTab(tab);
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg animate-pulse">Loading course...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link
            to="/courses"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen mt-16">
        <div className="bg-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg md:text-xl mb-6">{course.about}</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{course.examType.toUpperCase()}</span>
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">10 hours</span>
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">25 Lessons</span>
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">4.8 ★ (500 reviews)</span>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg text-white transition-all duration-200 ${
                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Enroll Now'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex border-b border-gray-200 mb-6 sticky top-16 bg-gray-50 z-10">
              <button
                onClick={() => handleTabClick('Overview', overviewRef)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'Overview' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabClick('Curriculum', curriculumRef)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'Curriculum' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Curriculum
              </button>
              <button
                onClick={() => handleTabClick('Instructor', instructorRef)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'Instructor' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Instructor
              </button>
              <button
                onClick={() => handleTabClick('Reviews', reviewsRef)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'Reviews' ? 'text-gray-800 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Reviews
              </button>
            </div>

            <div ref={overviewRef}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Overview</h2>
              <p className="text-gray-600 mb-4">{course.about}</p>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">What You'll Learn</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Master exam strategies and concepts</li>
                <li>Improve time management for {course.examType.toUpperCase()}</li>
                <li>Practice with real exam questions</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Who This Course Is For</h3>
              <p className="text-gray-600">Students preparing for the {course.examType.toUpperCase()} exam</p>
            </div>

            <div ref={curriculumRef} className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Curriculum</h2>
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Module 1: Introduction</h3>
                  <p className="text-gray-600">Lesson 1: Overview (20 mins)</p>
                  <p className="text-gray-600">Lesson 2: Basics (30 mins)</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Module 2: Advanced Topics</h3>
                  <p className="text-gray-600">Lesson 1: Practice Questions (40 mins)</p>
                  <p className="text-gray-600">Lesson 2: Mock Test (60 mins)</p>
                </div>
              </div>
            </div>

            <div ref={instructorRef} className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructor</h2>
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Instructor"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">John Doe</h3>
                  <p className="text-gray-600">Expert with 10+ years in exam preparation</p>
                </div>
              </div>
            </div>

            <div ref={reviewsRef} className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-600">4.8 (500 reviews)</span>
              </div>
              <div className="border-t py-4">
                <p className="text-gray-600">Great course, very helpful!</p>
                <p className="text-sm text-gray-500 mt-1">- Alex (June 1, 2025)</p>
              </div>
              <div className="border-t py-4">
                <p className="text-gray-600">Loved the practice questions!</p>
                <p className="text-sm text-gray-500 mt-1">- Sarah (June 3, 2025)</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-20 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">₹{course.price}</h3>
              <button
                onClick={handleBuyNow}
                disabled={isProcessing}
                className={`w-full px-6 py-3 rounded-lg text-white transition-all duration-200 ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Enroll Now'}
              </button>
              <ul className="text-gray-600 text-sm space-y-2 mt-4">
                <li>✔ 30-Day Money-Back Guarantee</li>
                <li>✔ Lifetime Access</li>
                <li>✔ Certificate of Completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CourseDetails;