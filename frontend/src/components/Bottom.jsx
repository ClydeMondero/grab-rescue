import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaExclamation } from "react-icons/fa";
import { RescuerContext } from "../contexts/RescuerContext";

const Bottom = () => {
  const { page, setPage } = useContext(RescuerContext);

  const updatePage = (pageName) => {
    setPage(pageName);
  };

  return (
    <div className="bg-background text-white flex items-center justify-around py-4">
      <Link
        to="/rescuer/requests"
        className={`flex flex-col items-center `}
        onClick={() => updatePage("requests")}
      >
        <FaExclamation
          className={`text-xl ${
            page == "requests" ? "text-primary" : "text-background-medium"
          }`}
        />
        <span className="text-sm font-semibold text-primary-dark">
          Requests
        </span>
      </Link>
      <Link
        to="/rescuer/navigate"
        className={`flex flex-col items-center `}
        onClick={() => updatePage("navigate")}
      >
        <FaLocationArrow
          className={`text-xl ${
            page == "navigate" ? "text-primary" : "text-background-medium"
          }
        `}
        />
        <span className="text-sm font-semibold text-primary-dark">
          Navigate
        </span>
      </Link>
    </div>
  );
};

export default Bottom;
