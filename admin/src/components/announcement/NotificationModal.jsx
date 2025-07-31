import React from 'react';

const NotificationModal = ({ open, onClose, notification }) => {
  if (!open || !notification) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{notification.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notification modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 text-gray-600">
          <p><strong>Audience:</strong> {notification.recipientDetails?.value || notification.recipient}</p>
          <p><strong>Type:</strong> {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</p>
          <p><strong>Channel:</strong> {notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}</p>
          <p><strong>Created At:</strong> {formatDate(notification.createdAt)}</p>
          {notification.scheduledAt && (
            <p><strong>Scheduled At:</strong> {formatDate(notification.scheduledAt)}</p>
          )}
          <p><strong>Status:</strong> {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}</p>
          <div>
            <strong>Message:</strong>
            <pre className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap">
              {notification.message}
            </pre>
          </div>
          {notification.image && (
            <div>
              <strong>Image:</strong>
              <img src={notification.image} alt="Notification" className="mt-2 max-w-full rounded-lg border border-gray-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
