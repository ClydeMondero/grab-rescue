import { useState, useEffect } from "react";
import { Loader, RescuerMarker } from "../components";
import { FaLocationPin } from "react-icons/fa6";

const LocatingIndicator = ({ locating, type, rescuerType }) => {
  const [locatingMessage, setLocatingMessage] = useState("");

  const messages = [
    "We’re trying to locate you, please hold tight!",
    "Hang on! Finding your location...",
    "Getting your current position...",
    "Locating you, this may take a moment.",
    "Looking for your coordinates...",
    "Tip: Make sure your GPS is enabled for better accuracy.",
    "For the best results, keep Wi-Fi on and data enabled.",
    "Location taking longer than expected? Check your GPS settings.",
    "Tip: Some ad blockers may interfere with our location services. Try disabling them.",
  ];

  useEffect(() => {
    if (locating) {
      const changeMessage = () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setLocatingMessage(messages[randomIndex]);
      };

      // Set interval for changing message less frequently (every 10 seconds)
      const intervalId = setInterval(changeMessage, 10000);

      // Clean up the interval when the component unmounts or locating stops
      return () => clearInterval(intervalId);
    }
  }, [locating]);

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex-col items-center justify-center p-4 shadow-sm rounded-md bg-primary-medium">
            <div className="flex items-center justify-center gap-4 ">
              <span className="text-lg font-medium text-white">
                Locating you
              </span>
              <Loader
                isLoading={true}
                color={"white"}
                size={20}
                className="mb-4"
              />
            </div>
            <span className="text-white text-sm">{locatingMessage}</span>
          </div>
          {type == "citizen" ? (
            <FaLocationPin className="text-3xl text-secondary" />
          ) : (
            <RescuerMarker view="left-right" rescuerType={rescuerType} />
          )}
        </div>
      </div>
    </>
  );
};

export default LocatingIndicator;
