import { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Navigate,
  Status,
  Requests,
  Feedback,
  Complete,
  ViewProfile,
  ChangePassword,
  Hero,
  Bottom,
  RescuerMap,
} from "../components";

const Rescuer = (props) => {
  const { user } = props;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Hero />

      {/* Map Section */}
      <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
        <RescuerMap />
      </div>

      {/* Routes for Rescuer pages */}
      <div className="flex-grow p-4 bg-white">
        <Routes>
          <Route path="/requests" element={<Requests />} />
          <Route path="/navigate" element={<Navigate />} />
          <Route path="/status" element={<Status />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/profile" element={<ViewProfile user={user} />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <Bottom />
    </div>
  );
};

export default Rescuer;
