import { Routes, Route } from "react-router-dom";
import {
  Sidebar,
  AddRescuer,
  IncomingRequests,
  Rescuers,
  OngoingRescues,
  GenerateReports,
  Settings,
  ViewProfile,
  ChangePassword,
  Toast,
} from "../components";
import { useEffect } from "react";

const Admin = (props) => {
  const { user } = props;
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/addRescuer" element={<AddRescuer user={user} />} />
          <Route path="/incomingRequests" element={<IncomingRequests user={user} />} />
          <Route path="/rescuers" element={<Rescuers user={user} />} />
          <Route path="/ongoingRescues" element={<OngoingRescues user={user} />} />
          <Route path="/generateReports" element={<GenerateReports user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/viewProfile" element={<ViewProfile user={user} />} />
          <Route path="/changePassword" element={<ChangePassword user={user} />} />
        </Routes>
      </div>
      <Toast />
    </div>
  );
};

export default Admin;
