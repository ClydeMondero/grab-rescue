import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //TODO: add role verification

  const verifyToken = async () => {
    setLoading(true);

    const { data } = await axios.post("/auth/", {}, { withCredentials: true });
    console.log("Response from server:", data);

    if (data.success) {
      console.log("Token is valid, setting isAuthenticated to true");
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      console.log("Token is invalid, setting isAuthenticated to false");
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("isAuthenticated changed:", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    verifyToken();
  }, []);

  if (loading) {
    //TODO: add loading indicator
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
