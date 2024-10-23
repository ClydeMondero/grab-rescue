import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

const RescuerContext = createContext();

const RescuerProvider = ({ children }) => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
  });

  const location = useLocation();

  const [page, setPage] = useState(() => {
    if (location.pathname === "/rescuer/requests") {
      return "requests";
    } else if (location.pathname === "/rescuer/navigate") {
      return "navigate";
    }
  });

  return (
    <RescuerContext.Provider value={{ rescuer, setRescuer, page, setPage }}>
      {children}
    </RescuerContext.Provider>
  );
};

export { RescuerProvider, RescuerContext };
