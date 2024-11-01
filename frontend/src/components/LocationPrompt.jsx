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
    <div className="fixed inset-0 bg-green-700 bg-opacity-80 flex items-center justify-center z-[100] fade-in">
      <div className="text-white flex flex-col items-center text-center p-10">
        <MdLocationOff className="text-8xl text-white mb-4" />
        <h2 className="text-4xl font-bold mb-4">
          Enable GPS for Full Experience
        </h2>
        <p className="text-lg mb-6">
          <span className="font-bold">
            This application requires GPS to function properly.
          </span>{" "}
          Please enable your GPS in device settings.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            className="w-full bg-white text-green-700 font-bold py-3 px-6 text-xl rounded-lg hover:bg-green-800 hover:text-white"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          <button
            className="mt-4 text-white underline"
            onClick={() => setLocationEnabled(true)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPrompt;
