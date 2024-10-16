import React, { useEffect, useState } from "react";
import { RescuerMap as Map } from "../components";
import { BiPhoneCall } from "react-icons/bi";
import { getRequestFromFirestore } from "../services/firestoreService";
const Navigate = ({ requestID }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [requestData, setRequestData] = useState(null);

  const getRequestData = async () => {
    if (requestID === null) return;
    const requestData = await getRequestFromFirestore(requestID);
    setRequestData(requestData);
    console.log("Request Data:", requestData);
  };

  useEffect(() => {
    getRequestData();
  }, []);

  const citizenDetails = {
    name: "John Doe",
    contact: "1234567890",
    location: "123 Main St",
    requestStatus: "Pending",
    photo: "https://via.placeholder.com/150",
    distance: "2 km",
    eta: "15 min",
    requestTime: "2:30 PM",
  };

  return (
    <div className="relative bg-gray-100 flex flex-col h-[calc(100vh-160px)]">
      {/* Full-screen map */}
      <div className="flex-1">
        <div className="w-full h-full rounded-md overflow-hidden border border-gray-300">
          <Map />
        </div>
      </div>

      {/* Citizen Information Section - Render only if requestData is available */}
      {requestData && (
        <div className="absolute bottom-0 w-full p-4 rounded-t-lg shadow-lg max-h-[250px] overflow-y-auto">
          {/* Floating Information */}
          <div className="absolute top-[-4px] left-0 right-0 flex justify-center space-x-4 text-xs">
            <p className="text-secondary">
              Distance: {citizenDetails.distance}
            </p>
            <p className="text-secondary">ETA: {citizenDetails.eta}</p>
            <p className="text-secondary">
              Request Time: {requestData.location.timestamp}
            </p>
          </div>

          {/* Main Info Section */}
          <div
            className="flex items-center justify-between cursor-pointer bg-background rounded-md p-2 shadow-md"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex flex-col flex-1">
              <h3 className="font-bold text-primary text-3xl">
                {citizenDetails.name}
              </h3>
              <p className="text-primary-dark">
                <strong className="text-primary">Location:</strong>{" "}
                {requestData.location.address}
              </p>
              <p className="text-primary-dark">
                <strong className="text-primary">
                  Request Status:&nbsp;
                  <strong
                    className={
                      {
                        pending: "text-warning",
                        available: "text-primary",
                        assigned: "text-orange-500",
                        intransit: "text-blue-500",
                        unavailable: "text-secondary",
                      }[requestData.status]
                    }
                  >
                    {requestData.status}
                  </strong>
                </strong>{" "}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Phone Call Button */}
              <button className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white text-2xl">
                <BiPhoneCall />
              </button>
            </div>
          </div>

          {/* Popup with Details */}
          {showDetails && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-md">
              <div className="mt-4 p-4 bg-white rounded-md border-b">
                <h4 className="font-bold text-primary text-xl">Details:</h4>
                <img
                  src={citizenDetails.photo}
                  alt="Citizen"
                  className="w-24 h-24 object-cover rounded-full mb-2"
                />
                <p>
                  <strong className="text-primary">Victim's Name:</strong>{" "}
                  {citizenDetails.name}
                </p>
                <p>
                  <strong className="text-primary">Contact:</strong>{" "}
                  {citizenDetails.contact}
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-transparent text-red-500 hover:bg-transparent transition-colors"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigate;
