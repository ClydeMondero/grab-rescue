import { useState, useEffect } from "react";

export const useLocating = (onLocatingChange, geoControlRef) => {
  const [watchState, setWatchState] = useState("OFF");

  const [locating, setLocating] = useState(true);

  const handleWatchState = (watchState) => {
    switch (watchState) {
      case "OFF":
      case "ACTIVE_ERROR":
      case "WAITING_ACTIVE":
      case "BACKGROUND_ERROR":
        setLocating(true);

        break;
      case "ACTIVE_LOCK":
      case "BACKGROUND":
        setLocating(false);
        break;
      default:
        console.log("Unknown watch state:", watchState);
    }
  };

  useEffect(() => {
    handleWatchState(watchState);
  }, [watchState]);

  useEffect(() => {
    const checkWatchState = () => {
      if (geoControlRef.current && geoControlRef.current._watchState) {
        setWatchState(geoControlRef.current._watchState);
      }
    };

    const interval = setInterval(checkWatchState, 1000); // Check every second

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [geoControlRef.current, watchState]);

  useEffect(() => {
    if (onLocatingChange) {
      onLocatingChange(locating);
    }
  }, [locating]);

  return locating;
};
