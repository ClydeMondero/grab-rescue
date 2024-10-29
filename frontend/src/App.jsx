import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Admin,
  Rescuer,
  NotFound,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
} from "./pages";
import axios from "axios";
import { PrivateRoute, GeolocateButton, LocationPrompt } from "./components";
import { StatusProvider } from "./contexts/StatusContext";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;

const App = () => {
  return (
    <StatusProvider>
      <Router>
        <GeolocateButton />
        <LocationPrompt />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Email Verification Route */}
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/admin/*" element={<PrivateRoute Component={Admin} />} />
          <Route
            path="/rescuer/*"
            element={<PrivateRoute Component={Rescuer} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </StatusProvider>
  );
};

export default App;
