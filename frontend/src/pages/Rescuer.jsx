import { Routes, Route, Navigate as RouterNavigate } from "react-router-dom";
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
import {
  getRequestsFromFirestore,
  acceptRescueRequestInFirestore,
} from "../services/firestoreService";

//TODO: Handle Offline Rescuers

const Rescuer = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSelectedRequest = (request) => {
    setSelectedRequest(request);
  };
  //TODO: Handle other status change
  useEffect(() => {
    if (selectedRequest) {
      acceptRescueRequestInFirestore(user.id, selectedRequest);
    }
  });

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
          {/* Default Route to Navigate */}
          <Route
            path="/"
            element={<RouterNavigate to="/rescuer/navigate" replace />}
          />

          <Route
            path="/requests"
            element={
              <Requests
                requests={requests}
                onSelectRequest={handleSelectedRequest}
              />
            }
          />
          <Route
            path="/navigate"
            element={
              <Navigate
                user={user}
                requests={requests}
                requestID={selectedRequest}
              />
            }
          />
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
