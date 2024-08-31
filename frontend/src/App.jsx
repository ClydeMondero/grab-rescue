import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./components";
import { Home, Login, Admin } from "./pages";

import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute />} />
      </Routes>
    </Router>
  );
};

export default App;
