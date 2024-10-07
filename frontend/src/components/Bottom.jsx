import { Link } from "react-router-dom";
import {
  FaTasks,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCommentDots,
} from "react-icons/fa";

const Bottom = () => {
  return (
    <div className="bg-[#58BC6B] text-white flex justify-around py-3">
      <Link
        to="/rescuer/requests"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/requests"
            ? "text-[#A5CE97]"
            : ""
        }`}
      >
        <FaTasks className="text-xl" />
        <span className="text-xs">Requests</span>
      </Link>
      <Link
        to="/rescuer/navigate"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/navigate"
            ? "text-[#A5CE97]"
            : ""
        }`}
      >
        <FaLocationArrow className="text-xl" />
        <span className="text-xs">Navigate</span>
      </Link>
      <Link
        to="/rescuer/status"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/status" ? "text-[#A5CE97]" : ""
        }`}
      >
        <FaMapMarkerAlt className="text-xl" />
        <span className="text-xs">Status</span>
      </Link>
      <Link
        to="/rescuer/complete"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/complete"
            ? "text-[#A5CE97]"
            : ""
        }`}
      >
        <FaCheckCircle className="text-xl" />
        <span className="text-xs">Complete</span>
      </Link>
      <Link
        to="/rescuer/feedback"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/feedback"
            ? "text-[#A5CE97]"
            : ""
        }`}
      >
        <FaCommentDots className="text-xl" />
        <span className="text-xs">Feedback</span>
      </Link>
    </div>
  );
};

export default Bottom;
