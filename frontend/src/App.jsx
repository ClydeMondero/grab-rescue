import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Login, Admin, Rescuer, NotFound } from "./pages";
import axios from "axios";
import { PrivateRoute } from "./components";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<PrivateRoute Component={Admin} />} />
        <Route
          path="/rescuer/*"
          element={<PrivateRoute Component={Rescuer} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
