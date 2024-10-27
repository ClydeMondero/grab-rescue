import React from "react";
import { useNotifications } from "./NotificationContext";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const { notifications } = useNotifications();

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-6 h-full rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-3 sm:mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center">
          <FaBell className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
          <h4 className="text-md sm:text-xl lg:text-2xl font-semibold text-[#557C55]">
            Notifications
          </h4>
        </div>
      </div>
      <p className="mb-3 sm:mb-4 text-xs sm:text-sm lg:text-md text-primary-medium">
        Notifications will appear here:
      </p>

      {/* Card Container for Notifications */}
      <ul className="rounded-md p-2 bg-primary-medium">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              className="border-b border-gray-200 p-4 last:border-b-0"
              key={notification.id}
            >
              <div className="flex justify-between items-center ">
                <h5 className="text-xl font-medium text-white">
                  {notification.message}
                </h5>
                <small className="text-white">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(notification.id))}
                </small>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-600">
            No notifications available.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
