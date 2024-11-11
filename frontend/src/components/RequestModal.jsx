import { Link } from "react-router-dom";

const RequestModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl p-6 relative md:w-1/2 lg:w-1/3 shadow-lg">
        {/* Success message */}
        <p className="mb-4 text-2xl text-primary-dark text-center font-semibold">
          Request Submission Guidelines
        </p>

        {/* Policy message in a minimal format */}
        <div className="mb-6 text-sm md:text-base">
          <p className="mb-2 font-bold text-secondary text-center">
            PLEASE NOTE
          </p>
          <ul className="list-disc text-primary-dark font-medium ml-4 space-y-3">
            <li>
              <span className="font-bold">False emergencies</span> may result in
              legal action, account suspension, or other penalties.
            </li>
            <li>
              Ensure your request is <span className="font-bold">genuine</span>.
              If not in immediate danger, please refrain from making a request.
            </li>
            <li>
              You will be prompted to enter your{" "}
              <span className="font-bold">name</span> and{" "}
              <span className="font-bold">phone number</span> and other
              information for follow-up communication regarding your request.
            </li>
          </ul>
          <p className="text-center text-background-dark mt-4 text-xs">
            By submitting this request, you agree to our{" "}
            <Link to="/privacy-policy" className="underline text-primary-dark">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-of-service"
              className="underline text-primary-dark"
            >
              Terms of Service
            </Link>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3">
          <button
            className="w-full bg-primary-medium hover:bg-primary text-white px-4 py-3 rounded-full md:text-base text-sm shadow-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="w-full border border-primary-dark text-primary-dark px-4 py-3 rounded-full hover:bg-secondary hover:text-white hover:border-none md:text-base text-sm"
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
