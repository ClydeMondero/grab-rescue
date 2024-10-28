import { MdMail } from "react-icons/md";
import { useState } from "react";

// Modal component to display request details
const RequestDetailsModal = ({ request, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 sm:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Request Details
        </h2>
        <p className="mb-2">
          <strong className="text-primary-medium">Name:</strong> {request.name}
        </p>
        <p className="mb-2">
          <strong className="text-primary-medium">Contact Number:</strong>{" "}
          {request.phone}
        </p>
        <p className="mb-2">
          <strong className="text-primary-medium">Age:</strong> {request.age}
        </p>
        <p className="mb-4">
          <strong className="text-primary-medium">Location:</strong>{" "}
          {request.location && request.location.address
            ? request.location.address
            : "Address not available"}
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-primary-medium text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
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
    <div className="flex flex-col p-2 sm:p-4 lg:p-6 h-full rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-3 sm:mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center">
          <MdMail className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2" />
          <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
            Incoming Requests
          </h4>
        </div>
      </div>

      <p className="text-lg font-semibold text-[#557C55] self-start">
        Here are the latest emergency requests:
      </p>

      {/* List of Requests */}
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-3 sm:gap-4 max-h-[calc(100vh-200px)]">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="shadow-md flex flex-col sm:flex-row items-start sm:items-center bg-gray-200 rounded-lg p-3 sm:p-4 transition duration-300 ease-in-out hover:shadow-sm cursor-pointer"
                onClick={() => openModal(request)}
              >
                {/* Request Details */}
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <div className="text-base sm:text-lg font-semibold text-info">
                      {/* Safely access request.location.address */}
                      {request.location && request.location.address
                        ? request.location.address
                        : "Address not available"}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(request.timestamp))}
                    </div>
                  </div>

                  {/* Request Status */}
                  <div className="mt-2 sm:mt-0">
                    <div
                      className={`text-sm sm:text-md font-semibold shadow-sm bg-white py-2 px-4 rounded-full ${
                        request.status === "pending"
                          ? "text-warning"
                          : request.status === "in progress"
                          ? "text-info"
                          : "text-primary"
                      }`}
                    >
                      {request.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-secondary text-center">
              No pending requests.
            </div>
          )}
        </div>
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
