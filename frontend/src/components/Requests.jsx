import { useContext, useState, useEffect } from "react";
import { FaMapLocation } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";
import { BiSolidHappyBeaming } from "react-icons/bi";
import { RiPinDistanceFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoSpeedometerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RescuerContext } from "../contexts/RescuerContext";
import { getRouteData } from "../services/locationService";
import placeholder from "../assets/placeholder.png";
import { formatDistance, formatDuration } from "../utils/DistanceUtility";

// TODO: Add Completed Button
// TODO: Add Status in Request Card
// TODO: Make selected request persistent using cookies

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
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
                    src={
                      request.incidentPicture
                        ? request.incidentPicture
                        : placeholder
                    }
                    alt="Incident Picture"
                    className="w-full h-40 object-cover"
                  />
                  <div
                    className={`absolute top-4 left-4 text-sm font-semibold text-white py-1 px-3 rounded-lg shadow-md ${
                      request.status === "pending"
                        ? "bg-yellow-400"
                        : request.status === "accepted"
                        ? "bg-green-400 "
                        : "bg-red-400 "
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </div>
                  {/* Pin Icon for Navigation */}
                  <FaLocationArrow
                    className="absolute top-4 right-4 text-2xl text-background-light cursor-pointer"
                    onClick={() => handleNavigate(request.id)}
                  />
                </div>

                {/* Request Info & Action */}
                <div className="flex flex-col items-start justify-between p-4 gap-4">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <FaMapLocation className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">Location </strong>
                        {request.location && (
                          <>
                            {request.location.address
                              .split(",")
                              .slice(0, 5) // Adjust this slice to include up to "Baliwag City"
                              .join(", ")}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <RiPinDistanceFill className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">Distance </strong>
                        {route.distance && formatDistance(route.distance)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoSpeedometerSharp className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">ETA </strong>
                        {route.duration && formatDuration(route.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdAccessTimeFilled className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">
                          Request Time{" "}
                        </strong>
                        {request.timestamp &&
                          (() => {
                            const requestDate = new Date(request.timestamp);
                            const now = new Date();

                            // Format the request time to a more readable format
                            const formattedTime = new Intl.DateTimeFormat(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long", // Full month name for readability
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                                hour12: true, // To format as AM/PM
                              }
                            ).format(requestDate);

                            // Calculate time elapsed in milliseconds
                            const timeElapsed = now - requestDate;

                            // Convert timeElapsed to minutes, hours, days, etc.
                            const minutesElapsed = Math.floor(
                              timeElapsed / (1000 * 60)
                            );
                            let timeLabel = "";

                            if (minutesElapsed < 60) {
                              timeLabel = `${minutesElapsed} minutes ago`;
                            } else if (minutesElapsed < 1440) {
                              // Less than a day
                              timeLabel = `${Math.floor(
                                minutesElapsed / 60
                              )} hours ago`;
                            } else {
                              timeLabel = `${Math.floor(
                                minutesElapsed / (60 * 24)
                              )} days ago`;
                            }

                            return (
                              <>
                                {formattedTime}{" "}
                                <span className="text-text-secondary">
                                  ({timeLabel})
                                </span>
                              </>
                            );
                          })()}
                      </p>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <div className="w-full">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="h-full w-full px-6 py-4 text-sm sm:text-base font-semibold text-white bg-primary transition-colors rounded-lg"
                    >
                      Accept Request
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
