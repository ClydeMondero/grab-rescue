import React, { useEffect, useState, useRef } from "react";
import { RescuerMap as Map, Toast } from "../components";
import { BiPhoneCall } from "react-icons/bi";
import { FaLocationArrow, FaCheck } from "react-icons/fa";
import { getRequestFromFirestore } from "../services/firestoreService";
import { Loader } from "../components";
import { useLocating } from "../hooks";
import MobileDetect from "mobile-detect";
import { toast } from "react-toastify";

const Navigate = ({ requestID }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [locating, setLocating] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [onMobile, setOnMobile] = useState(false);

  const mapRef = useRef();

  const handleLocatingChange = (newLocatingState) => {
    setLocating(newLocatingState); // Update only when locating changes
  };

  const getRequestData = async () => {
    if (requestID === null) return;

    const requestData = await getRequestFromFirestore(requestID);

    if (requestData) {
      setRequestData(requestData);
    }
  };

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
    getRequestData();
  }, [requestID]);

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);

    const isSmallScreen = window.innerWidth <= 768; // Customize width threshold
    const isMobile = !!md.mobile() && isSmallScreen; // Refine detection with screen size

    setOnMobile(isMobile);
  }, []);

  return (
    <div className="relative flex flex-col h-full bg-background-light">
      {requestData ? (
        <div className="flex-1">
          <Map
            mapRef={mapRef}
            citizen={requestData.location}
            onLocatingChange={handleLocatingChange}
            navigating={navigating}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Loader isLoading={true} size={30} color="#FF5757" />
        </div>
      )}

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

      {requestData && (
        <div className="flex-none h-auto bg-background rounded-t-2xl p-4 shadow-lg border-x-background-medium border-t-2">
          <div
            className="flex justify-between items-center cursor-pointer md:justify-center md:gap-6"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex flex-col">
              <p className="text-primary-dark font-semibold text-xl">
                {requestData.location.address.split(",")[0]}
              </p>
              <p className="text-primary-medium font-semibold text-xl">
                {requestData.location.address.split(",").slice(1, 5).join(", ")}
              </p>
              <p className="text-md font-semibold text-background-dark">
                {requestData.citizenName} •{" "}
                {requestData.citizenRelation
                  ? requestData.citizenRelation
                  : "No Relation"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-between gap-2">
              {/* Phone Call Button */}

              {requestData.phone && (
                <button
                  onClick={handlePhone}
                  className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white text-2xl cursor-pointer"
                >
                  <BiPhoneCall />
                </button>
              )}
              <div
                className={`text-sm font-semibold text-white py-2 px-5 rounded-lg shadow-md ${
                  requestData.status === "assigned"
                    ? "bg-highlight"
                    : "bg-orange-400"
                }`}
              >
                {/*TODO: change status to in-progress if isOnRoute*/}
                {requestData.status.charAt(0).toUpperCase() +
                  requestData.status.slice(1)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigate;
