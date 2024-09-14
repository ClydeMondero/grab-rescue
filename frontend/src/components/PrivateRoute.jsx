import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyToken = async () => {
    setLoading(true);

    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {}, [isAuthenticated]);

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
