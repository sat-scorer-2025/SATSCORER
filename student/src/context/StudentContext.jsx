// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useAuthContext } from './AuthContext';

// const StudentContext = createContext();

// export const StudentProvider = ({ children }) => {
//   const [courses, setCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [hasFetchedCourses, setHasFetchedCourses] = useState(false);
//   const { fetchProtected, authError, user } = useAuthContext();

//   const fetchCourses = useCallback(async () => {
//     if (!user) return;

//     setIsLoading(true);
//     try {
//       const response = await fetchProtected('http://localhost:5000/api/enrollment/myenrollment');
//       const data = await response.json();
//       if (response.ok) {
//         const enrolledCourses = data.enrollments.map(enrollment => ({
//           ...enrollment.courseId,
//           enrollmentStatus: enrollment.status,
//         }));
//         setCourses(enrolledCourses);
//         setError(null);
//       } else {
//         setError(data.message || 'Failed to load courses');
//         setCourses([]);
//       }
//     } catch (err) {
//       setError(authError || err.message || 'Failed to load courses');
//       setCourses([]);
//     } finally {
//       setIsLoading(false);
//       setHasFetchedCourses(true);
//     }
//   }, [user, fetchProtected, authError]);

//   useEffect(() => {
//     if (user && !hasFetchedCourses) {
//       fetchCourses();
//     }
//   }, [user, hasFetchedCourses, fetchCourses]);

