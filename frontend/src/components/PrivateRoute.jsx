import { Navigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";

const PrivateRoute = ({ Component }) => {
  const { isAuthenticated } = useAuthentication();

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
