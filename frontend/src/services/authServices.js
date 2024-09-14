import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "./CookieHandler";

export const verifyToken = async () => {
  const { data } = await axios.post("/auth/", {}, { withCredentials: true });

  const userId = data.user.id;

  return userId;
};

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

//to access every private routes
export const createAuthHeader = () => {
  return {
    headers: {
      Authorization: "Bearer " + getCookie("token"),
    },
  };
};
