import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const LocationPrompt = () => {
  const [locationEnabled, setLocationEnabled] = useState(null);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocationEnabled(true);
        },
        (error) => {
          setLocationEnabled(false);
        }
      );
    } else {
      setLocationEnabled(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (locationEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="location-prompt bg-white rounded-lg p-6 w-11/12 sm:w-1/2 lg:w-1/3 relative">
        <p className="text-lg font-semibold text-primary-dark leading-relaxed">
          To use this application, please enable GPS in your device settings and
          ensure location access is allowed.
        </p>
      </div>
    </div>
  );
};

export default LocationPrompt;
