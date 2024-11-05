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
  getRequestFromFirestore,
  updateRequestStatusInFirestore,
} from "../services/firestoreService";
import { Loader } from "../components";
import MobileDetect from "mobile-detect";
import { toast } from "react-toastify";
import { RescuerContext } from "../contexts/RescuerContext";
import placeholder from "../assets/placeholder.png";
import {
  getSelectedRequestCookie,
  deleteCookie,
} from "../services/cookieService";

const statuses = ["assigned", "in transit", "en route", "rescued"];

const Navigate = ({ requestID, setSelectedRequest }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [locating, setLocating] = useState(false);
  const [onMobile, setOnMobile] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [statusToUpdate, setStatusToUpdate] = useState(null); // State to hold the next status to update

  const { navigating, setNavigating } = useContext(RescuerContext);
  const mapRef = useRef();

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
    ``;
  };

  const confirmStatusChange = () => {
    if (
      statusToUpdate &&
      statuses.indexOf(statusToUpdate) > statuses.indexOf(requestData.status)
    ) {
      setRequestData((prevData) => ({ ...prevData, status: statusToUpdate }));
      updateRequestStatusInFirestore(requestID, statusToUpdate);
      if (statusToUpdate === "rescued") {
        deleteCookie("selected_request");
        setSelectedRequest(null);
        setRequestData(null);
      }
    }
    setShowModal(false); // Close modal after confirmation
  };

  const cancelStatusChange = () => {
    setShowModal(false); // Close modal without changing status
  };

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
              mapRef={mapRef}
              citizen={requestData.location}
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
          <div className="flex justify-between items-center md:gap-4">
            <div className="flex flex-col gap-1 pb-2 mb-2">
              <div className="text-primary-dark font-semibold text-2xl">
                <p>{requestData.location.address.split(",")[0]}</p>
              </div>
              <div className="text-primary-medium text-lg">
                <p>
                  {requestData.location.address
                    .split(",")
                    .slice(1, 5)
                    .join(", ")}
                </p>
              </div>

              {/* Inline Name and Relation */}
              <div className="flex items-center gap-2 text-md font-semibold text-background-dark mt-2">
                <p>{requestData.citizenName}</p>
                <span>•</span>
                <p>{requestData.citizenRelation || "No Relation"}</p>
              </div>
            </div>

            {/* Phone Button and Status Section */}
            <div className="flex flex-col items-end gap-2">
              {/* Phone Button */}
              {requestData.phone && (
                <button
                  onClick={handlePhone}
                  className="bg-primary p-3 rounded-full text-white shadow hover:bg-primary-dark transition"
                >
                  <FaPhone className="text-3xl" />
                </button>
              )}

              {/* Status and Next Status Section, Aligned to the Right */}
              <div className="flex items-center gap-2 mt-2 ">
                <div className="text-sm font-semibold text-white py-2 px-5 rounded-full bg-highlight">
                  {requestData.status
                    ? requestData.status[0].toUpperCase() +
                      requestData.status.slice(1)
                    : ""}
                </div>
                {nextStatus && !locating && (
                  <>
                    <div className="flex items-center animate-pulse">
                      <FaChevronRight className="text-primary-medium" />
                      <FaChevronRight className="text-primary-medium" />
                    </div>
                    <button
                      style={{ minWidth: "6rem" }}
                      onClick={() => handleStatusChangeClick(nextStatus)}
                      className="text-sm text-gray-700 border border-gray-300 rounded-full px-5 py-2 opacity-70 cursor-pointer hover:bg-gray-100 transition-all"
                    >
                      {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Details Section - Slide down/up effect */}
          {showDetails && (
            <div className="mt-2 transition-opacity duration-300 ease-in-out opacity-100">
              <div className="flex flex-col gap-3">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-center mb-4">
              Confirm Status Change
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to change the status to{" "}
              <span className="font-semibold">
                {statusToUpdate.charAt(0).toUpperCase() +
                  statusToUpdate.slice(1)}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmStatusChange}
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition"
              >
                Confirm
              </button>
              <button
                onClick={cancelStatusChange}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
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
