import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Importing icon for back button
import { RescuerMap as Map } from "../components";

const RequestDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Request Details
          </h1>
          <button
            className="flex items-center bg-[#557C55] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {/* Request Time */}
        <p className="text-sm text-gray-600 mb-4 p-6">
          <strong className="text-gray-700">Requested at:</strong> 12:45 PM
        </p>

        {/* Map Section */}
        <div className="mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Location Map
          </h2>
          <div className="w-full h-64 rounded-md overflow-hidden">
            <Map />
          </div>
        </div>

        {/* Citizen Information Section */}
        <div className="mb-6 p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Citizen Information
          </h2>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-gray-700">Name:</strong> John Doe
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-gray-700">Location:</strong> San
            Rafael, Bulacan
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-gray-700">Rescue Status:</strong>{" "}
            Pending
          </p>
          <p className="text-sm text-gray-600 mt-4">
            <strong className="font-bold text-gray-700">Description:</strong>
            <span className="ml-2">
              The victim is in need of immediate assistance due to an emergency
              situation.
            </span>
          </p>
        </div>

        {/* Victim Information Section */}
        <div className="mb-6 p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Victim Information
          </h2>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-gray-700">Name:</strong> Jane Doe
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-gray-700">Age:</strong> 25
          </p>
          <p className="text-sm text-gray-600">
            <strong className="font-bold text-gray-700">Sex:</strong> Female
          </p>
          <img
            src="https://picsum.photos/400"
            alt="Example victim"
            className="w-full h-60 rounded-md mt-4 object-cover"
            style={{ backgroundColor: "#557C55" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
