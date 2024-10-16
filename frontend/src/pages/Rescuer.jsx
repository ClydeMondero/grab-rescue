import { Routes, Route } from "react-router-dom";
import {
  Navigate,
  Requests,
  ViewProfile,
  ChangePassword,
  Header,
  Bottom,
  ChangeEmail,
  RequestDetails,
} from "../components";
import { useState, useEffect } from "react";
import { getRequestsFromFirestore } from "../services/firestoreService";

const Rescuer = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    const requests = await getRequestsFromFirestore();

    setRequests(requests);
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex-grow overflow-auto p-4 bg-slate-50">
        <Routes>
          <Route path="/requests" element={<Requests requests={requests} />} />
          <Route path="/navigate" element={<Navigate user={user} />} />
          <Route path="/profile" element={<ViewProfile user={user} />} />
          <Route
            path="/request-details/:id"
            element={<RequestDetails user={user} />}
          />
          <Route
            path="/change-password"
            element={<ChangePassword user={user} />}
          />
          <Route path="/change-email" element={<ChangeEmail user={user} />} />
        </Routes>
      </div>

      {/* Bottom Navigation always visible */}
      <Bottom />
    </div>
  );
};

export default Rescuer;
