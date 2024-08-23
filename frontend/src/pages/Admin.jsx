import Sidebar from "../components/Sidebar";
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncomingRequests from '../components/IncomingRequests';
import AssignRescuers from '../components/AssignRescuers';
import OngoingRescues from '../components/OngoingRescues';
import GenerateReports from '../components/GenerateReports';
import Settings from '../components/Settings';
import ChangePassword from '../components/ChangePassword';
import ViewProfile from '../components/ViewProfile';

const Admin = () => {
  return (
    <BrowserRouter>
      <div className='d-flex'>
        <div className="col-auto vh-100">
          <Sidebar />
        </div>
        <div className="col vh-100">
          <Routes>
            <Route path="/" element={<IncomingRequests />} />
            <Route path="/assign_rescuer" element={<AssignRescuers />} />
            <Route path="/ongoing_rescues" element={<OngoingRescues />} />
            <Route path="/generate_reports" element={<GenerateReports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/view_profile" element={<ViewProfile />} />
            <Route path="/change_password" element={<ChangePassword />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Admin;
