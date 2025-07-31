import React, { useState } from 'react';

const TicketModal = ({ open, onClose, ticket, onUpdate }) => {
  if (!open || !ticket) return null;

  const [status, setStatus] = useState(ticket.status);
  const [notes, setNotes] = useState(ticket.notes);
  const [reply, setReply] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleSave = () => {
    onUpdate({ ...ticket, status, notes });
    alert('Ticket updated successfully.');
    setReply('');
    setAssignee('');
  };

  const handleReply = () => {
    if (reply.trim()) {
      setNotes(notes ? `${notes}\n[Reply]: ${reply}` : `[Reply]: ${reply}`);
      setReply('');
      alert('Reply added to notes.');
    }
  };

  const handleAssign = () => {
    if (assignee.trim()) {
      setNotes(notes ? `${notes}\n[Assigned]: ${assignee}` : `[Assigned]: ${assignee}`);
      setAssignee('');
      alert('Assignee added to notes.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 rounded-lg border border-gray-200 max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{ticket.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-200 rounded-full p-2"
            aria-label="Close ticket modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <p><strong>Student:</strong> {ticket.studentName}</p>
          <p><strong>Date Created:</strong> {new Date(ticket.dateCreated).toLocaleString()}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <div>
            <strong>Description:</strong>
            <p className="mt-1 p-3 bg-white rounded-md border border-gray-200 text-sm">
              {ticket.description}
            </p>
          </div>
          <div>
            <strong>Status:</strong>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Ticket status"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <strong>Notes:</strong>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full mt-1 p-3 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Ticket notes"
            />
          </div>
          <div>
            <strong>Reply:</strong>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={2}
              className="w-full mt-1 p-3 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type your reply..."
              aria-label="Reply to ticket"
            />
            <button
              onClick={handleReply}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              aria-label="Add reply"
            >
              Add Reply
            </button>
          </div>
          <div>
            <strong>Assign:</strong>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Enter assignee name"
              className="w-full mt-1 p-3 border border-gray-200 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Assign ticket"
            />
            <button
              onClick={handleAssign}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              aria-label="Assign ticket"
            >
              Assign
            </button>
          </div>
        </div>
        <div className="mt-6 text-right space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            aria-label="Save ticket changes"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;