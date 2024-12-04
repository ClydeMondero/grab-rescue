import { MdMail } from "react-icons/md";
import { useState } from "react";
import { NoRequests } from "../components";
import { FaTimes } from "react-icons/fa";
import placeholder from "../assets/placeholder.png";

// Modal component to display request details
const RequestDetailsModal = ({ request, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-auto overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-lg text-background-medium" />
          </button>
        </div>

        {/* Information Section */}
        <div className="space-y-6 text-gray-700">
          <div>
            <img
              src={request?.incidentPicture || placeholder}
              alt="Incident Picture"
              className="w-full h-56 object-cover rounded-md"
            />
            <div className="flex items-center gap-3">
              {request.status && (
                <div
                  className={`
                  ${
                    {
                      pending: "bg-yellow-500",
                      "in transit": "bg-blue-500",
                      "en-route": "bg-indigo-700",
                      rescued: "bg-green-500",
                    }[request.status]
                  } text-sm  w-max font-medium text-white px-2 py-1 rounded-md mt-2
                `}
                >
                  {request.status}
                </div>
              )}
              {request.rescueTypes && (
                <div
                  className={`
                  ${
                    {
                      MDRRMO: "bg-primary",
                      PNP: "bg-highlight",
                      BFP: "bg-warning",
                    }[request.rescueTypes]
                  } text-sm  w-max font-medium text-white px-2 py-1 rounded-md mt-2
                `}
                >
                  {request.rescueTypes}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xl font-semibold text-gray-800">
              {request.location?.address || "Address not available"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Contact Number:
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {request.phone || ""}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Citizen Information:
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {
                  (request.citizenName + " • " || "",
                  request.citizenRelation || "No Relation")
                }
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Description:</p>
            <div className="bg-white rounded-md border border-gray-300 p-2 min-h-20">
              <p className="text-sm font-semibold text-gray-800 break-words">
                {request.incidentDescription || ""}
              </p>
            </div>
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
      <div className="flex-1 h-full overflow-y-auto flex flex-col gap-4">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div
              key={request.id}
              className="shadow-sm bg-background-light rounded-lg p-3 cursor-pointer"
              onClick={() => openModal(request)}
            >
              <div className="text-lg font-semibold text-primary-dark">
                {request.location?.address || "Address not available"}
              </div>
              <div className="text-xs font-medium text-gray-700">
                {new Intl.RelativeTimeFormat("en-US", {
                  numeric: "auto",
                }).format(
                  -Math.round(
                    (new Date() - new Date(request.timestamp)) / 1000 / 60
                  ),
                  "minute"
                )}
              </div>
              <button
                className={`text-white text-xs font-semibold mt-1 px-2 py-1 rounded ${
                  request.status === "pending"
                    ? "bg-yellow-500"
                    : request.status === "en-route"
                    ? "bg-blue-500"
                    : request.status === "in transit"
                    ? "bg-blue-700"
                    : request.status === "rescued"
                    ? "bg-green-600"
                    : "bg-green-600"
                }`}
              >
                {request.status}
              </button>{" "}
              <button
                className={`text-white text-xs font-semibold mt-1 px-2 py-1 rounded ${
                  request.rescueTypes === "MDRRMO"
                    ? "bg-primary"
                    : request.rescueTypes === "PNP"
                    ? "bg-highlight"
                    : "bg-warning"
                }`}
              >
                {request.rescueTypes}
              </button>
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
