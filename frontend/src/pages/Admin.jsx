import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AddRescuer from '../components/AddRescuer';
import IncomingRequests from '../components/IncomingRequests';
import Rescuers from '../components/Rescuers';  
import OngoingRescues from '../components/OngoingRescues';  
import GenerateReports from '../components/GenerateReports';  
import Settings from '../components/Settings';  
import ViewProfile from '../components/ViewProfile';  
import ChangePassword from '../components/ChangePassword';  

const Admin = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
        <Route path="/addRescuer" element={<AddRescuer />} />
          <Route path="/incomingRequests" element={<IncomingRequests />} />
          <Route path="/rescuers" element={<Rescuers />} />
          <Route path="/ongoingRescues" element={<OngoingRescues />} />
          <Route path="/generateReports" element={<GenerateReports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/viewProfile" element={<ViewProfile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
