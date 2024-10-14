import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getRequestsFromFirestore } from "../services/firestoreService";
import { useState, useEffect } from "react";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    const requests = await getRequestsFromFirestore();

    setRequests(requests);

    requests.map((request) => {
      console.log(request);
    });
  };

  useEffect(() => {
    getRequests();
  }, []);

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
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-3">
        {requests.map((request) => (
          <div
            key={request}
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
                  {request.address}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">Distance: </strong>
                  {request.distance}m
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">ETA: </strong>{" "}
                  {request.eta}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-[#557C55]">Request Time: </strong>
                  {new Intl.DateTimeFormat("en-US", {
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
                <Link
                  to="/rescuer/navigate"
                  className="px-4 py-2 text-sm sm:text-base font-semibold text-white bg-[#557C55] hover:bg-green-600 transition-colors rounded"
                >
                  Accept
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
