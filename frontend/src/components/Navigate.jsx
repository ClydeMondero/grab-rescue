import React, { useEffect, useState, useRef } from "react";
import { RescuerMap as Map } from "../components";
import { BiPhoneCall } from "react-icons/bi";
import { getRequestFromFirestore } from "../services/firestoreService";
import { Loader } from "../components";

const Navigate = ({ requestID }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState(null);

  const mapRef = useRef();

  const getRequestData = async () => {
    if (requestID === null) return;

    const requestData = await getRequestFromFirestore(requestID);

    if (requestData) {
      setRequestData(requestData);
    }
  };

  useEffect(() => {
    getRequestData();
  }, [requestID]);

  return (
    <div className="relative flex flex-col h-full bg-background-light">
      {requestData ? (
        <div className="flex-1">
          <Map mapRef={mapRef} citizen={requestData.location} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Loader isLoading={true} size={30} color="#FF5757" />
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
              <button className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white text-2xl ">
                <BiPhoneCall />
              </button>
              <div
                className={`text-sm font-semibold text-white py-2 px-5 rounded-lg shadow-md ${
                  requestData.status === "assigned"
                    ? "bg-highlight"
                    : "bg-orange-400"
                }`}
              >
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
