import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "./cookieService";

/**
 * Verifies the token
 *
 * This function makes a POST request to the "/auth/" endpoint with the
 * credentials stored in the cookie. If the request is successful, it returns
 * the user ID.
 *
 * @return {Promise<number>} The user ID
 */
export const verifyToken = async () => {
  const { data } = await axios.post("/auth/", {}, { withCredentials: true });

  const userId = data.user.id;

  return userId;
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
  const userId = await verifyToken();

  const { data } = await axios.post(
    "/auth/logout",
    {
      id: userId,
    },
    { withCredentials: true }
  );

  if (data.success) {
    navigate("/");
    return;
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

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
