import { useState } from "react";
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

const Rescuer = (props) => {
  const { user } = props;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header />
      {/* Routes for Rescuer pages */}
      <div className="flex-grow p-4 bg-white">
        <Routes>
          <Route path="/requests" element={<Requests />} />
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

      {/* Bottom Navigation */}
      <Bottom />
    </div>
  );
};

export default Rescuer;
