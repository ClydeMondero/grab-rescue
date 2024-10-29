import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdLocationOff } from "react-icons/md";

const LocationPrompt = () => {
  const [locationEnabled, setLocationEnabled] = useState(null);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Location access granted
          setLocationEnabled(true);
        },
        () => {
          // Location access denied or not available
          setLocationEnabled(false);
        }
      );
    } else {
      setLocationEnabled(false);
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Function to watch position for continuous checking
  const watchLocation = () => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        () => {
          setLocationEnabled(true);
        },
        () => {
          setLocationEnabled(false);
        }
      );

      // Cleanup function to clear watch
      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  // Initial request for location on component mount
  useEffect(() => {
    requestLocation();

    // Set up a timer to periodically check location
    const intervalId = setInterval(requestLocation, 3000); // Check every 10 seconds

    // Set up a watch for continuous location tracking
    const cleanupWatch = watchLocation();

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      cleanupWatch && cleanupWatch();
    };
  }, []);

  if (locationEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] fade-in">
      <div className="location-prompt bg-white rounded-lg p-6 w-11/12 sm:w-2/3 lg:w-1/3 relative">
        <div className="flex items-center justify-center mb-2">
          <h2 className="text-2xl font-bold text-primary-dark">
            <div className="flex items-center justify-center">
              <MdLocationOff className="text-5xl text-primary-medium mr-2 -mt-1 mb-2" />
            </div>
            Enable GPS for Full Experience
          </h2>
        </div>
        <p className="mb-2">
          <span className="text-sm font-bold text-error">
            This application requires GPS to function properly.
          </span>{" "}
          Please enable your GPS in device settings.
        </p>
        <button
          className="w-full bg-white border-2 hover:bg-highlight hover:text-white text-blue-500 font-bold py-2 px-4 rounded mt-4 mr-2  border-blue-500"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
        <button
          className="absolute top-2 right-2 text-background-medium"
          onClick={() => setLocationEnabled(true)}
        >
          <FaTimes className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default LocationPrompt;
