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
import { useState, useEffect, useContext } from "react";
import {
  getRequestsFromFirestore,
  acceptRescueRequestInFirestore,
} from "../services/firestoreService";

import { RescuerProvider } from "../contexts/RescuerContext";
import { StatusContext } from "../contexts/StatusContext";

const Rescuer = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { getId } = useContext(StatusContext);

  const handleSelectedRequest = (request) => {
    setSelectedRequest(request);
  };
  //TODO: Handle other status change
  useEffect(() => {
    if (selectedRequest) {
      acceptRescueRequestInFirestore(user.id, selectedRequest);
    }
  });

  useEffect(() => {
    getId();

    const unsubscribe = getRequestsFromFirestore(setRequests);

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <div className="h-dvh flex flex-col">
      <RescuerProvider>
        {/* Header */}
        <Header />

        <div className="flex-1 overflow-y-auto bg-slate-50">
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
      </RescuerProvider>
    </div>
  );
};

export default Rescuer;
