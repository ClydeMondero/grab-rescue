import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies, removeCookie] = useCookies([""]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!cookies.token) {
        setIsAuthenticated(false);
      }

      console.log(cookies.token);

      const { data } = await axios.post(
        "http://localhost:4000/",
        {},
        { withCredentials: true }
      );

      const { success, user } = data;

      //TODO: return user

      return success
        ? setIsAuthenticated(true)
        : (removeCookie("token"), setIsAuthenticated(false));
    };

    verifyToken();
  }, [cookies, removeCookie]);

  return { isAuthenticated };
};

export default useAuthentication;
