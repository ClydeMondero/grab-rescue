import React from "react";
import { hotlines } from "../constants/Hotlines";
import { FaPhone, FaClipboard } from "react-icons/fa";
import { toast } from "react-toastify";

const HotlineModal = ({ onClose, onMobile }) => {
  // Handle call or copy phone number based on platform
  const handlePhoneAction = (phoneNumber) => {
    if (onMobile) {
      window.location.href = `tel:${phoneNumber}`; // Mobile: dial the number
    } else {
      navigator.clipboard
        .writeText(phoneNumber) // Desktop: copy number to clipboard
        .then(() => {
          toast.info("Phone number copied to clipboard");
        })
        .catch((err) => {
          toast.info("Failed to copy phone number");
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-orange-500 text-center">
          <FaPhone className="w-6 h-6 inline-block mr-2" />
          Emergency Hotlines
        </h2>
        <div className="space-y-4">
          {Object.entries(hotlines).map(([location, services]) => (
            <div key={location}>
              <h3 className="text-lg font-semibold text-primary-dark mb-3">
                {location}
              </h3>
              <ul className="space-y-3">
                {Object.entries(services).map(([service, number]) => (
                  <li
                    key={service}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition duration-200"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-primary-medium">
                        {service}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Display phone number */}
                      <span className="ml-2 text-primary-dark font-medium">
                        {number}
                      </span>
                      {/* Call button with Phone icon */}
                      <button
                        onClick={() => handlePhoneAction(number)}
                        className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition"
                        title="Call"
                      >
                        <PhoneIcon className="w-5 h-5" />
                      </button>
                      {/* Copy button with Clipboard icon */}
                      <button
                        onClick={() => handlePhoneAction(number)}
                        className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition"
                        title="Copy to clipboard"
                      >
                        <FaClipboard className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-secondary text-white font-bold py-2 px-6 rounded-full hover:bg-red-500 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotlineModal;
