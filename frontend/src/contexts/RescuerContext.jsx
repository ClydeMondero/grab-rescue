import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

const RescuerContext = createContext();

const RescuerProvider = ({ children }) => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
    pitch: 0,
    bearing: 0,
  });

  const location = useLocation();

  const [page, setPage] = useState(() => {
    if (location.pathname === "/rescuer/requests") {
      return "Requests";
    } else if (location.pathname === "/rescuer/navigate") {
      return "Navigate";
    } else if (location.pathname === "/rescuer/profile") {
      return "Profile";
    } else if (location.pathname === "/rescuer/change-password") {
      return "Change Password";
    } else if (location.pathname === "/rescuer/change-email") {
      return "Change Email";
    }
  });

  return (
    <RescuerContext.Provider value={{ rescuer, setRescuer, page, setPage }}>
      {children}
    </RescuerContext.Provider>
  );
};

export { RescuerProvider, RescuerContext };
