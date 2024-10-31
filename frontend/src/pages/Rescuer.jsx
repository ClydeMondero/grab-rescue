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
  Toast,
} from "../components";
import { useState, useEffect, useContext } from "react";
import {
  addMessagingTokenToLocation,
  getLocationIDFromFirestore,
  getRequestsFromFirestore,
  setMessagingToken,
} from "../services/firestoreService";
import { StatusContext } from "../contexts/StatusContext";
import { getSelectedRequestCookie } from "../services/cookieService";
import { RescuerProvider } from "../contexts/RescuerContext";

const Rescuer = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { id, getId } = useContext(StatusContext);

  const getSelectedRequest = () => {
    const selectedRequestID = getSelectedRequestCookie();

    if (selectedRequestID) {
      setSelectedRequest(selectedRequestID);
    }
  };

  //TODO: incosistent saving of FCM
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "granted") {
      const token = await setMessagingToken();

      if (token) {
        const locationId = await getLocationIDFromFirestore(id);

        if (locationId) {
          addMessagingTokenToLocation(locationId, token);
        }
      }
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await setMessagingToken();

        if (token) {
          const locationId = await getLocationIDFromFirestore(id);

          if (locationId) {
            addMessagingTokenToLocation(locationId, token);
          }
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  useEffect(() => {
    getId();

    requestNotificationPermission();

    getSelectedRequest();

    const unsubscribe = getRequestsFromFirestore(setRequests);

    return () => {
      unsubscribe();
    };
  }, []);

  if (user.account_type !== "Rescuer") {
    return <RouterNavigate to="/not-found" replace />;
  }

  return (
    <div className="h-dvh flex flex-col">
      <RescuerProvider>
        {/* Header */}

        <Header user={user} />

        <div className="flex-1 overflow-y-auto bg-background-light">
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
                  userId={user.id}
                  requests={requests}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
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
          <Toast />
        </div>

        {/* Bottom Navigation always visible */}

        <Bottom user={user} />
      </RescuerProvider>
    </div>
  );
};

export default Rescuer;
