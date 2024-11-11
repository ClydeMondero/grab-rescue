import { MdMail } from "react-icons/md";
import { useState } from "react";
import { NoRequests } from "../components";

// Modal component to display request details
const RequestDetailsModal = ({ request, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-4 max-w-lg w-full mx-auto overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">Request Details</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Information Section */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">Contact Number:</p>
              <p className="text-sm font-semibold">{request.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Citizen Name:</p>
              <p className="text-sm font-semibold">
                {request.citizenName || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">Relation:</p>
              <p className="text-sm font-semibold">
                {request.citizenRelation || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Description:</p>
              <p className="text-sm font-semibold">
                {request.incidentDescription || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Location:</p>
            <p className="text-sm font-semibold">
              {request.location?.address || "Address not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const IncomingRequests = ({ requests }) => {
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="flex flex-col p-4 lg:p-6 h-full">
      {/* Header Section */}
      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <MdMail className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
          Incoming Requests
        </h4>
      </div>
      {/* List of Requests */}
      <div className="flex-1 h-full overflow-y-auto">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div
              key={request.id}
              className="shadow-sm bg-gray-200 rounded p-3 cursor-pointer"
              onClick={() => openModal(request)}
            >
              <div className="text-sm font-semibold text-info">
                {request.location?.address || "Address not available"}
              </div>
              <div className="text-xs font-medium text-primary-dark">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(new Date(request.timestamp))}
              </div>
              <div
                className={`text-xs font-semibold mt-1 ${
                  request.status === "pending" ? "text-warning" : "text-info"
                }`}
              >
                {request.status}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <NoRequests />
          </div>
        )}
      </div>
      {/* Render Modal if a request is selected */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default IncomingRequests;
