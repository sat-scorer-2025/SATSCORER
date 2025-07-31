import React, { useState, useEffect, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { TestContext } from '../../context/TestContext';
import TestHeader from './TestHeader';
import QuestionBuilder from './QuestionBuilder';

const EditTestDrawer = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { courses, examTypes, testTypes, tests, updateTest, createQuestions, updateQuestion, deleteQuestion, fetchQuestions, fetchTests } = useContext(TestContext);

  const test = useMemo(() => tests.find((t) => t._id === testId), [tests, testId]);

  const initialFormData = useMemo(() => {
    if (test) {
      return {
        _id: test._id,
        courseId: test.courseId,
        testType: test.testType,
        examType: test.examType,
        title: test.title,
        description: test.description,
        duration: test.duration,
        noOfAttempts: test.noOfAttempts,
        markingScheme: test.markingScheme,
        status: test.status,
        questions: test.questions || [],
      };
    }
    return {
      _id: '',
      courseId: '',
      testType: '',
      examType: '',
      title: '',
      description: '',
      duration: '',
      noOfAttempts: 1,
      markingScheme: '',
      status: 'draft',
      questions: [],
    };
  }, [test]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isSubmittingQuestions, setIsSubmittingQuestions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Update formData only when testId or test changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const validateDetails = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.course = 'Course is required';
    if (!formData.testType) newErrors.testType = 'Test type is required';
    if (!formData.examType) newErrors.examType = 'Exam type is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) newErrors.duration = 'Valid duration is required';
    if (!formData.noOfAttempts || formData.noOfAttempts < 1) newErrors.attempts = 'At least one attempt is required';
    if (!formData.markingScheme.trim()) newErrors.markingScheme = 'Marking scheme is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestions = () => {
    const newErrors = {};
    if (formData.questions.length === 0) newErrors.questions = 'At least one question is required';
    formData.questions.forEach((q, i) => {
      if (!q.text?.trim()) newErrors[`question_${i}_text`] = `Question ${i + 1} text is required`;
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.options || q.options.length < 2)) {
        newErrors[`question_${i}_options`] = `Question ${i + 1} requires at least 2 options`;
      }
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.correctAnswer || (q.type === 'checkbox' && q.correctAnswer.length === 0))) {
        newErrors[`question_${i}_correctAnswer`] = `Question ${i + 1} requires at least one correct answer`;
      }
      if (q.type === 'checkbox' && Array.isArray(q.correctAnswer) && q.correctAnswer.length === q.options?.length) {
        newErrors[`question_${i}_correctAnswer`] = `Question ${i + 1} cannot have all options as correct`;
      }
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateQuestionLocal = (index, updatedQuestion) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setFormData({ ...formData, questions: newQuestions });
    setErrors((prev) => ({
      ...prev,
      [`question_${index}_text`]: '',
      [`question_${index}_options`]: '',
      [`question_${index}_correctAnswer`]: '',
    }));
  };

  const deleteQuestionLocal = async (index) => {
    const question = formData.questions[index];
    if (question._id) {
      try {
        await deleteQuestion(question._id, formData._id);
        toast.success(`Question ${index + 1} deleted!`);
      } catch (err) {
        toast.error(err.message);
        return;
      }
    }
    setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`question_${index}_text`];
      delete newErrors[`question_${index}_options`];
      delete newErrors[`question_${index}_correctAnswer`];
      return newErrors;
    });
  };

  const reorderQuestion = (index, direction) => {
    const newQuestions = [...formData.questions];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newQuestions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      type: 'mcq',
      text: '',
      options: [{ text: 'Option 1' }, { text: 'Option 2' }],
      correctAnswer: '',
      explanation: '',
      image: null,
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
    setErrors((prev) => ({ ...prev, questions: '' }));
  };

  const handleSaveDetails = async () => {
    if (!validateDetails()) {
      toast.error('All details are required before saving.');
      return;
    }
    setIsSubmittingDetails(true);
    try {
      const testData = {
        courseId: formData.courseId,
        testType: formData.testType,
        examType: formData.examType,
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        noOfAttempts: parseInt(formData.noOfAttempts),
        markingScheme: formData.markingScheme,
        status: formData.status,
      };
      await updateTest(formData._id, testData);
      toast.success('Test details updated!');
      setShowDetails(false);
      navigate('/tests/manage');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handleUpdateQuestions = async () => {
    if (!validateQuestions()) {
      toast.error('All details are required before updating questions.');
      return;
    }
    setIsSubmittingQuestions(true);
    try {
      const existingQuestions = (await fetchQuestions(formData._id)) || [];
      const existingQuestionIds = existingQuestions.map((q) => q._id) || [];

      const updatedQuestions = [];
      const newQuestions = [];

      for (const q of formData.questions) {
        const questionData = {
          testId: formData._id,
          text: q.text.trim(),
          type: q.type,
          options: q.options.map((opt) => ({ text: opt.text.trim(), image: opt.image || undefined })),
          correctAnswer: q.type === 'checkbox' ? (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]) : q.correctAnswer,
          explanation: q.explanation?.trim() || undefined,
          image: q.image || undefined,
        };

        if (q._id && existingQuestionIds.includes(q._id)) {
          const response = await updateQuestion(q._id, questionData);
          updatedQuestions.push(response.question);
        } else {
          newQuestions.push(questionData);
        }
      }

      if (newQuestions.length > 0) {
        const response = await createQuestions(newQuestions);
        updatedQuestions.push(...(response.questions || []));
      }

      await updateTest(formData._id, { questions: updatedQuestions.map((q) => q._id) });

      await fetchQuestions(formData._id);
      await fetchTests();
      toast.success('Questions updated successfully!');
      navigate('/tests/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to update questions');
    } finally {
      setIsSubmittingQuestions(false);
    }
  };

  if (!test) {
    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0 z-50 overflow-y-auto">
        <div className="p-4">
          <p className="text-red-500">Test not found.</p>
          <button
            onClick={() => navigate('/tests/manage')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Back to Manage Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0 z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Test</h2>
          <button
            onClick={() => navigate('/tests/manage')}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isSubmittingDetails || isSubmittingQuestions}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors mb-4 text-sm font-medium"
        >
          <span>Test Details</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
            <TestHeader
              selectedCourse={formData.courseId}
              setSelectedCourse={(value) => handleFieldChange('courseId', value)}
              testType={formData.testType}
              setTestType={(value) => handleFieldChange('testType', value)}
              examType={formData.examType}
              setExamType={(value) => handleFieldChange('examType', value)}
              title={formData.title}
              setTitle={(value) => handleFieldChange('title', value)}
              description={formData.description}
              setDescription={(value) => handleFieldChange('description', value)}
              duration={formData.duration}
              setDuration={(value) => handleFieldChange('duration', value)}
              attempts={formData.noOfAttempts}
              setAttempts={(value) => handleFieldChange('noOfAttempts', value)}
              markingScheme={formData.markingScheme}
              setMarkingScheme={(value) => handleFieldChange('markingScheme', value)}
              errors={errors}
              examTypes={examTypes}
              testTypes={testTypes}
              courses={courses}
            />
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                disabled={isSubmittingDetails}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSaveDetails}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm"
                disabled={isSubmittingDetails}
              >
                {isSubmittingDetails ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
          {formData.questions.length === 0 && errors.questions && (
            <p className="text-red-500 text-xs">{errors.questions}</p>
          )}
          {formData.questions.map((question, index) => (
            <QuestionBuilder
              key={question._id || question.id}
              question={question}
              onChange={(updated) => updateQuestionLocal(index, updated)}
              onDelete={() => deleteQuestionLocal(index)}
              index={index}
              onReorder={reorderQuestion}
              questionsLength={formData.questions.length}
            />
          ))}
          <button
            onClick={addQuestion}
            className="flex items-center px-3 py-1.5 text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50 transition-colors disabled:opacity-50 text-sm"
            disabled={isSubmittingQuestions}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleUpdateQuestions}
              className="px-4 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm"
              disabled={isSubmittingQuestions}
            >
              {isSubmittingQuestions ? 'Updating...' : 'Update Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTestDrawer;