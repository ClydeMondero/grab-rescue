import React, { useState } from "react";
import { RescuerMap as Map } from "../components";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";

const Navigate = () => {
  const [showDetails, setShowDetails] = useState(false);

  const citizenDetails = {
    name: "John Doe",
    location: "123 Main St",
    requestStatus: "Pending",
    photo: "https://via.placeholder.com/150",
    age: 30,
    gender: "Male",
    description: "Need immediate assistance due to a medical emergency.",
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

      {/* Citizen Information Section */}
      <div className="absolute bottom-0 w-full p-4 bg-white rounded-t-lg shadow-lg max-h-[250px] overflow-y-auto">
        {/* Floating Information */}
        <div className="absolute top-[-60px] left-0 right-0 flex justify-center space-x-4">
          <p className="text-gray-600">Distance: {citizenDetails.distance}</p>
          <p className="text-gray-600">ETA: {citizenDetails.eta}</p>
          <p className="text-gray-600">
            Request Time: {citizenDetails.requestTime}
          </p>
        </div>

        {/* Main Info Section */}
        <div className="flex items-center justify-between cursor-pointer border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col flex-1">
            <h3 className="font-bold text-[#557C55] text-3xl">
              {citizenDetails.name}
            </h3>
            <p className="text-gray-600">
              <strong className="text-[#557C55]">Location:</strong>{" "}
              {citizenDetails.location}
            </p>
            <p className="text-gray-600">
              <strong className="text-[#557C55]">Status:</strong>{" "}
              <span
                className={
                  citizenDetails.requestStatus === "Pending"
                    ? "text-yellow-500"
                    : citizenDetails.requestStatus === "In Progress"
                    ? "text-orange-500"
                    : "text-green-500"
                }
              >
                {citizenDetails.requestStatus}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Phone Call Button */}
            <button className="flex items-center justify-center w-12 h-12 bg-[#557C55] rounded-full text-white text-2xl">
              <BiPhoneCall />
            </button>
            {/* Toggle Details Button */}
            <button
              className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 bg-transparent text-gray-500 rounded-full hover:bg-transparent transition-colors"
              onClick={() => setShowDetails(!showDetails)} // Toggle details
            >
              {showDetails ? (
                <AiFillEyeInvisible className="text-2xl text-[#557C55]" />
              ) : (
                <AiFillEye className="text-2xl text-[#557C55]" />
              )}
            </button>
          </div>
        </div>

        {/* Popup with Details */}
        {showDetails && (
          <div className="mt-4 p-4 bg-white border border-gray-300 rounded-md">
            <h4 className="font-bold text-[#557C55]">Details:</h4>
            <img
              src={citizenDetails.photo}
              alt="Citizen"
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
            <p>
              <strong className="text-[#557C55]">Victim's Name:</strong>{" "}
              {citizenDetails.name}
            </p>
            <p>
              <strong className="text-[#557C55]">Age:</strong>{" "}
              {citizenDetails.age}
            </p>
            <p>
              <strong className="text-[#557C55]">Gender:</strong>{" "}
              {citizenDetails.gender}
            </p>
            <p>
              <strong className="text-[#557C55]">Description:</strong>{" "}
              {citizenDetails.description}
            </p>
            <button
              className="mt-2 px-4 py-2 bg-transparent text-red-500 hover:bg-transparent transition-colors"
              onClick={() => setShowDetails(false)} // Close details
            ></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigate;
