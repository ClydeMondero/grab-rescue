import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaExclamation } from "react-icons/fa";
import { RescuerContext } from "../contexts/RescuerContext";

const Bottom = () => {
  const { page, setPage } = useContext(RescuerContext);

  const updatePage = (pageName) => {
    setPage(pageName);
  };

  return (
    (page === "Requests" || page === "Navigate") && (
      <div className="bg-background text-white flex items-center justify-around py-4 border-t-2 border-background-light">
        <Link
          to="/rescuer/requests"
          className="flex flex-col items-center"
          onClick={() => updatePage("Requests")}
        >
          <FaExclamation
            className={`text-xl ${
              page === "Requests" ? "text-primary" : "text-background-medium"
            }`}
          />
          <span className="text-sm font-semibold text-primary-dark">
            Requests
          </span>
        </Link>
        <Link
          to="/rescuer/navigate"
          className="flex flex-col items-center"
          onClick={() => updatePage("Navigate")}
        >
          <FaLocationArrow
            className={`text-xl ${
              page === "Navigate" ? "text-primary" : "text-background-medium"
            }`}
          />
          <span className="text-sm font-semibold text-primary-dark">
            Navigate
          </span>
        </Link>
      </div>
    )
  );
};

export default Bottom;
