import React, { useState } from 'react';
import TicketModal from './TicketModal';

const SupportTickets = ({ tickets, setTickets }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [draggedTicket, setDraggedTicket] = useState(null);

  const columns = {
    New: tickets.filter((ticket) => ticket.status === 'New'),
    'In Progress': tickets.filter((ticket) => ticket.status === 'In Progress'),
    Resolved: tickets.filter((ticket) => ticket.status === 'Resolved'),
  };

  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.setData('text/plain', ticket.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTicket) {
      setTickets(
        tickets.map((ticket) =>
          ticket.id === draggedTicket.id ? { ...ticket, status: newStatus } : ticket
        )
      );
      setDraggedTicket(null);
    }
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets(tickets.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket)));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(columns).map((status) => (
          <div
            key={status}
            className="bg-gray-100 rounded-lg p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3 className="text-md font-semibold text-gray-700 mb-4">{status}</h3>
            {columns[status].length === 0 ? (
              <p className="text-gray-500 text-sm">No tickets</p>
            ) : (
              columns[status].map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white/90 rounded-md border border-gray-200 p-4 mb-4 shadow-sm cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ticket)}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <h4 className="text-sm font-semibold text-gray-900">{ticket.title}</h4>
                  <p className="text-xs text-gray-600">{ticket.studentName}</p>
                  <p className="text-xs text-gray-500 truncate">{ticket.description}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(ticket.dateCreated).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      ticket.priority === 'High'
                        ? 'text-red-600'
                        : ticket.priority === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    Priority: {ticket.priority}
                  </p>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <TicketModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onUpdate={handleUpdateTicket}
      />
    </div>
  );
};

export default SupportTickets;