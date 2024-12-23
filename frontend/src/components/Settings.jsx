import React, { useState } from "react";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/authService";
import { FaSignOutAlt } from "react-icons/fa";
import { ThemeToggle, FontSelector, Loader } from "../components";

const Settings = ({ fontClass, onFontChange }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className={`flex-1 p-4 sm:p-6 lg:p-8 h-full bg-background dark:bg-dark-background ${fontClass}`}
    >
      <div className="flex items-center mb-8 p-4 bg-white dark:bg-dark-background-light border-b-2 border-gray-200 dark:border-dark-border">
        <IoSettings className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark dark:text-dark-primary mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark dark:text-dark-primary font-bold">
          Settings
        </h4>
      </div>
      <div className="bg-white dark:bg-dark-background flex flex-col space-y-4">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-dark-background-light rounded-md p-4 flex flex-col space-y-2">
          <div className="flex justify-between items-center p-6 border rounded-md bg-white dark:bg-dark-background-light transition">
            <p className="text-lg font-bold text-background-medium dark:text-dark-text-secondary">
              Toggle Dark/Light Theme (Coming Soon)
            </p>
            <ThemeToggle isDisabled />
          </div>
        </div>

        {/* Font Selector */}
        <div className="bg-white dark:bg-dark-background-light rounded-md p-4 flex flex-col space-y-2">
          <div className="flex flex-col p-6 border rounded-md bg-white hover:bg-background-light  dark:bg-dark-background-light transition">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-primary-medium dark:text-dark-text-secondary">
                Change Font
              </p>
              <FontSelector onFontChange={onFontChange} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white dark:bg-dark-background-light rounded-md p-4 flex flex-col space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border rounded-md bg-white dark:bg-dark-background-light hover:bg-background-light dark:hover:bg-dark-background-medium transition">
            <p className="text-lg font-bold text-primary-medium dark:text-dark-text-secondary">
              Log out of your account
            </p>
            <button
              onClick={() => {
                setIsLoading(true);
                handleLogout(navigate);
              }}
              className="bg-secondary dark:bg-dark-secondary text-white text-base font-bold py-2 px-6 rounded-full hover:bg-red-600 dark:hover:bg-dark-secondary transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-dark-shadow"
            >
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <Loader isLoading={isLoading} size={25} />
                ) : (
                  <>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
