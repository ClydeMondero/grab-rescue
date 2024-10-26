const RequestModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-lg p-4 relative md:w-1/2 lg:w-1/3">
        {/* Success message */}
        <p className="mb-6 text-2xl md:text-2xl text-primary text-center font-bold">
          Before sending Request:
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
            className="w-full bg-primary-medium hover:bg-primary text-white px-4 py-2 rounded md:text-base text-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="w-full border text-primary-dark px-4 py-2 rounded hover:bg-secondary hover:text-white md:text-base text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
