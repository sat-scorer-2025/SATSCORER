import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const QuestionDisplay = ({
  question,
  questionIndex,
  totalQuestions,
  answers,
  questions,
  test,
  onAnswer,
  onPrevious,
  onNext,
  onQuestionClick,
  timeLeft,
  onSubmit,
}) => {
  const handleOptionChange = (option) => {
    onAnswer(question._id, option);
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gray-50 p-8 flex flex-col min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-['Inter',sans-serif] font-semibold text-gray-800">
          Question {questionIndex + 1} of {totalQuestions}
        </h2>
        <p className="text-lg font-['Inter',sans-serif] text-red-600">Time Left: {formatTime(timeLeft)}</p>
      </div>
      <div className="mb-6">
        <p className="text-lg font-['Inter',sans-serif] font-semibold text-gray-800">{question.text}</p>
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="mt-4 max-w-full h-auto rounded-lg"
          />
        )}
      </div>
      {(question.type === 'mcq' || question.type === 'checkbox') && (
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <input
                type={question.type === 'mcq' ? 'radio' : 'checkbox'}
                name={`question-${question._id}`}
                value={option.text}
                checked={
                  question.type === 'mcq'
                    ? answers[question._id] === option.text
                    : answers[question._id]?.includes(option.text) || false
                }
                onChange={() =>
                  handleOptionChange(
                    question.type === 'mcq'
                      ? option.text
                      : answers[question._id]?.includes(option.text)
                      ? answers[question._id].filter((a) => a !== option.text)
                      : [...(answers[question._id] || []), option.text]
                  )
                }
                className="mr-3"
              />
              <span className="text-base font-['Inter',sans-serif] text-gray-800">{option.text}</span>
            </label>
          ))}
        </div>
      )}
      {(question.type === 'short' || question.type === 'paragraph') && (
        <textarea
          value={answers[question._id] || ''}
          onChange={(e) => handleOptionChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg"
          rows={question.type === 'short' ? 2 : 5}
          placeholder="Enter your answer"
        />
      )}
      <div className="fixed bottom-0 left-0 w-full bg-gray-50 px-8 py-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={onPrevious}
            disabled={questionIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Previous
          </button>
          {onNext && (
            <button
              onClick={onNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Next
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          )}
          {onSubmit && (
            <button
              onClick={onSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              Submit Test
            </button>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, i) => (
            <button
              key={q._id}
              onClick={() => onQuestionClick(i)}
              className={`w-8 h-8 rounded-full text-sm font-['Inter',sans-serif] ${
                i === questionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[q._id]
                  ? 'bg-green-300 text-green-900'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;