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
  Policy,
  TermsOfService,
  Download,
  About,
  RescuerTutorial,
  AdminTutorial,
  CitizenTutorial,
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
            {/* Email Verification Route */}
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route
              path="/admin/*"
              element={<PrivateRoute Component={Admin} />}
            />
            <Route path="/privacy-policy" element={<Policy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/download" element={<Download />} />
            <Route path="/about" element={<About />} />
            <Route path="/citizen-tutorial" element={<CitizenTutorial />} />
            <Route path="/rescuer-tutorial" element={<RescuerTutorial />} />
            <Route path="/admin-tutorial" element={<AdminTutorial />} />
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
