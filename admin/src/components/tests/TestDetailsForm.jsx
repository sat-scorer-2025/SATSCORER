import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { TestContext } from '../../context/TestContext';
import { useNavigate } from 'react-router-dom';
import TestHeader from './TestHeader';

const TestDetailsForm = () => {
  const { courses, examTypes, testTypes, fetchTests } = useContext(TestContext);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [testType, setTestType] = useState('');
  const [examType, setExamType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [markingScheme, setMarkingScheme] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateDetails = () => {
    const newErrors = {};
    if (!selectedCourse) newErrors.course = 'Course is required';
    if (!testType) newErrors.testType = 'Test type is required';
    if (!examType) newErrors.examType = 'Exam type is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!duration || isNaN(duration) || duration <= 0) newErrors.duration = 'Valid duration is required';
    if (!attempts || attempts < 1) newErrors.attempts = 'At least one attempt is required';
    if (!markingScheme.trim()) newErrors.markingScheme = 'Marking scheme is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    if (!validateDetails()) {
      toast.error('All details are required');
      return;
    }
    try {
      const testData = {
        courseId: selectedCourse,
        testType,
        examType,
        title,
        description,
        duration: parseInt(duration),
        noOfAttempts: parseInt(attempts),
        markingScheme,
        isFree: false,
        status,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/test`, testData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(`${title} saved as ${status}!`);
      await fetchTests();
      if (status === 'published') {
        navigate('/tests/create/questions');
      } else {
        resetForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save test');
    }
  };

  const resetForm = () => {
    setSelectedCourse('');
    setTestType('');
    setExamType('');
    setTitle('');
    setDescription('');
    setDuration('');
    setAttempts(1);
    setMarkingScheme('');
    setErrors({});
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 scrollbar-hidden w-full border border-gray-100">
      <TestHeader
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        testType={testType}
        setTestType={setTestType}
        examType={examType}
        setExamType={setExamType}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        duration={duration}
        setDuration={setDuration}
        attempts={attempts}
        setAttempts={setAttempts}
        markingScheme={markingScheme}
        setMarkingScheme={setMarkingScheme}
        errors={errors}
        examTypes={examTypes}
        testTypes={testTypes}
        courses={courses}
      />
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={() => handleSubmit('draft')}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit('published')}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          Publish Test
        </button>
      </div>
    </div>
  );
};

export default TestDetailsForm;