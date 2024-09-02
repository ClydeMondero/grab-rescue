import { Navigate } from "react-router-dom";
import { useAuthentication } from "../hooks";

const PrivateRoute = ({ Component }) => {
  const isAuthenticated = useAuthentication();

  console.log(isAuthenticated);

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
