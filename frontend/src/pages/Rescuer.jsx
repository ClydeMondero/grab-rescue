import { useState } from "react";
import {
  FaTasks,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCommentDots,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { Routes, Route, useNavigate } from "react-router-dom";
import { handleLogout } from "../services/authService";
import { RescuerMap as Map } from "../components";
import Requests from "../components/Requests"; // Import the respective component
import Navigate from "../components/Navigate";
import Status from "../components/Status";
import Complete from "../components/Complete";
import Feedback from "../components/Feedback";
import Profile from "../components/Profile";
import ChangePassword from "../pages/ChangePassword";

const Rescuer = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#557C55] text-white flex items-center justify-between p-4">
        <div className="text-xl font-bold">
          <span className="text-[#A5CE97]">Rescuer</span> Logo
        </div>

        {/* Profile Section */}
        <div className="relative z-10">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center text-white"
          >
            <FaUserCircle className="text-2xl mr-2" />
            <span className="text-sm">Profile</span>
            <FaChevronDown className="text-xl ml-2" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white text-[#557C55] rounded-lg shadow-lg w-40 cursor-pointer">
              <a
                onClick={() => navigate("/rescuer/profile")}
                className="block px-4 py-2 hover:bg-gray-200"
              >
                My Profile
              </a>
              <a
                onClick={() => navigate("/rescuer/changePassword")}
                className="block px-4 py-2 hover:bg-gray-200"
              >
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
        <Map />
      </div>

      {/* Routes for Rescuer pages */}
      <div className="flex-grow p-4 bg-white">
        <Routes>
          <Route path="/requests" element={<Requests />} />
          <Route path="/navigate" element={<Navigate />} />
          <Route path="/status" element={<Status />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#557C55] text-white flex justify-around py-3">
        <button
          onClick={() => navigate("/rescuer/requests")}
          className={`flex flex-col items-center ${
            window.location.pathname === "/rescuer/requests"
              ? "text-[#A5CE97]"
              : ""
          }`}
        >
          <FaTasks className="text-xl" />
          <span className="text-xs">Requests</span>
        </button>
        <button
          onClick={() => navigate("/rescuer/navigate")}
          className={`flex flex-col items-center ${
            window.location.pathname === "/rescuer/navigate"
              ? "text-[#A5CE97]"
              : ""
          }`}
        >
          <FaLocationArrow className="text-xl" />
          <span className="text-xs">Navigate</span>
        </button>
        <button
          onClick={() => navigate("/rescuer/status")}
          className={`flex flex-col items-center ${
            window.location.pathname === "/rescuer/status"
              ? "text-[#A5CE97]"
              : ""
          }`}
        >
          <FaMapMarkerAlt className="text-xl" />
          <span className="text-xs">Status</span>
        </button>
        <button
          onClick={() => navigate("/rescuer/complete")}
          className={`flex flex-col items-center ${
            window.location.pathname === "/rescuer/complete"
              ? "text-[#A5CE97]"
              : ""
          }`}
        >
          <FaCheckCircle className="text-xl" />
          <span className="text-xs">Complete</span>
        </button>
        <button
          onClick={() => navigate("/rescuer/feedback")}
          className={`flex flex-col items-center ${
            window.location.pathname === "/rescuer/feedback"
              ? "text-[#A5CE97]"
              : ""
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
