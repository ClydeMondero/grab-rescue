import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFaceDizzy } from "react-icons/fa6";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center flex flex-col items-center">
        <p className="flex items-center justify-center">
          <span className="text-9xl font-bold text-background-dark">4</span>
          <FaFaceDizzy className="text-8xl text-background-dark mx-4" />
          <span className="text-9xl font-bold text-background-dark">4</span>
        </p>
        <p className="text-3xl font-semibold text-text-secondary mt-4">
          Page Not Found
        </p>
        <p className="text-lg text-text-primary mt-2">
          The page you are looking for does not exist or has been removed.
        </p>
        <button
          className="bg-primary text-white font-semibold py-4 px-6 rounded-md hover:opacity-80 mt-4"
          onClick={handleClick}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
