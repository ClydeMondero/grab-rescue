import { useContext, useState, useEffect } from "react";
import { FaExclamation } from "react-icons/fa";
import { BiSolidHappyBeaming } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { RescuerContext } from "../contexts/RescuerContext";
import { getRouteData } from "../services/locationService";

// TODO: Add Completed Button
// TODO: Add Status in Request Card
// TODO: Make selected request persistent using cookies
//TODO: format request datas

const Requests = ({ requests, onSelectRequest }) => {
  const navigate = useNavigate();
  const { rescuer } = useContext(RescuerContext);

  // State to store routes data for requests
  const [routeData, setRouteData] = useState({});

  /**
   * Handle Accept button click
   * @param {string} requestID - Request ID to accept
   */
  const handleAccept = (requestID) => {
    // Select the request and navigate to navigate page
    onSelectRequest(requestID);
    navigate("/rescuer/navigate");
  };

  const fetchRoutes = async () => {
    const newRouteData = {};
    for (const request of requests) {
      const route = await getRouteData(rescuer, request.location);
      newRouteData[request.id] = route;
    }
    setRouteData(newRouteData);
  };

  // Filter out assigned requests
  const unassignedRequests = requests.filter(
    (request) => request.status !== "assigned"
  );

  // Fetch route data for each request
  useEffect(() => {
    if (requests.length > 0) {
      fetchRoutes();
    }
  }, [requests, rescuer]);

  useEffect(() => {
    fetchRoutes;
  }, []);

  return (
    <div className="flex flex-col p-6">
      {/* Header Section */}
      <div className="hidden flex-col items-start justify-between mb-4 md:flex">
        <h2 className="text-3xl font-bold text-[#557C55] flex items-center gap-2">
          <FaExclamation className="text-secondary" />
          <span className="text-primary-dark">Requests</span>
        </h2>
      </div>

      {/* Scrollable Request Cards Section */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-3">
        {unassignedRequests.length > 0 ? (
          unassignedRequests.map((request) => {
            const route = routeData[request.id] || {};

            return (
              <div
                key={request.id}
                className="block p-4 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                  {/* Request Info */}
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#557C55]">Location: </strong>
                      {request.location && request.location.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#557C55]">Distance: </strong>
                      {route.distance && route.distance}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#557C55]">ETA: </strong>
                      {route.duration && route.duration}
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
            );
          })
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
