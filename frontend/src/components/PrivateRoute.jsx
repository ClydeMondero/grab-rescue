import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components";

const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const verifyToken = async () => {
    setLoading(true);

    // Add a natural delay to avoid multiple requests on fast refreshes
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      setIsAuthenticated(true);
      setUser(data.user);
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
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader isLoading={loading} color={"#557C55"} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Component user={user} />;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
