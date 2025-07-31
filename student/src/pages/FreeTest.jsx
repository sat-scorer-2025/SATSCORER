import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FreeTest = () => {
  const { examType } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  // Mock data for exam sections and questions
  const mockExams = {
    SAT: {
      sections: [
        {
          name: 'Math',
          questions: [
            { question: 'If x + 3 = 7, what is x?', options: ['1', '2', '3', '4'], correct: '4' },
            { question: 'What is 5 * 6?', options: ['25', '30', '35', '40'], correct: '30' },
            { question: 'Solve: 2x = 8', options: ['2', '4', '6', '8'], correct: '4' },
            { question: 'Area of a square with side 5?', options: ['20', '25', '30', '35'], correct: '25' },
            { question: 'What is 10% of 50?', options: ['5', '10', '15', '20'], correct: '5' },
          ],
        },
        {
          name: 'Reading',
          questions: [
            { question: 'Synonym of "big"?', options: ['Small', 'Large', 'Tiny', 'Short'], correct: 'Large' },
            { question: 'Antonym of "fast"?', options: ['Quick', 'Slow', 'Rapid', 'Swift'], correct: 'Slow' },
            { question: 'What is a "theme"?', options: ['A color', 'A main idea', 'A character', 'A setting'], correct: 'A main idea' },
            { question: 'What does "vivid" mean?', options: ['Dull', 'Bright', 'Quiet', 'Soft'], correct: 'Bright' },
            { question: 'What is the tone of a story?', options: ['The plot', 'The mood', 'The setting', 'The character'], correct: 'The mood' },
          ],
        },
      ],
      timeLimit: 60 * 60, // 60 minutes in seconds
    },
    GRE: {
      sections: [
        {
          name: 'Verbal Reasoning',
          questions: [
            { question: 'Antonym of "happy"?', options: ['Sad', 'Joyful', 'Excited', 'Pleased'], correct: 'Sad' },
            { question: 'What does "ephemeral" mean?', options: ['Lasting', 'Temporary', 'Eternal', 'Permanent'], correct: 'Temporary' },
            { question: 'Synonym of "obscure"?', options: ['Clear', 'Vague', 'Bright', 'Obvious'], correct: 'Vague' },
            { question: 'What is a "metaphor"?', options: ['A comparison', 'A fact', 'A question', 'A statement'], correct: 'A comparison' },
            { question: 'What does "candid" mean?', options: ['Secretive', 'Honest', 'Shy', 'Arrogant'], correct: 'Honest' },
          ],
        },
        {
          name: 'Quantitative Reasoning',
          questions: [
            { question: 'Square root of 16?', options: ['2', '4', '8', '16'], correct: '4' },
            { question: 'What is 3^2?', options: ['6', '9', '12', '15'], correct: '9' },
            { question: 'Solve: x + 5 = 10', options: ['3', '4', '5', '6'], correct: '5' },
            { question: 'What is 20% of 80?', options: ['16', '18', '20', '22'], correct: '16' },
            { question: 'What is 7 * 8?', options: ['48', '56', '64', '72'], correct: '56' },
          ],
        },
      ],
      timeLimit: 60 * 60, // 60 minutes in seconds
    },
    TOEFL: {
      sections: [
        {
          name: 'Reading',
          questions: [
            { question: 'What does "abundant" mean?', options: ['Scarce', 'Plentiful', 'Rare', 'Limited'], correct: 'Plentiful' },
            { question: 'Synonym of "complex"?', options: ['Simple', 'Complicated', 'Easy', 'Clear'], correct: 'Complicated' },
          ],
        },
        {
          name: 'Listening',
          questions: [
            { question: 'What is the main idea of the lecture?', options: ['History', 'Science', 'Art', 'Math'], correct: 'Science' },
            { question: 'What did the speaker emphasize?', options: ['Details', 'Examples', 'Facts', 'Opinions'], correct: 'Examples' },
          ],
        },
        {
          name: 'Speaking',
          questions: [
            { question: 'How would you describe your hometown?', options: ['Big', 'Small', 'Busy', 'Quiet'], correct: 'Big' },
            { question: 'What is your favorite activity?', options: ['Reading', 'Sports', 'Music', 'Travel'], correct: 'Reading' },
          ],
        },
        {
          name: 'Writing',
          questions: [
            { question: 'What is the best way to learn?', options: ['Reading', 'Listening', 'Practicing', 'Watching'], correct: 'Practicing' },
            { question: 'What is important for success?', options: ['Luck', 'Hard work', 'Money', 'Friends'], correct: 'Hard work' },
          ],
        },
      ],
      timeLimit: 120 * 60, // 120 minutes in seconds
    },
  };

  const exam = mockExams[examType] || { sections: [], timeLimit: 0 };
  const totalSections = exam.sections.length;
  const currentSectionQuestions = exam.sections[currentSection]?.questions || [];
  const totalQuestionsInSection = currentSectionQuestions.length;

  // Calculate total questions and progress
  const totalQuestions = exam.sections.reduce((acc, section) => acc + section.questions.length, 0);
  const questionsCompleted = exam.sections
    .slice(0, currentSection)
    .reduce((acc, section) => acc + section.questions.length, 0) + currentQuestion;
  const progressPercentage = (questionsCompleted / totalQuestions) * 100;

  // Timer setup
  useEffect(() => {
    setTimeLeft(exam.timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam.timeLimit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (sectionIndex, questionIndex, option) => {
    const key = `${sectionIndex}-${questionIndex}`;
    setAnswers({ ...answers, [key]: option });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let totalQuestions = 0;
    exam.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((q, questionIndex) => {
        const key = `${sectionIndex}-${questionIndex}`;
        if (answers[key] === q.correct) {
          correctCount++;
        }
        totalQuestions++;
      });
    });
    navigate(`/free-test-result/${examType}`, { state: { score: correctCount, total: totalQuestions } });
  };

  if (!exam.sections.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600 font-medium">No test available for {examType}.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-900">{examType} Free Test</h2>
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">
              Time Left: <span className={timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
            >
              End Test
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Progress: {questionsCompleted + 1} of {totalQuestions} questions
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-blue-900 mb-2">
              Section {currentSection + 1}: {exam.sections[currentSection].name}
            </h3>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {totalQuestionsInSection}
            </p>
          </div>

          <div className="mb-8">
            <p className="text-lg font-medium text-gray-800 mb-4">{currentSectionQuestions[currentQuestion].question}</p>
            <div className="space-y-4">
              {currentSectionQuestions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${currentSection}-${currentQuestion}`}
                    value={option}
                    checked={answers[`${currentSection}-${currentQuestion}`] === option}
                    onChange={() => handleAnswer(currentSection, currentQuestion, option)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                } else if (currentSection > 0) {
                  setCurrentSection(currentSection - 1);
                  setCurrentQuestion(exam.sections[currentSection - 1].questions.length - 1);
                }
              }}
              disabled={currentSection === 0 && currentQuestion === 0}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 transition-all duration-300 shadow-md"
            >
              Previous
            </button>
            {currentSection < totalSections - 1 || currentQuestion < totalQuestionsInSection - 1 ? (
              <button
                onClick={() => {
                  if (currentQuestion < totalQuestionsInSection - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else if (currentSection < totalSections - 1) {
                    setCurrentSection(currentSection + 1);
                    setCurrentQuestion(0);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTest;