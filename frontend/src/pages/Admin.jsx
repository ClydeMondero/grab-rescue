import { Routes, Route, Navigate } from "react-router-dom";
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
  Loader,
} from "../components";
import { useState, useEffect } from "react";
import { getRequestsFromFirestore } from "../services/firestoreService";

const Admin = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState(null); // Initialize as null

  useEffect(() => {
    const unsubscribe = getRequestsFromFirestore(setRequests);
    return () => {
      unsubscribe();
    };
  }, []);

  if (user.account_type !== "Admin") {
    return <Navigate to="/not-found" replace />;
  }

  // Check if requests are null, show a loading state if so
  if (requests === null) {
    return <Loader isLoading={true} />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 md:mt-0 mt-16">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/incomingRequests" replace />}
          />
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
