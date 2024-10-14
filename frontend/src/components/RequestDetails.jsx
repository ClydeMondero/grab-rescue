import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { RescuerMap as Map } from "../components";

const RequestDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main container */}
      <div className="max-w-6xl w-full mx-auto bg-white rounded-md flex-1 overflow-y-auto h-[calc(100vh-160px)]">
        {/* Header Section */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b">
          <h1 className="text-xl md:text-3xl font-bold text-[#557C55]">
            Request Details #{id}
          </h1>
          <button
            className="flex items-center bg-[#557C55] text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {/* Request Time */}
        <p className="text-sm text-gray-600 mb-4 px-4 md:px-6">
          <strong className="text-[#557C55]">Requested at:</strong> 12:45 PM
        </p>

        {/* Map Section */}
        <div className="mb-6 px-4 md:px-6">
          <h2 className="text-lg font-semibold text-[#557C55] mb-2">
            Location Map
          </h2>
          <div className="w-full h-40 md:h-64 rounded-md overflow-hidden border border-gray-300">
            <Map />
          </div>
        </div>

        {/* Citizen Information Section */}
        <div className="mb-6 px-4 md:px-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-[#557C55] mb-4">
            Citizen Information
          </h2>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-[#557C55]">Name:</strong> John Doe
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-[#557C55]">Location:</strong> San
            Rafael, Bulacan
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-[#557C55]">Rescue Status:</strong>
            <span className="ml-2 font-semibold text-orange-500">Pending</span>
          </p>
          <p className="text-sm text-gray-600 mt-4">
            <strong className="font-bold text-[#557C55]">Description:</strong>
            <span className="ml-2">
              The victim is in need of immediate assistance due to an emergency
              situation.
            </span>
          </p>
        </div>

        {/* Victim Information Section */}
        <div className="mb-6 px-4 md:px-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-[#557C55] mb-4">
            Victim Information
          </h2>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-[#557C55]">Name:</strong> Jane Doe
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-[#557C55]">Age:</strong> 25
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-[#557C55]">Sex:</strong> Female
          </p>
          <img
            src="https://picsum.photos/400"
            alt="Example victim"
            className="w-full h-40 md:h-60 rounded-md mt-4 object-cover"
            style={{ backgroundColor: "#557C55" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
