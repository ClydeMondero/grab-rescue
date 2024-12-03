import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Citizen,
  Login,
  Admin,
  Rescuer,
  NotFound,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  Policy,
  TermsOfService,
  RescuerTutorial,
  CitizenTutorial,
  Home,
  CitizenProfile,
} from "./pages";
import axios from "axios";
import { PrivateRoute, GeolocateButton, LocationPrompt } from "./components";
import { StatusProvider } from "./contexts/StatusContext";
import { RequestProvider } from "./contexts/RequestContext";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;

const App = () => {
  return (
    <StatusProvider>
      <RequestProvider>
        <Router>
          <GeolocateButton />
          <LocationPrompt />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/privacy-policy" element={<Policy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/citizen-tutorial" element={<CitizenTutorial />} />
            <Route path="/rescuer-tutorial" element={<RescuerTutorial />} />
            <Route
              path="/citizen/*"
              element={<PrivateRoute Component={Citizen} />}
            />
            <Route
              path="/admin/*"
              element={<PrivateRoute Component={Admin} />}
            />
            <Route
              path="/rescuer/*"
              element={<PrivateRoute Component={Rescuer} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </RequestProvider>
    </StatusProvider>
  );
};

export default App;
