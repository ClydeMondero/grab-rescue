import { createContext, useState } from "react";

const RescuerContext = createContext();

const RescuerProvider = ({ children }) => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
  });

  return (
    <RescuerContext.Provider value={{ rescuer, setRescuer }}>
      {children}
    </RescuerContext.Provider>
  );
};

export { RescuerProvider, RescuerContext };