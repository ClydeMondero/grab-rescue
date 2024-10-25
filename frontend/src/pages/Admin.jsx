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
  ChangeEmail,
  Toast,
} from "../components";
import { useState, useEffect } from "react";
import { getRequestsFromFirestore } from "../services/firestoreService";

const Admin = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = getRequestsFromFirestore(setRequests);
    return () => {
      unsubscribe();
    };
  }, []);

  // Log the requests whenever they are updated
  useEffect(() => {
    console.log("Updated requests:", requests);
  }, [requests]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-[#FEF9F2]">
        <Routes>
          <Route path="/addRescuer" element={<AddRescuer user={user} />} />
          <Route
            path="/incomingRequests"
            element={<IncomingRequests user={user} requests={requests} />}
          />
          <Route path="/rescuers" element={<Rescuers user={user} />} />
          <Route
            path="/ongoingRescues"
            element={<OngoingRescues user={user} requests={requests} />}
          />
          <Route
            path="/generateReports"
            element={<GenerateReports user={user} />}
          />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/viewProfile" element={<ViewProfile user={user} />} />
          <Route
            path="/changePassword"
            element={<ChangePassword user={user} />}
          />
          <Route path="/changeEmail" element={<ChangeEmail user={user} />} />
        </Routes>
      </div>
      <Toast />
    </div>
  );
};

export default Admin;
