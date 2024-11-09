import React, { createContext, useState, useContext, useEffect } from "react";

// Create the NotificationContext
const NotificationContext = createContext();

// Custom hook to access notifications
export const useNotifications = () => useContext(NotificationContext);

// NotificationsProvider component
export const NotificationsProvider = ({ children }) => {
  // Initialize state from localStorage if it exists
  const [notifications, setNotifications] = useState(() => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });

  // Function to add a new notification
  const addNotification = (message) => {
    const newNotification = { id: Date.now(), message };
    const updatedNotifications = [...notifications, newNotification];

    // Update state
    setNotifications(updatedNotifications);

    // Save to localStorage
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  // Function to clear notifications (e.g., on logout)
  const clearNotifications = () => {
    setNotifications([]); // Clear state
    localStorage.removeItem("notifications"); // Remove from localStorage
  };

  // Optionally sync state with localStorage (if notifications change)
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
