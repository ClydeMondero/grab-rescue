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
  getLocationFromFirestore,
  getLocationIDFromFirestore,
  getRequestsFromFirestore,
  setMessagingToken,
} from "../services/firestoreService";
import { StatusContext } from "../contexts/StatusContext";
import { getSelectedRequestCookie } from "../services/cookieService";
import { RescuerProvider } from "../contexts/RescuerContext";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../firebaseConfig";
import { FaExclamation } from "react-icons/fa";

const Rescuer = (props) => {
  const { user } = props;
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { id, getId } = useContext(StatusContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");

  const getSelectedRequest = () => {
    const selectedRequestID = getSelectedRequestCookie();
    if (selectedRequestID) {
      setSelectedRequest(selectedRequestID);
    }
  };

  const handleNotificationPermission = async () => {
    try {
      let permission = Notification.permission;

      if (permission !== "granted") {
        permission = await Notification.requestPermission();
      }

      if (permission === "granted") {
        const newToken = await setMessagingToken();

        if (newToken && id) {
          const locationId = await getLocationIDFromFirestore(id);
          if (locationId) {
            const location = await getLocationFromFirestore(locationId);

            if (!location.fcmToken) {
              console.log("FCM token added to location document:", newToken);
              await addMessagingTokenToLocation(locationId, newToken);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || "Emergency Request!";
    const body =
      payload.notification?.body ||
      "You are the nearest rescuer. Please respond!";

    setNotificationTitle(title);
    setNotificationBody(body);
    setShowOverlay(true);
  });

  useEffect(() => {
    getId();

    getSelectedRequest();

    const unsubscribe = getRequestsFromFirestore(setRequests);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    handleNotificationPermission();
  }, [id]);

  if (user.account_type !== "Rescuer") {
    return <RouterNavigate to="/not-found" replace />;
  }

  return (
    <div className="h-dvh flex flex-col">
      <RescuerProvider>
        <Header user={user} />

        {showOverlay && (
          <div className="fixed inset-0 bg-red-700 bg-opacity-80 flex items-center justify-center z-50">
            <div className="text-white flex flex-col items-center text-center p-10">
              <FaExclamation className="text-8xl mb-4" />
              <h1 className="text-4xl font-bold mb-4">{notificationTitle}</h1>
              <p className="text-lg mb-6">{notificationBody}</p>
              <div className="flex flex-col gap-2">
                <button
                  className="bg-white text-red-700 px-6 py-3 text-xl font-bold rounded-lg"
                  onClick={() => {
                    setShowOverlay(false);
                    // Optionally navigate to the response page
                    // navigate("/emergency-response");
                  }}
                >
                  Respond Now
                </button>
                <button
                  className="mt-4 text-white underline"
                  onClick={() => setShowOverlay(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <Routes>
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
                setSelectedRequest={setSelectedRequest}
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

        <Bottom user={user} />
      </RescuerProvider>
    </div>
  );
};

export default Rescuer;
