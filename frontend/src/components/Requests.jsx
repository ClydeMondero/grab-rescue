import { useContext, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import { BiSolidHappyBeaming } from "react-icons/bi";
import { RiPinDistanceFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoSpeedometerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RescuerContext } from "../contexts/RescuerContext";
import { getRouteData, getNearestRescuer } from "../services/locationService";
import placeholder from "../assets/placeholder.png";
import { formatDistance, formatDuration } from "../utils/DistanceUtility";
import { setSelectedRequestCookie } from "../services/cookieService";
import { acceptRescueRequestInFirestore } from "../services/firestoreService";
import { getLocationsFromFirestore } from "../services/firestoreService";
import { NoRequests, NotNearestRescuerPrompt } from "../components";

const Requests = ({
  userId,
  requests,
  selectedRequest,
  setSelectedRequest,
}) => {
  const navigate = useNavigate();
  const { rescuer, setPage } = useContext(RescuerContext);
  const [rescuers, setRescuers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedRequest, setDetailedRequest] = useState(null);

  const [filteredRescuers, setFilteredRescuers] = useState([]);
  const [nearestRescuer, setNearestRescuer] = useState(null);
  const [showNotNearestModal, setShowNotNearestModal] = useState(false);
  const [hasConfirmedRequest, setHasConfirmedRequest] = useState(false);
  const [citizen, setCitizen] = useState({
    longitude: 120.926105,
    latitude: 14.969063,
    zoom: 15,
  });

  const [routeData, setRouteData] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (selectedRequest && !hasConfirmedRequest) {
      console.log("Selected request:", selectedRequest);

      const nearest = getNearestRescuer(citizen, filteredRescuers);
      setNearestRescuer(nearest);

      if (nearest) {
        if (nearest.userId !== userId) {
          console.log("You are not the nearest rescuer.");
          setShowNotNearestModal(true);
        } else {
          console.log("You are the nearest rescuer.");
          handleAssign();
          setShowNotNearestModal(false);
        }
      } else {
        console.log("No nearest rescuer found.");
        setShowNotNearestModal(false);
      }
    }
  }, [citizen, filteredRescuers, userId, selectedRequest, hasConfirmedRequest]);

  const handleAccept = async (requestID) => {
    setSelectedRequest(requestID);
    const selected = requests.find((request) => request.id === requestID);
    if (selected) {
      setCitizen({
        longitude: selected.location.longitude,
        latitude: selected.location.latitude,
        zoom: 15,
      });
    } else {
      console.error("Request not found for ID:", requestID);
    }
  };

  const handleAssign = async () => {
    setSelectedRequestCookie(selectedRequest);
    setHasConfirmedRequest(true);
    await acceptRescueRequestInFirestore(userId, selectedRequest);
    setPage("Navigate");
    window.location.replace("/rescuer/navigate");
  };

  const handleContinue = async () => {
    setShowNotNearestModal(false);
    console.log("Continue with the request.");
    handleAssign();
  };

  const handleCancel = () => {
    setSelectedRequest(null);
    setShowNotNearestModal(false);
  };

  const fetchRoutes = async () => {
    const newRouteData = {};

    for (const request of pendingRequests) {
      const route = await getRouteData(rescuer, request.location);
      newRouteData[request.id] = route;
    }
    setRouteData(newRouteData);
  };

  useEffect(() => {
    const unsubscribe = getLocationsFromFirestore("rescuer", (data) => {
      setRescuers(data.filter((rescuer) => rescuer.status !== "offline"));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (requests) {
      const filterAssignedRequests = requests.filter(
        (request) => request.status === "assigned"
      );
      const assignedRescuerIds = filterAssignedRequests.map(
        (request) => request.rescuerId
      );
      const filteredAssignedRescuers = rescuers.filter(
        (rescuer) => !assignedRescuerIds.includes(rescuer.userId)
      );
      setFilteredRescuers(filteredAssignedRescuers);
    }
  }, [requests, rescuers]);

  useEffect(() => {
    if (requests) {
      const pendingRequests = requests.filter(
        (request) => request.status === "pending"
      );

      setPendingRequests(pendingRequests);
    }
  }, [requests]);

  useEffect(() => {
    fetchRoutes();
  }, [pendingRequests]);

  const handleCardClick = (request) => {
    setDetailedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`flex-1 full flex flex-col pt-0 p-6 ${
        pendingRequests.length > 0 ? "" : "justify-center"
      }`}
    >
      <div
        className={`hidden flex-col items-start justify-between mb-4 md:flex md:${
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
            ? "grid grid-cols-1 md:grid-cols-2 gap-6 "
            : ""
        }`}
      >
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => {
            const route = routeData[request.id] || {};

            return (
              <div
                key={request.id}
                className="block bg-background-light shadow-lg rounded-lg"
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
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div
                    className={`absolute top-4 left-4 text-sm font-semibold text-white py-1 px-3 rounded-lg shadow-md ${
                      request.status === "pending" ? "bg-yellow-500" : ""
                    }`}
                  >
                    {request.status
                      ? String(request.status[0]).toUpperCase() +
                        request.status.slice(1)
                      : ""}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between p-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <FaMapLocation className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">
                          Rescue Types{" "}
                        </strong>
                        {request.rescueTypes && (
                          <>
                            {request.rescueTypes.map((type, index) => {
                              let typeClass = "";
                              switch (type) {
                                case "PNP":
                                  typeClass = "text-highlight";
                                  break;
                                case "MDRRMO":
                                  typeClass = "text-primary";
                                  break;
                                case "BFP":
                                  typeClass = "text-warning";
                                  break;
                                default:
                                  typeClass = "text-gray-500";
                              }
                              return (
                                <span key={index} className={typeClass}>
                                  {type}
                                  {index < request.rescueTypes.length - 1 &&
                                    ", "}
                                </span>
                              );
                            })}
                          </>
                        )}
                      </p>
                    </div>

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
                        {route?.distance
                          ? formatDistance(route.distance)
                          : "Loading..."}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoSpeedometerSharp className="text-background-medium" />
                      <p className="text-sm text-text-primary">
                        <strong className="text-[#557C55]">ETA </strong>
                        {route?.duration
                          ? formatDuration(route.duration)
                          : "Loading..."}
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
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAccept(request.id);
                        }}
                        className="w-full px-4 py-4 text-sm sm:text-base font-semibold text-white bg-[#557C55] rounded-lg transition-all hover:bg-[#465B46] active:scale-95 shadow-md"
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

      {showNotNearestModal && (
        <NotNearestRescuerPrompt
          onContinue={handleContinue}
          onCancel={handleCancel}
        />
      )}

      {isModalOpen && (
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={detailedRequest}
        />
      )}
    </div>
  );
};

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-4/5 lg:w-1/3 transition-transform transform">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2 className="text-xl font-bold text-gray-700">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Incident Image */}
        <div className="flex justify-center mb-6">
          <img
            src={request.incidentPicture || placeholder}
            alt="Incident"
            className="w-full h-40 object-cover rounded-md border border-gray-200"
          />
        </div>

        {/* Information Section */}
        <div className="text-sm space-y-6 border-t border-gray-200 pt-4">
          {/* Citizen Information */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Citizen Information
            </h3>
            <div className="grid grid-cols-2 gap-x-6 text-gray-600">
              <p>
                <strong>Citizen Name:</strong>{" "}
                {request.citizenName || "Not Provided"}
              </p>
              <p>
                <strong>Contact:</strong> {request.phone || "Not Provided"}
              </p>
              <p>
                <strong>Relation:</strong>{" "}
                {request.citizenRelation || "Not Provided"}
              </p>
            </div>
          </div>

          {/* Incident Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Incident Details
            </h3>
            <p className="text-gray-600">
              <strong>Description:</strong>{" "}
              {request.incidentDescription || "Not Provided"}
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong>{" "}
              {request.location?.address || "Not Provided"}
            </p>
          </div>

          {/* Request Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Request Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 text-gray-600">
              <p>
                <strong>Distance:</strong>{" "}
                {request.distance
                  ? formatDistance(request.distance)
                  : "Unknown"}
              </p>
              <p>
                <strong>ETA:</strong>{" "}
                {request.duration
                  ? formatDuration(request.duration)
                  : "Unknown"}
              </p>
              <p>
                <strong>Request Time:</strong>{" "}
                {request.timestamp &&
                  (() => {
                    const requestDate = new Date(request.timestamp);
                    const now = new Date();

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
                        <span className="text-text-secondary">{timeLabel}</span>
                      </>
                    );
                  })()}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-1  text-yellow-500
                  `}
                >
                  {request.status
                    ? request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)
                    : "Unknown"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
