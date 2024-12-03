import axios from "axios";
import { toast } from "react-toastify";
import { getCitizenCookie, getCookie } from "./cookieService";
import {
  updateLocationStatus,
  getIDFromLocation,
} from "../services/firestoreService";

/**
 * Verifies the token
 *
 * This function makes a POST request to the "/auth/" endpoint with the
 * credentials stored in the cookie. If the request is successful, it returns
 * the user ID.
 *
 * @return {Promise<number>} The user ID
 */
export const getIDFromCookie = async () => {
  const { data } = await axios.post("/auth/", {}, { withCredentials: true });

  if (!data.success) return null;

  const { id, account_type: role } = data.user;

  return { id, role };
};

/**
 * Logs out the user
 *
 * This function verifies the token, logs out the user, and then
 * navigates to the homepage.
 *
 * @param {Function} navigate The navigate function from react-router-dom
 * @return {void}
 */
export const handleLogout = async (navigate) => {
  const { id: userId, role } = await getIDFromCookie();

  console.log(userId);

  const { data } = await axios.post(
    "/auth/logout",
    {
      id: userId,
    },
    { withCredentials: true }
  );

  console.log(data);

  if (data.success) {
    if (role === "Citizen") {
      const citizenCookie = getCitizenCookie();

      if (citizenCookie) {
        const citizenId = await getIDFromLocation(citizenCookie);
        if (citizenId) await updateLocationStatus(citizenId, "offline");
      }

      window.location = "/";
      // navigate("/");
      return;
    } else {
      await updateLocationStatus(userId, "offline");

      window.location = "/";
      // navigate("/");
      return;
    }
  }
  toast.error(data.message);
};

/**
 * Creates an authorization header with a Bearer token
 *
 * This function is used to authenticate requests to the server.
 * It retrieves the token from the cookie and adds it to the
 * Authorization header of the request.
 *
 * @return {Object} An object with the Authorization header
 */
export const createAuthHeader = () => {
  const token = getCookie("token");

  if (!token) {
    console.warn("Token is missing or not set in cookies."); // Log if token is missing
    return {};
  }

  console.log("Retrieved token:", token); // Log token for debugging

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
