import React, { useEffect, useState, useRef, useContext } from "react";
import { RescuerMap as Map } from "../components";
import {
  FaLocationArrow,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
} from "react-icons/fa";
import {
  completeRequestInFirestore,
  getRequestFromFirestore,
  updateRequestStatusInFirestore,
  getLocationFromFirestore,
  getLocationIDFromFirestore,
  getLocationFromFirestoreInRealTime,
  addRescuerRemarksToFirestore,
} from "../services/firestoreService";
import { Loader } from "../components";
import MobileDetect from "mobile-detect";
import { toast } from "react-toastify";
import { RescuerContext } from "../contexts/RescuerContext";
import { StatusContext } from "../contexts/StatusContext";
import placeholder from "../assets/placeholder.png";
import {
  getSelectedRequestCookie,
  deleteCookie,
} from "../services/cookieService";

const statuses = ["assigned", "in transit", "en route", "rescued"];

const Navigate = ({ user, requestID, setSelectedRequest }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [locating, setLocating] = useState(false);
  const [onMobile, setOnMobile] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [statusToUpdate, setStatusToUpdate] = useState(null); // State to hold the next status to update
  const { id, getId } = useContext(StatusContext);
  const { navigating, setNavigating } = useContext(RescuerContext);
  const mapRef = useRef();
  const [requestLocation, setRequestLocation] = useState(null);
  const [remarks, setRemarks] = useState("");

  const handleLocatingChange = (newLocatingState) => {
    setLocating(newLocatingState);
  };

  useEffect(() => {
    if (requestID === null) return;

    const unsubscribe = getRequestFromFirestore(requestID, (requestData) => {
      if (requestData) {
        setRequestData(requestData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [requestID]);

  useEffect(() => {
    if (requestData) {
      const citizen = requestData.citizenId;

      if (citizen) {
        getLocationFromFirestoreInRealTime(citizen, setRequestLocation);
      }

      if (requestData.rescuerRemarks) {
        setRemarks(requestData.rescuerRemarks);
      }
    }
  }, [requestData]);

  const handlePhone = () => {
    if (onMobile) {
      window.location.href = `tel:${requestData.phone}`;
    } else {
      navigator.clipboard
        .writeText(requestData.phone)
        .then(() => {
          toast.info("Phone copied to clipboard");
        })
        .catch((err) => {
          toast.warning("Phone didn't get copied");
        });
    }
  };

  const handleStatusChangeClick = (newStatus) => {
    setStatusToUpdate(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    if (
      statusToUpdate &&
      statuses.indexOf(statusToUpdate) > statuses.indexOf(requestData.status)
    ) {
      setRequestData((prevData) => ({ ...prevData, status: statusToUpdate }));
      updateRequestStatusInFirestore(requestID, statusToUpdate);
      if (statusToUpdate === "rescued") {
        const location = await getRescueLocation();
        if (location && location.address) {
          completeRequestInFirestore(requestID, location.address);
        }
        deleteCookie("selected_request");
        setSelectedRequest(null);
        setRequestData(null);
        window.location.reload();
      }
    }
    setShowModal(false); // Close modal after confirmation
  };

  const getRescueLocation = async () => {
    if (id) {
      const locationId = await getLocationIDFromFirestore(id);
      if (locationId) {
        const location = await getLocationFromFirestore(locationId);
        return location;
      }
    }
  };

  const cancelStatusChange = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isMobile = !!md.mobile() && isSmallScreen;
    setOnMobile(isMobile);
  }, []);

  // Find the next status based on the current status
  const getNextStatus = (currentStatus) => {
    const currentIndex = statuses.indexOf(currentStatus);
    return currentIndex < statuses.length - 1
      ? statuses[currentIndex + 1]
      : null;
  };

  const nextStatus = getNextStatus(requestData?.status);

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1">
        {requestID ? (
          requestData ? (
            <Map
              rescuerType={user?.rescuer_type}
              mapRef={mapRef}
              citizen={requestLocation || requestData?.location}
              onLocatingChange={handleLocatingChange}
              navigating={navigating}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Loader isLoading={true} color={"#FF5757"} size={25} />
            </div>
          )
        ) : (
          <Map
            rescuerType={user?.rescuer_type}
            mapRef={mapRef}
            onLocatingChange={handleLocatingChange}
            navigating={navigating}
          />
        )}
      </div>

      {requestData && !locating && (
        <div
          className={`h-10 relative flex items-center justify-around ${
            navigating ? "bg-primary" : "bg-primary-medium"
          } rounded-t-2xl`}
        >
          <div
            onClick={() => setNavigating(!navigating)}
            className={`${
              navigating ? "bg-primary" : "bg-primary-medium"
            } rounded-full p-6 -translate-y-4 cursor-pointer`}
          >
            <FaLocationArrow className="text-white text-2xl" />
          </div>
        </div>
      )}

      {!requestData && (
        <div className="flex-none h-auto bg-background rounded-t-2xl p-4">
          <div className="flex items-center justify-center">
            <p className="text-primary-medium font-semibold text-xl text-center">
              You're not assigned to any request.
            </p>
          </div>
        </div>
      )}

      {requestData && (
        <div className="flex-none bg-background rounded-t-2xl p-4 transition-all duration-300 ease-in-out mt-4 max-w-4xl mx-auto">
          {/* Toggle Icon at the Top */}
          <div
            className="flex justify-center mb-2 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <FaChevronDown className="text-background-medium text-2xl" />
            ) : (
              <FaChevronUp className="text-background-medium text-2xl" />
            )}
          </div>

          {/* Main Information */}
          <div className="flex justify-between gap-6">
            <div className="flex flex-col gap-1 pb-2 mb-2">
              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <div className="text-primary-dark font-semibold text-2xl">
                    <p>
                      {
                        (
                          requestLocation?.address ||
                          requestData.location?.address
                        ).split(",")[0]
                      }
                    </p>
                  </div>
                  <div className="text-primary-medium text-lg">
                    <p>
                      {(
                        requestLocation?.address ||
                        requestData.location?.address
                      )
                        .split(",")
                        .slice(1, 5)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                {/* Phone Button */}
                {requestData.phone && (
                  <button
                    onClick={handlePhone}
                    className="p-3 h-max bg-primary rounded-full text-white shadow hover:bg-primary-dark transition"
                  >
                    <FaPhone className="text-3xl" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 md:flex-row">
                {/* Inline Name and Relation */}
                <div className="flex items-center gap-2 text-md font-semibold text-background-dark mt-2">
                  <p>{requestData.citizenName}</p>
                  <span>•</span>
                  <p>{requestData.citizenRelation || "No Relation"}</p>
                </div>

                <div className="flex-1 flex items-center mt-2 self-center gap-2 ">
                  <div
                    className={`text-sm font-semibold text-white py-3 px-6 rounded-full ${
                      requestData.status === "rescued"
                        ? "bg-green-500"
                        : "bg-highlight"
                    }`}
                  >
                    {requestData.status
                      ? requestData.status[0].toUpperCase() +
                        requestData.status.slice(1)
                      : ""}
                  </div>
                  {nextStatus && !locating && (
                    <>
                      <div className="flex items-center animate-pulse">
                        <FaChevronRight className="text-xs text-primary-medium" />
                        <FaChevronRight className="text-xs text-primary-medium" />
                      </div>
                      <button
                        style={{ minWidth: "6rem" }}
                        onClick={() => handleStatusChangeClick(nextStatus)}
                        className="text-sm text-gray-700 border border-gray-300 rounded-full px-6 py-3 opacity-70 cursor-pointer hover:bg-gray-100 transition-all"
                      >
                        {nextStatus.charAt(0).toUpperCase() +
                          nextStatus.slice(1)}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section - Slide down/up effect */}
          {showDetails && (
            <div className="mt-2 transition-opacity duration-300 ease-in-out opacity-100">
              <div className="flex flex-col gap-3">
                {/* Rescuer Remarks */}
                <div className="flex flex-col gap-3">
                  <div className=" rounded-lg w-full">
                    <label className="block font-bold text-primary-dark">
                      Rescuer Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full h-25 mt-2 border rounded-lg p-2 text-sm resize-none overflow-auto"
                      placeholder="Add your remarks here..."
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (requestID) {
                        try {
                          await addRescuerRemarksToFirestore(
                            requestID,
                            remarks
                          );
                          toast.success("Remarks updated successfully!");
                        } catch (err) {
                          toast.error("Failed to update remarks.");
                        }
                      }
                    }}
                    className="bg-primary font-bold text-white py-3 px-5 rounded-lg hover:bg-primary-dark transition text-sm"
                  >
                    Save Remarks
                  </button>
                </div>

                {/* Incident Header */}
                <h3 className="font-bold text-primary-dark mb-2">Incident</h3>

                {/* Image */}
                <img
                  src={
                    requestData.incidentPicture
                      ? requestData.incidentPicture
                      : placeholder
                  }
                  alt="Incident Picture"
                  className="w-full h-56 object-cover rounded-md shadow-sm"
                />

                {/* Description */}
                <div className="border rounded-lg p-4 w-full flex-1 overflow-y-auto">
                  {!requestData.incidentDescription ? (
                    <p className="text-base text-primary-dark">
                      No description provided.
                    </p>
                  ) : (
                    <p className="text-base text-primary-dark">
                      {requestData.incidentDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-4 rounded-2xl shadow-md max-w-xs w-full">
            <h2 className="text-md font-medium text-center mb-3">
              Confirm Status Change
            </h2>
            <p className="text-sm text-center mb-4">
              Are you sure you want to change the status to{" "}
              <span className="font-bold text-primary-medium">
                {statusToUpdate.charAt(0).toUpperCase() +
                  statusToUpdate.slice(1)}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmStatusChange}
                className="bg-primary text-white py-2 px-5 rounded-full hover:bg-primary-dark transition text-sm"
              >
                Confirm
              </button>
              <button
                onClick={cancelStatusChange}
                className="bg-gray-200 text-gray-600 py-2 px-5 rounded-full hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigate;
