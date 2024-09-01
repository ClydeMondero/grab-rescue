import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [cookies, removeCookie] = useCookies([""]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!cookies.token) {
        setIsAuthenticated(false);
      }

      const { data } = await axios.post(
        "http://localhost:4000/auth",
        {},
        { withCredentials: true }
      );

      const { success, user } = data;

      //TODO: return user
      const role = user.account_type;

      return success
        ? (setRole(role), setIsAuthenticated(true))
        : (removeCookie("token"), setIsAuthenticated(false));
    };

    verifyToken();
  }, [cookies, removeCookie]);

  return { isAuthenticated };
};

export default useAuthentication;
