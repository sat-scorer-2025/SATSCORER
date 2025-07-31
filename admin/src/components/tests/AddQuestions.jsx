import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TestContext } from '../../context/TestContext';
import { useNavigate } from 'react-router-dom';
import QuestionBuilder from './QuestionBuilder';
import PreviewTest from './PreviewTest';

const AddQuestions = () => {
  const { tests, createQuestions } = useContext(TestContext);
  const [selectedTest, setSelectedTest] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Filter tests to show only those with zero questions
  const availableTests = tests.filter((test) => (test.questions || []).length === 0);

  const validateQuestions = () => {
    const newErrors = {};
    if (!selectedTest) newErrors.test = 'Please select a test';
    if (questions.length === 0) newErrors.questions = 'At least one question is required';
    questions.forEach((q, i) => {
      if (!q.text?.trim()) newErrors[`question_${i}_text`] = `Question ${i + 1} text is required`;
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.options || q.options.length < 2)) {
        newErrors[`question_${i}_options`] = `Question ${i + 1} requires at least 2 options`;
      }
      if ((q.type === 'mcq' || q.type === 'checkbox') && (!q.correctAnswer || (q.type === 'checkbox' && q.correctAnswer.length === 0))) {
        newErrors[`question_${i}_correctAnswer`] = `Question ${i + 1} requires at least one correct answer`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    if (!selectedTest) {
      toast.error('Please select a test before adding questions');
      return;
    }
    const newQuestion = {
      id: Date.now(),
      type: 'mcq',
      text: '',
      options: [{ text: '' }, { text: '' }],
      correctAnswer: '',
      explanation: '',
      image: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`question_${index}_text`];
      delete newErrors[`question_${index}_options`];
      delete newErrors[`question_${index}_correctAnswer`];
      return newErrors;
    });
  };

  const reorderQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newQuestions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const handleSaveQuestions = async () => {
    if (!validateQuestions()) {
      toast.error('All details are required');
      return;
    }
    try {
      const questionsData = questions.map((q) => ({
        testId: selectedTest,
        text: q.text.trim(),
        type: q.type,
        options: q.options.map((opt) => ({ text: opt.text.trim(), image: opt.image || undefined })),
        correctAnswer: q.type === 'mcq' ? q.correctAnswer : q.type === 'checkbox' ? q.correctAnswer : undefined,
        explanation: q.explanation?.trim() || undefined,
        image: q.image || undefined,
      }));
      await createQuestions(questionsData);
      toast.success('Questions saved successfully!');
      setQuestions([]);
      setSelectedTest('');
      setErrors({});
      navigate('/tests/create/details');
    } catch (err) {
      toast.error(err.message || 'Failed to save questions');
    }
  };

  const testDetails = selectedTest ? tests.find((t) => t._id === selectedTest) : null;

  return (
    <div className="space-y-4 scrollbar-hidden">
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 uppercase">
          {testDetails ? testDetails.title : 'Select Test'}
        </h2>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
        >
          <option value="">Select Test</option>
          {availableTests.map((test) => (
            <option key={test._id} value={test._id}>{test.title}</option>
          ))}
        </select>
        {errors.test && <p className="text-amber-600 text-sm mt-2">{errors.test}</p>}
      </div>
      {selectedTest && (
        <div className="bg-white shadow-sm rounded-lg p-4">
          {questions.length === 0 && errors.questions && (
            <p className="text-amber-600 text-sm mb-4">{errors.questions}</p>
          )}
          {questions.map((question, index) => (
            <QuestionBuilder
              key={question.id}
              question={question}
              onChange={(updated) => updateQuestion(index, updated)}
              onDelete={() => deleteQuestion(index)}
              index={index}
              onReorder={reorderQuestion}
              questionsLength={questions.length}
            />
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={addQuestion}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300"
            >
              Add Question
            </button>
            <button
              onClick={handleSaveQuestions}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300"
            >
              Save Questions
            </button>
          </div>
        </div>
      )}
      {showPreview && selectedTest && (
        <div className="bg-white shadow-sm rounded-lg p-4">
          <PreviewTest testDetails={testDetails} questions={questions} />
        </div>
      )}
      {selectedTest && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-12 h-12 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-all duration-300 flex items-center justify-center"
            title="Preview Test"
          >
            👁️
          </button>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;