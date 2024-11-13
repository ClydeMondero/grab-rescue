import { createContext, useState, useEffect } from "react";
import {
  getCitizenCookie,
  getStatusCookie,
  getUserCookie,
  setStatusCookie,
} from "../services/cookieService";
import { getIDFromCookie } from "../services/authService";
import {
  getIDFromLocation,
  updateLocationStatus,
} from "../services/firestoreService";

const StatusContext = createContext();

const StatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [id, setId] = useState(null);

  const getId = async () => {
    const userId = await getIDFromCookie();

    if (userId) {
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
      const onlineStatus = !document.hidden;
      setIsOnline(onlineStatus);
    };

    const handleBeforeUnload = (ev) => {
      if (id) {
        setStatusCookie("offline");
        updateLocationStatus(id, "offline");
      }
      ev.returnValue = "Changes you made may not be saved.";
    };

    const handleActivity = () => {
      setIsOnline(true);
      setStatusCookie("online");
      if (id) updateLocationStatus(id, "online");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (window.location.pathname !== "/login") {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("touchstart", handleActivity);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
    };
  }, [id]);

  useEffect(() => {
    const statusCookie = getStatusCookie();

    if (!isOnline) {
      if (!statusCookie || statusCookie === "online") {
        setStatusCookie("offline");
        if (id) {
          updateLocationStatus(id, "offline");
        }
      }
    } else {
      if (!statusCookie || statusCookie === "offline") {
        setStatusCookie("online");
        if (id) {
          updateLocationStatus(id, "online");
        }
      }
    }
  }, [isOnline, id]);

  return (
    <StatusContext.Provider value={{ isOnline, getId, id: id || undefined }}>
      {children}
    </StatusContext.Provider>
  );
};

export { StatusContext, StatusProvider };
