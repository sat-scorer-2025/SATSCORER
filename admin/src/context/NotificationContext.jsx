import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token, isLoading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user || !user._id || !token) {
      return;
    }

    const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('joinRoom', user._id);
    });

    newSocket.on('newNotification', (notification) => {
      console.log('Received new notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      toast.info(`${notification.title}: ${notification.message}`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        cause: error.cause,
      });
      toast.error('Failed to connect to notification service');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected');
    };
  }, [user, token, isLoading]);

  const addNotification = (notification) => {
    console.log('Adding notification to state:', notification);
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;