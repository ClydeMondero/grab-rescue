import React from "react";

const RequestModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 max-w-md md:w-1/3 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-2xl absolute top-1 right-2 text-primary-dark hover:text-gray-800"
        >
          &times;
        </button>

        {/* Success message */}
        <p className="mb-6 text-2xl md:text-2xl text-primary text-center font-bold">
          Your rescue request has been sent successfully!
        </p>

        {/* Policy message in bullet form with gap between list items */}
        <div className="mb-6 text-xs md:text-xs">
          <p className="mb-2 font-bold text-secondary">PLEASE NOTE:</p>
          <ul className="list-disc list-inside mt-2 text-primary-dark font-semibold">
            <li className="mb-2">
              Reporting false emergencies is a serious offense that may result
              in legal action, account suspension, or other penalties.
            </li>
            <li className="mb-2">
              Ensure that your request is genuine. If you are not in immediate
              danger, please refrain from making a request.
            </li>
            <li className="mb-2">
              You will be prompted to enter your name and phone number for
              follow-up communication regarding your request.
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            className="w-full border text-primary-dark px-4 py-2 rounded hover:bg-secondary hover:text-white md:text-base text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
