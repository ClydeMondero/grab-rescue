import { Navigate } from "react-router-dom";
import { useAuthentication } from "../hooks";

const PrivateRoute = ({ Component }) => {
  const isAuthenticated = useAuthentication();

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
