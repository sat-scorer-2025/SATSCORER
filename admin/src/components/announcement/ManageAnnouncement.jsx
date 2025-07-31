import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NotificationModal from './NotificationModal';
import { useAuth } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useOutletContext } from 'react-router-dom';

const ManageAnnouncement = () => {
  const { notifications, setNotifications, filteredNotifications, setFilteredNotifications, loading, error } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const { token } = useAuth();
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    const filtered = notifications.filter((notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotifications(filtered);
  }, [searchTerm, notifications, setFilteredNotifications]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));

    setFilteredNotifications((prev) =>
      [...prev].sort((a, b) => {
        if (sortConfig.key === 'title') {
          return sortConfig.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortConfig.key === 'createdAt') {
          return sortConfig.direction === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortConfig.key === 'status') {
          return sortConfig.direction === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        return 0;
      })
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const handleResend = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notification/resend/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => n._id === id ? response.data.notification : n));
      setFilteredNotifications(filteredNotifications.map(n => n._id === id ? response.data.notification : n));
      addNotification(response.data.notification);
      toast.success('Notification resent successfully');
    } catch (error) {
      console.error('Error resending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to resend notification');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/notification/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(notifications.filter(n => n._id !== id));
        setFilteredNotifications(filteredNotifications.filter(n => n._id !== id));
        toast.success('Notification deleted successfully');
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error(error.response?.data?.message || 'Failed to delete notification');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Notifications</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm mb-6">{error}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="relative flex-grow mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search notifications by title or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 pl-10"
            aria-label="Search notifications"
            disabled={loading}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      {loading ? (
        <p className="text-lg text-gray-600 text-center">Loading...</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">No notifications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700">
                <th
                  className="p-4 font-medium cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Title {getSortIcon('title')}
                </th>
                <th className="p-4 font-medium">Audience</th>
                <th
                  className="p-4 font-medium cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created At {getSortIcon('createdAt')}
                </th>
                <th className="p-4 font-medium">Scheduled At</th>
                <th className="p-4 font-medium">Channel</th>
                <th
                  className="p-4 font-medium cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notification, index) => (
                <tr
                  key={notification._id}
                  className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-4 text-gray-800">{notification.title}</td>
                  <td className="p-4 text-gray-800">{notification.recipientDetails?.value || notification.recipient}</td>
                  <td className="p-4 text-gray-800">{formatDate(notification.createdAt)}</td>
                  <td className="p-4 text-gray-800">{notification.scheduledAt ? formatDate(notification.scheduledAt) : '-'}</td>
                  <td className="p-4 text-gray-800">{notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        notification.status === 'sent'
                          ? 'bg-teal-100 text-teal-700'
                          : notification.status === 'pending'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedNotification(notification)}
                      className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1 transition-colors"
                      aria-label={`View ${notification.title}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleResend(notification._id)}
                      className="text-green-600 hover:text-green-700 font-semibold flex items-center space-x-1 transition-colors"
                      aria-label={`Resend ${notification.title}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Resend</span>
                    </button>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 transition-colors"
                      aria-label={`Delete ${notification.title}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <NotificationModal
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </div>
  );
};

export default ManageAnnouncement;