import Sidebar from "../components/Sidebar";
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Admin = () => {
  return (
    <BrowserRouter>
      <div className='d-flex'>
        <div className="col-auto vh-100">
          <Sidebar />
        </div>
        <div className="col vh-100">
          <Routes>
            <Route path="/" element={<IncomingRequest />} />
            <Route path="/assign_rescuer" element={<AssignRescuer />} />
            <Route path="/ongoing_rescues" element={<OnGoingRescues />} />
            <Route path="/generate_reports" element={<GenerateReports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Admin;

function IncomingRequest() {
  return <div>Incoming Request</div>;
}

function AssignRescuer() {
  return <div>Assign Rescuer</div>;
}

function OnGoingRescues() {
  return <div>On-going Rescues</div>;
}

function GenerateReports() {
  return <div>Generate Reports</div>;
}

function Settings() {
  return <div>Settings</div>;
}

function Logout() {
  return <div>Logging out...</div>;
}
