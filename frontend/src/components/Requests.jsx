import { useContext, useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidHappyBeaming } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { RescuerContext } from "../contexts/RescuerContext";
import { getRouteData } from "../services/locationService";

// TODO: Add Completed Button
// TODO: Add Status in Request Card
// TODO: Make selected request persistent using cookies
// TODO: format request datas

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
    onSelectRequest(requestID);
    navigate("/rescuer/navigate");
  };

  const handleNavigate = (requestID) => {
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

  useEffect(() => {
    if (requests.length > 0) {
      fetchRoutes();
    }
  }, [requests, rescuer]);

  return (
    <div className="flex flex-col p-6">
      {/* Header Section */}
      <div className="hidden flex-col items-start justify-between mb-4 md:flex">
        <h2 className="text-3xl font-bold text-[#557C55] flex items-center gap-2">
          Requests
        </h2>
      </div>

      {/* Scrollable Request Cards Section */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-3">
        {requests.length > 0 ? (
          requests.map((request) => {
            const route = routeData[request.id] || {};

            return (
              <div
                key={request.id}
                className="block bg-white border border-gray-300 rounded-md overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/400x200" // replace with actual image if available
                    alt="Request Location"
                    className="w-full h-40 object-cover"
                  />
                  {/* Pin Icon for Navigation */}
                  <FaMapMarkerAlt
                    className="absolute top-2 right-2 text-2xl text-secondary cursor-pointer"
                    onClick={() => handleNavigate(request.id)}
                  />
                </div>

                {/* Request Info & Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                  {/* Request Info */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 truncate max-w-[300px] overflow-ellipsis">
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

                  {/* Accept Button */}
                  <div className="flex-shrink-0 mt-4 sm:mt-0">
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
