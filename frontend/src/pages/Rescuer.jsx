import React, { useState } from "react";
import {
  FaTasks,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCommentDots,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/authServices";

const Rescuer = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return (
          <p className="text-center text-gray-700">
            View and manage your assigned requests.
          </p>
        );
      case "navigate":
        return (
          <p className="text-center text-gray-700">
            Get directions to the rescue location.
          </p>
        );
      case "status":
        return (
          <p className="text-center text-gray-700">
            Update the status of your current rescue.
          </p>
        );
      case "complete":
        return (
          <p className="text-center text-gray-700">
            Mark the rescue as complete.
          </p>
        );
      case "feedback":
        return (
          <p className="text-center text-gray-700">
            Give feedback on the rescue operation.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#557C55] text-white flex items-center justify-between p-4">
        <div className="text-xl font-bold">
          <span className="text-[#A5CE97]">Rescuer</span> Logo
        </div>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center text-white"
          >
            <FaUserCircle className="text-2xl mr-2" />
            <span className="text-sm">Profile</span>
            <FaChevronDown className="text-xl ml-2" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white text-[#557C55] rounded-lg shadow-lg w-40">
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                My Profile
              </a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                Change Password
              </a>
              <a
                onClick={() => handleLogout(navigate)}
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Map Section */}
      <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
        <p className="text-center text-gray-700">Map Placeholder</p>
      </div>

      {/* Dashboard Content */}
      <div className="flex-grow p-4 bg-white">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="bg-[#557C55] text-white flex justify-around py-3">
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex flex-col items-center ${
            activeTab === "requests" ? "text-[#A5CE97]" : ""
          }`}
        >
          <FaTasks className="text-xl" />
          <span className="text-xs">Requests</span>
        </button>
        <button
          onClick={() => setActiveTab("navigate")}
          className={`flex flex-col items-center ${
            activeTab === "navigate" ? "text-[#A5CE97]" : ""
          }`}
        >
          <FaLocationArrow className="text-xl" />
          <span className="text-xs">Navigate</span>
        </button>
        <button
          onClick={() => setActiveTab("status")}
          className={`flex flex-col items-center ${
            activeTab === "status" ? "text-[#A5CE97]" : ""
          }`}
        >
          <FaMapMarkerAlt className="text-xl" />
          <span className="text-xs">Status</span>
        </button>
        <button
          onClick={() => setActiveTab("complete")}
          className={`flex flex-col items-center ${
            activeTab === "complete" ? "text-[#A5CE97]" : ""
          }`}
        >
          <FaCheckCircle className="text-xl" />
          <span className="text-xs">Complete</span>
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`flex flex-col items-center ${
            activeTab === "feedback" ? "text-[#A5CE97]" : ""
          }`}
        >
          <FaCommentDots className="text-xl" />
          <span className="text-xs">Feedback</span>
        </button>
      </div>
    </div>
  );
};

export default Rescuer;
