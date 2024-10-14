import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Requests = () => {
  return (
    <div className=" flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto h-[calc(100vh-160px)]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#557C55] flex items-center space-x-2">
          <FaExclamationTriangle className="text-secondary" />
          <span className="text-primary-dark">Emergency Requests</span>
        </h2>
      </div>

      {/* Scrollable Request Cards Section */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] space-y-3">
        {[1, 2, 3, 4, 5, 6].map((request) => (
          <div
            key={request}
            className="block p-4 bg-white border transition-colors border-primary rounded-md"
          >
            <Link
              to={`/rescuer/request-details/${request}`}
              className="block p-4 bg-white transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full ">
                {/* Request Info */}
                <div className="mb-4 sm:mb-0 ">
                  <h3 className="text-lg font-bold text-[#557C55] mb-2 flex items-center space-x-2">
                    <FaExclamationTriangle className="text-secondary" />
                    <span className="text-primary">
                      High Priority Request #{request}
                    </span>
                  </h3>
                  <p className="text-sm sm:text-base text-primary-dark">
                    <strong className="text-secondary">Location:</strong> 123
                    Main St
                  </p>
                  <p className="text-sm sm:text-base text-primary-dark">
                    <strong className="text-secondary">Distance:</strong> 1.2 km
                  </p>
                  <p className="text-sm sm:text-base text-primary-dark">
                    <strong className="text-secondary">ETA:</strong> 10:00 AM
                  </p>
                  <p className="text-sm sm:text-base text-primary-dark">
                    <strong className="text-secondary">Request Time:</strong>{" "}
                    10:00 AM
                  </p>
                </div>

                {/* Action Section */}
                <div className="flex items-center">
                  <Link
                    to="/rescuer/navigate"
                    className="px-4 py-2 text-sm sm:text-base font-semibold text-white bg-primary hover:bg-green-600 transition-colors rounded"
                  >
                    Accept
                  </Link>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