//   const fetchCourseById = useCallback(async (courseId) => {
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/course/${courseId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.course;
//       } else {
//         setError(data.message || 'Failed to fetch course');
//         return null;
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch course');
//       return null;
//     }
//   }, [fetchProtected]);

//   const fetchVideosForCourse = useCallback(async (courseId) => {
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/video/course/${courseId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.videos || [];
//       } else {
//         setError(data.message || 'Failed to fetch videos');
//         return [];
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch videos');
//       return [];
//     }
//   }, [fetchProtected]);

//   const fetchNotesForCourse = useCallback(async (courseId) => {
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/notes/course/${courseId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.notes || [];
//       } else {
//         setError(data.message || 'Failed to fetch notes');
//         return [];
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch notes');
//       return [];
//     }
//   }, [fetchProtected]);

//   const fetchLiveSessionsForCourse = useCallback(async (courseId) => {
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/livesession/course/${courseId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.sessions || [];
//       } else {
//         setError(data.message || 'Failed to fetch live sessions');
//         return [];
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch live sessions');
//       return [];
//     }
//   }, [fetchProtected]);

//   const fetchTestsForCourse = useCallback(async (courseId) => {
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/test/course/${courseId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.tests || [];
//       } else {
//         setError(data.message || 'Failed to fetch tests');
//         return [];
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch tests');
//       return [];
//     }
//   }, [fetchProtected]);

//   const fetchTestDetails = useCallback(async (testId) => {
//     if (!testId) {
//       setError('Test ID is required');
//       return null;
//     }
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/test/${testId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.test;
//       } else {
//         setError(data.message || 'Failed to fetch test details');
//         return null;
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch test details');
//       return null;
//     }
//   }, [fetchProtected]);

//   const fetchQuestionsForTest = useCallback(async (testId) => {
//     if (!testId) {
//       setError('Test ID is required');
//       return [];
//     }
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/question/test/${testId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.questions || [];
//       } else {
//         setError(data.message || 'Failed to fetch questions');
//         return [];
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch questions');
//       return [];
//     }
//   }, [fetchProtected]);

//   const submitTestResult = useCallback(async (testId, score, answers) => {
//     if (!testId || score === undefined || !answers) {
//       setError('Test ID, score, and answers are required');
//       return null;
//     }
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/testresult`, {
//         method: 'POST',
//         body: JSON.stringify({
//           testId,
//           score,
//           answers,
//           completedAt: new Date().toISOString(),
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.testResult;
//       } else {
//         console.error('Submit test result error:', data.message, data);
//         setError(data.message || 'Failed to submit test result');
//         return null;
//       }
//     } catch (err) {
//       console.error('Submit test result exception:', err.message, err);
//       setError(err.message || 'Failed to submit test result');
//       return null;
//     }
//   }, [fetchProtected]);

//   const fetchResult = useCallback(async () => {
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/testresult/result`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data.results || [];
//       } else {
//         setError(data.message || 'Failed to fetch test results');
//         return [];
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch test results');
//       return [];
//     }
//   }, [fetchProtected]);

//   const fetchReviewData = useCallback(async (testId) => {
//     if (!testId) {
//       setError('Test ID is required');
//       return null;
//     }
//     try {
//       const response = await fetchProtected(`http://localhost:5000/api/testresult/review/${testId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setError(null);
//         return data;
//       } else {
//         setError(data.message || 'Failed to fetch test review data');
//         return null;
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch test review data');
//       return null;
//     }
//   }, [fetchProtected]);

//   return (
//     <StudentContext.Provider
//       value={{
//         courses,
//         isLoading,
//         error,
//         fetchCourses,
//         fetchCourseById,
//         fetchVideosForCourse,
//         fetchNotesForCourse,
//         fetchLiveSessionsForCourse,
//         fetchTestsForCourse,
//         fetchTestDetails,
//         fetchQuestionsForTest,
//         submitTestResult,
//         fetchResult,
//         fetchReviewData,
//       }}
//     >
//       {children}
//     </StudentContext.Provider>
//   );
// };

// export const useStudentContext = () => useContext(StudentContext);


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './AuthContext';

const StudentContext = createContext();

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const StudentProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetchedCourses, setHasFetchedCourses] = useState(false);
  const { fetchProtected, authError, user } = useAuthContext();

  const fetchCourses = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetchProtected(`${API_URL}/api/enrollment/myenrollment`);
      const data = await response.json();
      if (response.ok) {
        const enrolledCourses = data.enrollments.map(enrollment => ({
          ...enrollment.courseId,
          enrollmentStatus: enrollment.status,
        }));
        setCourses(enrolledCourses);
        setError(null);
      } else {
        setError(data.message || 'Failed to load courses');
        setCourses([]);
      }
    } catch (err) {
      setError(authError || err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setIsLoading(false);
      setHasFetchedCourses(true);
    }
  }, [user, fetchProtected, authError]);

  useEffect(() => {
    if (user && !hasFetchedCourses) {
      fetchCourses();
    }
  }, [user, hasFetchedCourses, fetchCourses]);

  const fetchCourseById = useCallback(async (courseId) => {
    try {
      const response = await fetchProtected(`${API_URL}/api/course/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.course;
      } else {
        setError(data.message || 'Failed to fetch course');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch course');
      return null;
    }
  }, [fetchProtected]);

  const fetchVideosForCourse = useCallback(async (courseId) => {
    try {
      const response = await fetchProtected(`${API_URL}/api/video/course/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.videos || [];
      } else {
        setError(data.message || 'Failed to fetch videos');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch videos');
      return [];
    }
  }, [fetchProtected]);

  const fetchNotesForCourse = useCallback(async (courseId) => {
    try {
      const response = await fetchProtected(`${API_URL}/api/notes/course/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.notes || [];
      } else {
        setError(data.message || 'Failed to fetch notes');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notes');
      return [];
    }
  }, [fetchProtected]);

  const fetchLiveSessionsForCourse = useCallback(async (courseId) => {
    try {
      const response = await fetchProtected(`${API_URL}/api/livesession/course/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.sessions || [];
      } else {
        setError(data.message || 'Failed to fetch live sessions');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch live sessions');
      return [];
    }
  }, [fetchProtected]);

  const fetchTestsForCourse = useCallback(async (courseId) => {
    try {
      const response = await fetchProtected(`${API_URL}/api/test/course/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.tests || [];
      } else {
        setError(data.message || 'Failed to fetch tests');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tests');
      return [];
    }
  }, [fetchProtected]);

  const fetchTestDetails = useCallback(async (testId) => {
    if (!testId) {
      setError('Test ID is required');
      return null;
    }
    try {
      const response = await fetchProtected(`${API_URL}/api/test/${testId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.test;
      } else {
        setError(data.message || 'Failed to fetch test details');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch test details');
      return null;
    }
  }, [fetchProtected]);

  const fetchQuestionsForTest = useCallback(async (testId) => {
    if (!testId) {
      setError('Test ID is required');
      return [];
    }
    try {
      const response = await fetchProtected(`${API_URL}/api/question/test/${testId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.questions || [];
      } else {
        setError(data.message || 'Failed to fetch questions');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch questions');
      return [];
    }
  }, [fetchProtected]);

  const submitTestResult = useCallback(async (testId, score, answers) => {
    if (!testId || score === undefined || !answers) {
      setError('Test ID, score, and answers are required');
      return null;
    }
    try {
      const response = await fetchProtected(`${API_URL}/api/testresult`, {
        method: 'POST',
        body: JSON.stringify({
          testId,
          score,
          answers,
          completedAt: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.testResult;
      } else {
        console.error('Submit test result error:', data.message, data);
        setError(data.message || 'Failed to submit test result');
        return null;
      }
    } catch (err) {
      console.error('Submit test result exception:', err.message, err);
      setError(err.message || 'Failed to submit test result');
      return null;
    }
  }, [fetchProtected]);

  const fetchResult = useCallback(async () => {
    try {
      const response = await fetchProtected(`${API_URL}/api/testresult/result`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data.results || [];
      } else {
        setError(data.message || 'Failed to fetch test results');
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch test results');
      return [];
    }
  }, [fetchProtected]);

  const fetchReviewData = useCallback(async (testId) => {
    if (!testId) {
      setError('Test ID is required');
      return null;
    }
    try {
      const response = await fetchProtected(`${API_URL}/api/testresult/review/${testId}`);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        return data;
      } else {
        setError(data.message || 'Failed to fetch test review data');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch test review data');
      return null;
    }
  }, [fetchProtected]);

  return (
    <StudentContext.Provider
      value={{
        courses,
        isLoading,
        error,
        fetchCourses,
        fetchCourseById,
        fetchVideosForCourse,
        fetchNotesForCourse,
        fetchLiveSessionsForCourse,
        fetchTestsForCourse,
        fetchTestDetails,
        fetchQuestionsForTest,
        submitTestResult,
        fetchResult,
        fetchReviewData,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => useContext(StudentContext);