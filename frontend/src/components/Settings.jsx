import React from "react";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/authService";
const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 h-full">
      <div className="flex items-center mb-8 p-4 bg-white border-b-2 border-gray-200">
        <IoSettings className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
          Settings
        </h4>
      </div>
      <div className="p-6 sm:p-8 bg-white  flex flex-col space-y-6">
        <div className="flex items-center space-x-4 lg:justify-between">
          <p className="text-lg font-medium text-primary-medium">
            Log out your account:
          </p>
          <button
            onClick={() => handleLogout(navigate)}
            className="bg-secondary text-white text-base font-semibold py-2 px-6 rounded-full hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
