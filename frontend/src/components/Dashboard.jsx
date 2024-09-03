import React, { useState } from "react";
import {
  FaTasks,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCommentDots,
} from "react-icons/fa";
const Dashboard = () => {
  return (
    <div>
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

export default Dashboard;
