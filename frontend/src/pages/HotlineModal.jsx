import { useState, useEffect } from "react";
import { hotlines } from "../constants/Hotlines";
import { FaPhone, FaClipboard, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import MobileDetect from "mobile-detect";

const HotlineModal = ({ onClose }) => {
  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isMobile = !!md.mobile() && isSmallScreen;

    setOnMobile(isMobile);
  }, []);

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
    <div className="fixed inset-0 bg-black bg-opacity-60 p-8 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-4 text-orange-500 text-center">
            <FaPhone className="w-6 h-6 inline-block mr-2" />
            Emergency Hotlines
          </h2>
          <FaTimes
            onClick={onClose}
            className="text-xl self-start text-background-medium cursor-pointer"
          />
        </div>
        <div className="space-y-4">
          {Object.entries(hotlines).map(([location, services]) => (
            <details key={location} className="mb-4">
              <summary className="text-lg font-semibold text-primary-dark mb-3">
                {location}
              </summary>
              <ul className="space-y-3">
                {Object.entries(services).map(([service, number]) => (
                  <li
                    key={service}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition duration-200"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-primary-medium flex items-center">
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
                        <FaPhone className="w-5 h-5" />
                      </button>
                      {/* Copy button with Clipboard icon */}
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotlineModal;
