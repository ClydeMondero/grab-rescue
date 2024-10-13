import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Requests = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen flex flex-col p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#557C55] flex items-center space-x-2">
          <FaExclamationTriangle className="text-red-500" />
          <span>Emergency Requests</span>
        </h2>
      </div>

      {/* Scrollable Request Cards Section */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-6">
        {[1, 2, 3, 4, 5, 6].map((request) => (
          <Link
            to={`/rescuer/request-details/${request}`} // Dynamic route for each request
            key={request}
            className="block p-4 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
              {/* Request Info */}
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-bold text-[#557C55] mb-2 flex items-center space-x-2">
                  <FaExclamationTriangle className="text-red-500" />
                  <span>High Priority Request #{request}</span>
                </h3>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">Location:</strong> 123 Main
                  St
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">Distance:</strong> 1.2 km
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">ETA:</strong> 10:00 AM
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">Request Time:</strong>{" "}
                  10:00 AM
                </p>
              </div>

              {/* Action Section */}
              <div className="flex items-center">
                <span className="px-4 py-2 text-sm sm:text-base font-semibold text-white bg-[#557C55] hover:bg-green-600 transition-colors rounded">
                  Accept
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Requests;
