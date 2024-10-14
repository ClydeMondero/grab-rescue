import { Link } from "react-router-dom";
import { FaTasks, FaLocationArrow } from "react-icons/fa";

const Bottom = () => {
  return (
    <div className="bg-background text-white flex justify-around py-3">
      <Link
        to="/rescuer/requests"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/requests"
            ? "text-[#A5CE97]"
            : ""
        }`}
      >
        <FaTasks className="text-xl text-primary" />
        <span className="text-xs text-primary">Requests</span>
      </Link>
      <Link
        to="/rescuer/navigate"
        className={`flex flex-col items-center ${
          window.location.pathname === "/rescuer/navigate"
            ? "text-[#A5CE97]"
            : ""
        }`}
      >
        <FaLocationArrow className="text-xl text-primary" />
        <span className="text-xs text-primary">Navigate</span>
      </Link>
    </div>
  );
};

export default Bottom;
