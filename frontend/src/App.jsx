import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Login } from "./pages";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
