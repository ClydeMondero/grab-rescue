import React, { useEffect, useState, useRef, useContext } from "react";
import { RescuerMap as Map } from "../components";
import {
  FaLocationArrow,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { getRequestFromFirestore } from "../services/firestoreService";
import { Loader } from "../components";
import MobileDetect from "mobile-detect";
import { toast } from "react-toastify";
import { RescuerContext } from "../contexts/RescuerContext";
import placeholder from "../assets/placeholder.png";

const Navigate = ({ requestID }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [locating, setLocating] = useState(false);
  const [onMobile, setOnMobile] = useState(false);

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

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isMobile = !!md.mobile() && isSmallScreen;
    setOnMobile(isMobile);
  }, []);

  return (
    <div className="relative flex flex-col h-full bg-background-light">
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
        <div className="flex-none h-auto bg-background rounded-t-2xl p-4 ">
          <div className="flex items-center justify-center">
            <p className="text-primary-medium font-semibold text-xl text-center">
              You're not assigned to any request.
            </p>
          </div>
        </div>
      )}

      {requestData && (
        <div
          className={`flex-none bg-background rounded-t-2xl p-4 transition-all duration-300 ease-in-out ${
            showDetails ? "h-[75%] overflow-hidden" : ""
          }`}
        >
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
          <div className="flex justify-between items-center cursor-pointer md:justify-center md:gap-4">
            <div className="flex flex-col gap-1 pb-2 mb-2">
              <div className="text-primary-dark font-semibold text-xl">
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
              <div className="flex items-center gap-2 text-md font-semibold text-background-dark mt-2">
                <p>{requestData.citizenName}</p>
                <span>•</span>
                <p>
                  {requestData.citizenRelation
                    ? requestData.citizenRelation
                    : "No Relation"}
                </p>
              </div>
            </div>

            {/* Phone and Status Section */}
            <div className="flex flex-col items-center justify-between gap-2">
              {requestData.phone && (
                <button
                  onClick={handlePhone}
                  className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white text-2xl cursor-pointer"
                >
                  <FaPhone />
                </button>
              )}
              <div
                className={`text-sm font-semibold text-white py-2 px-5 rounded-lg shadow-md ${
                  requestData.status === "assigned"
                    ? "bg-highlight"
                    : "bg-orange-400"
                }`}
              >
                {requestData.status
                  ? String(requestData.status[0]).toUpperCase() +
                    requestData.status.slice(1)
                  : ""}
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
    </div>
  );
};

export default Navigate;
