import { Link } from "react-router-dom";
import { FaTasks, FaLocationArrow } from "react-icons/fa";

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
    </div>
  );
};

export default Bottom;
