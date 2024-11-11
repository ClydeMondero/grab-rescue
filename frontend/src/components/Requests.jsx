import { useContext, useState, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa";
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
import NotNearestRescuerPrompt from "./NotNearestRescuerPrompt"; // Import the modal component

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
    setPendingRequests(
      requests.filter((request) => request.status === "pending")
    );

    if (pendingRequests.length > 0 && rescuer) {
      fetchRoutes();
    }
  }, [requests, rescuer]);

  const handleCardClick = (request) => {
    setDetailedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`h-full flex flex-col p-6 ${
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
            ? "grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto"
            : ""
        }`}
      >
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => {
            const route = routeData[request.id] || {};

            return (
              <div
                key={request.id}
                className="block bg-white border border-gray-300 rounded-lg"
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-8 w-11/12 sm:w-3/4 lg:w-1/2 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 pb-2 border-gray-200">
          <h2 className="text-2xl font-semibold text-primary">
            Request Details
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-secondary rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Incident Image */}
        <div className="flex justify-center mb-4">
          <img
            src={request.incidentPicture || placeholder}
            alt="Incident"
            className="w-100 h-40 object-cover rounded-md"
          />
        </div>

        {/* Information Section */}
        <div className="space-y-6 text-gray-700">
          {/* Row 1: Name and Phone Number */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col flex-1">
              <p className="text-lg font-medium text-primary-medium">
                Citizen Name:
              </p>
              <p className="text-base text-primary-dark font-semibold">
                {request.citizenName || "N/A"}
              </p>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-lg font-medium text-primary-medium">
                Contact Number:
              </p>
              <p className="text-base text-primary-dark font-semibold">
                {request.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* Row 2: Relation and Description */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col flex-1">
              <p className="text-lg font-medium text-primary-medium">
                Relation:
              </p>
              <p className="text-base text-primary-dark font-semibold">
                {request.citizenRelation || "N/A"}
              </p>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-lg font-medium text-primary-medium">
                Description:
              </p>
              <p className="text-base text-primary-dark font-semibold">
                {request.incidentDescription || "N/A"}
              </p>
            </div>
          </div>

          {/* Row 3: Location */}
          <div className="flex flex-col">
            <p className="text-lg font-medium text-primary-medium">Location:</p>
            <p className="text-base text-primary-dark font-semibold">
              {request.location?.address || "Address not available"}
            </p>
          </div>

          {/* Row 4: Distance, ETA, and Request Time */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col flex-1">
              <p className="text-lg font-medium text-primary-medium">
                Distance:
              </p>
              <p className="text-base text-primary-dark font-semibold">
                {request.distance ? formatDistance(request.distance) : "N/A"}
              </p>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-lg font-medium text-primary-medium">ETA:</p>
              <p className="text-base text-primary-dark font-semibold">
                {request.duration ? formatDuration(request.duration) : "N/A"}
              </p>
            </div>
          </div>

          {/* Row 5: Status and Request Time */}
          <div className="flex flex-col">
            <p className="text-lg font-medium text-primary-medium">
              Request Time:
            </p>
            <p className="text-base text-primary-dark font-semibold">
              {new Date(request.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Row 6: Status */}
          <div className="flex flex-col">
            <p className="text-lg font-medium text-primary-medium">Status:</p>
            <p className="text-base text-yellow-500 font-semibold">
              {request.status
                ? request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)
                : "N/A"}
            </p>
          </div>
        </div>
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
