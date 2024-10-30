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
import { setSelectedRequestCookie } from "../services/cookieService";
import { acceptRescueRequestInFirestore } from "../services/firestoreService";

const Requests = ({
  userId,
  requests,
  selectedRequest,
  setSelectedRequest,
}) => {
  const navigate = useNavigate();
  const { rescuer, setPage } = useContext(RescuerContext);

  const [routeData, setRouteData] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);

  const handleAccept = async (requestID) => {
    setSelectedRequestCookie(requestID);
    setSelectedRequest(requestID);

    await acceptRescueRequestInFirestore(userId, requestID);
    setPage("Navigate");
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
    setPendingRequests(
      requests.filter((request) => request.status !== "assigned")
    );

    if (pendingRequests.length > 0) {
      fetchRoutes();
    }
  }, [requests, rescuer]);

  const handleCardClick = (request) => {
    setSelectedRequestData(request);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`min-h-full flex flex-col p-6 ${
        pendingRequests.length > 0 ? "" : "justify-center"
      }`}
    >
      <div
        className={`hidden flex-col items-start justify-between mb-4 md:flex ${
          pendingRequests.length > 0 ? "" : "hidden"
        }`}
      >
        <h2 className="text-3xl font-bold text-[#557C55] flex items-center gap-2">
          Requests
        </h2>
      </div>
      <div
        className={`${
          pendingRequests.length > 0
            ? "grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto"
            : ""
        }`}
      >
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => {
            const route = routeData[request.id] || {};
            return (
              <div
                key={request.id}
                className="block bg-white border border-gray-300 rounded-md overflow-hidden cursor-pointer"
                onClick={() => handleCardClick(request)}
              >
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
                      request.status === "pending" ? "bg-yellow-500" : ""
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </div>
                  <FaLocationArrow
                    className="absolute top-4 right-4 text-2xl text-background-light cursor-pointer"
                    onClick={() => handleNavigate(request.id)}
                  />
                </div>

                <div className="flex flex-col items-start justify-between p-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <FaMapLocation className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">Location </strong>
                        {request.location && (
                          <>
                            {request.location.address
                              .split(",")
                              .slice(0, 5)
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

                            const formattedTime = new Intl.DateTimeFormat(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                                hour12: true,
                              }
                            ).format(requestDate);

                            const timeElapsed = now - requestDate;

                            const minutesElapsed = Math.floor(
                              timeElapsed / (1000 * 60)
                            );
                            let timeLabel = "";

                            if (minutesElapsed < 60) {
                              timeLabel = `${minutesElapsed} minutes ago`;
                            } else if (minutesElapsed < 1440) {
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

                  <div className="w-full">
                    {!selectedRequest && (
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="h-full w-full px-6 py-4 text-sm sm:text-base font-semibold text-white bg-primary-medium transition-colors rounded-lg hover:opacity-[80%]"
                      >
                        Accept Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <NoRequests />
        )}
      </div>
      {/* Modal for Request Details */}
      {isModalOpen && selectedRequestData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-lg w-full mx-4 sm:mx-0">
            <h2 className="text-2xl font-bold text-center text-primary mb-4">
              Emergency Request Details
            </h2>
            <p className="text-sm text-gray-700  mb-2 text-end">
              Date & Time:{" "}
              {new Date(selectedRequestData.timestamp).toLocaleString()}
            </p>
            <div className="relative">
              <img
                src={
                  selectedRequestData.incidentPicture
                    ? selectedRequestData.incidentPicture
                    : placeholder
                }
                alt="Incident Picture"
                className="w-full h-56 object-cover rounded-md shadow-sm"
              />
              <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-70 text-white text-sm rounded-tr-lg">
                {selectedRequestData.location.address}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6 ">
              <div className="flex flex-col items-start justify-around w-full">
                <div className="flex flex-row justify-between gap-2 w-full">
                  <p className="text-lg text-primary-dark font-bold mb-1 col-span-2">
                    {selectedRequestData.citizenName}
                    <span className="text-gray-600">
                      {" "}
                      ({selectedRequestData.citizenRelation})
                    </span>
                  </p>
                  <p className="text-lg text-primary-dark font-bold">
                    {selectedRequestData.phone}
                  </p>
                </div>

                <p className="text-md text-primary-medium font-semibold mb-2">
                  Description:
                </p>
                <div className="border rounded-lg p-4 bg-gray-100 w-full h-32 overflow-y-auto ">
                  <p className="text-base text-primary-dark">
                    {selectedRequestData.incidentDescription}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-primary-medium hover:bg-primary text-white font-semibold px-5 py-3 rounded-lg w-full transition-colors duration-300 shadow-md hover:shadow-lg transform transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NoRequests = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <BiSolidHappyBeaming className="text-4xl text-gray-400" />
    <p className="text-gray-400">No requests available at the moment.</p>
  </div>
);

export default Requests;
