import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setGeolocateIcon } from "../utils/GeolocateUtility";

const GeolocateButton = () => {
  const location = useLocation();

  useEffect(() => {
    // Add a delay to ensure the icons are rendered by Mapbox
    const timeoutId = setTimeout(setGeolocateIcon(location), 100); // 100ms delay

    return () => clearTimeout(timeoutId); // Cleanup
  }, []);

  useEffect(() => {
    // Add a delay to ensure the icons are rendered by Mapbox
    const timeoutId = setTimeout(setGeolocateIcon(location), 100); // 100ms delay

    return () => clearTimeout(timeoutId); // Cleanup
  }, [location]);

  return null;
};

export default GeolocateButton;
