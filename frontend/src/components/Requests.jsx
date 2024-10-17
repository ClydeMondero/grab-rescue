import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { BiSolidHappyBeaming } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getDistance } from "../utils/DistanceUtility";

//TODO: Add Completed Button
//TODO: Add Status in Request Card
//TODO: Make selected request persistent using cookies
//TODO: Calculate ETA and Distance then show on request card
const Requests = ({ requests, onSelectRequest }) => {
  const navigate = useNavigate();

  /**
   * Handle Accept button click
   * @param {string} requestID - Request ID to accept
   */
  const handleAccept = (requestID) => {
    // Select the request and navigate to navigate page
    onSelectRequest(requestID);
    navigate("/rescuer/navigate");
  };

  // Filter out assigned requests
  const unassignedRequests = requests.filter(
    (request) => request.status !== "assigned"
  );

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto h-[calc(100vh-160px)]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#557C55] flex items-center space-x-2">
          <FaExclamationTriangle className="text-secondary" />
          <span className="text-primary-dark">Emergency Requests</span>
        </h2>
      </div>

      {/* Scrollable Request Cards Section */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-3">
        {unassignedRequests.length > 0 ? (
          unassignedRequests.map((request) => (
            <div
              key={request.id}
              className="block p-4 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                {/* Request Info */}
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-[#557C55] mb-2 flex items-center space-x-2">
                    <FaExclamationTriangle className="text-red-500" />
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong className="text-[#557C55]">Location: </strong>
                    {request.location && request.location.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-[#557C55]">Distance: </strong>
                    {request.location &&
                      getDistance(
                        request.location.latitude,
                        request.location.longitude
                      )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-[#557C55]">ETA: </strong> Coming
                    soon...
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-[#557C55]">Request Time: </strong>
                    {request.timestamp &&
                      new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(request.timestamp))}
                  </p>
                </div>

                {/* Action Section */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-4 py-2 text-sm sm:text-base font-semibold text-white bg-primary hover:bg-green-600 transition-colors rounded"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <NoRequests />
        )}
      </div>
    </div>
  );
};

/**
 * Display message when there are no emergency requests
 */
const NoRequests = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <BiSolidHappyBeaming className="text-8xl text-background-medium" />
      <h2 className="text-2xl font-bold text-primary-medium mb-4">
        No Emergency Requests
      </h2>
      <p className="text-center text-sm sm:text-base text-text-secondary">
        There are currently no emergency requests. Please check again later.
      </p>
    </div>
  );
};

export default Requests;
