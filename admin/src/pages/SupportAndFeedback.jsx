import React, { useState, useEffect } from 'react';
import SupportTickets from '../components/support/SupportTickets';
import FeedbackTable from '../components/support/FeedbackTable';

const SupportAndFeedback = () => {
  const [tab, setTab] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const isAdmin = true; // Mock admin; replace with AuthContext

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTickets = localStorage.getItem('supportTickets');
    const storedFeedback = localStorage.getItem('feedback');
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      // Mock tickets
      const mockTickets = [
        {
          id: 1,
          studentName: 'John Doe',
          title: 'Login Issue',
          description: 'Unable to log in with my credentials.',
          dateCreated: '2025-05-26T10:00:00Z',
          priority: 'High',
          status: 'New',
          notes: 'Checked credentials; issue persists.',
        },
        {
          id: 2,
          studentName: 'Jane Smith',
          title: 'Course Access',
          description: 'Cannot access GRE Prep course.',
          dateCreated: '2025-05-25T14:00:00Z',
          priority: 'Medium',
          status: 'In Progress',
          notes: 'Assigned to tech team.',
        },
        {
          id: 3,
          studentName: 'Alex Johnson',
          title: 'Payment Error',
          description: 'Payment failed during checkout.',
          dateCreated: '2025-05-24T09:00:00Z',
          priority: 'High',
          status: 'Resolved',
          notes: 'Refund processed.',
        },
      ];
      setTickets(mockTickets);
      localStorage.setItem('supportTickets', JSON.stringify(mockTickets));
    }
    if (storedFeedback) {
      setFeedback(JSON.parse(storedFeedback));
    } else {
      // Mock feedback
      const mockFeedback = [
        {
          id: 1,
          studentName: 'John Doe',
          courseName: 'GRE Prep',
          rating: 4,
          comment: 'Great course, but needs more practice tests.',
          date: '2025-05-26T12:00:00Z',
          addressed: false,
          reply: '',
        },
        {
          id: 2,
          studentName: 'Jane Smith',
          courseName: 'SAT Math',
          rating: 3,
          comment: 'Needs more examples.',
          date: '2025-05-25T15:00:00Z',
          addressed: false,
          reply: '',
        },
      ];
      setFeedback(mockFeedback);
      localStorage.setItem('feedback', JSON.stringify(mockFeedback));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('feedback', JSON.stringify(feedback));
  }, [feedback]);

  return (
    <div className="p-6 pt-4 bg-white/70 backdrop-blur-sm min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Support & Feedback</h1>

      {/* Tabs */}
      <div className="flex mb-6 bg-white/90 rounded-lg p-2 border border-gray-200">
        {['Support Tickets', 'Feedback'].map((label, index) => (
          <button
            key={index}
            className={`px-6 py-2 font-semibold transition-colors duration-200 ${
              tab === index
                ? 'bg-blue-600 text-white rounded-md'
                : 'text-gray-600 hover:bg-gray-100 rounded-md'
            } mx-1 text-base`}
            onClick={() => setTab(index)}
            aria-label={`Select ${label} tab`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Support Tickets */}
      {tab === 0 && (
        <div className="bg-white/90 rounded-lg shadow border border-gray-200 p-6">
          <SupportTickets tickets={tickets} setTickets={setTickets} />
        </div>
      )}

      {/* Feedback */}
      {tab === 1 && (
        <div className="bg-white/90 rounded-lg shadow border border-gray-200 p-6">
          <FeedbackTable feedback={feedback} setFeedback={setFeedback} />
        </div>
      )}
    </div>
  );
};

export default SupportAndFeedback;