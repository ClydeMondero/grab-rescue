import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFaceDizzy } from "react-icons/fa6";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center flex flex-col items-center">
        <p className="flex items-center justify-center">
          <span className="text-9xl font-bold text-gray-600">4</span>
          <FaFaceDizzy className="text-8xl text-gray-600 mx-4" />
          <span className="text-9xl font-bold text-gray-600">4</span>
        </p>
        <p className="text-3xl font-semibold text-gray-600 mt-4">
          Page Not Found
        </p>
        <p className="text-lg text-gray-600 mt-2">
          The page you are looking for does not exist or has been removed.
        </p>
        <button
          className="bg-[#557C55] text-white py-2 px-4 rounded hover:bg-[#6EA46E] transition-all mt-4"
          onClick={handleClick}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
