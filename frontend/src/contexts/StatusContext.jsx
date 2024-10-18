import { createContext, useState, useEffect, useRef } from "react";
import { getCitizenCookie, getUserCookie } from "../services/cookieService";
import { getIDFromCookie } from "../services/authService";
import {
  getIDFromLocation,
  updateLocationStatus,
} from "../services/firestoreService";

const StatusContext = createContext();

const StatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [id, setId] = useState(null);

  const timeoutRef = useRef(null);

  const getId = async () => {
    const userCookie = getUserCookie();
    if (userCookie) {
      const userId = await getIDFromCookie();
      setId(userId);
    } else {
      const citizenCookie = getCitizenCookie();

      if (citizenCookie) {
        const citizenId = await getIDFromLocation(citizenCookie);
        setId(citizenId);
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User is switching away from the app, mark as 'inactive'
        setIsOnline(false);
      } else {
        setIsOnline(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      // Clear timeout when coming back online
      updateLocationStatus(id, "online");
      clearTimeout(timeoutRef.current);
    } else {
      // Set timeout when going offline
      timeoutRef.current = setTimeout(() => {
        // Update Firestore status to 'offline' here
        updateLocationStatus(id, "offline");
      }, 300000);
    }

    return () => {
      // Clear timeout on component unmount
      clearTimeout(timeoutRef.current);
    };
  }, [isOnline]);

  return (
    <StatusContext.Provider value={{ isOnline, getId, id }}>
      {children}
    </StatusContext.Provider>
  );
};

export { StatusContext, StatusProvider };
