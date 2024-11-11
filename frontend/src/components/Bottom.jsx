import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaExclamation } from "react-icons/fa";
import { RescuerContext } from "../contexts/RescuerContext";
import { useState, useEffect } from "react";
import { getRequestsFromFirestore } from "../services/firestoreService";
const Bottom = ({ user }) => {
  const { page, setPage } = useContext(RescuerContext);
  const [requests, setRequests] = useState([]);
  const [isAssigned, setIsAssigned] = useState(false);

  const { navigating } = useContext(RescuerContext);

  const updatePage = (pageName) => {
    setPage(pageName);
  };

  useEffect(() => {
    const unsubscribe = getRequestsFromFirestore((requests) => {
      const assignedRequests = requests.filter(
        (request) =>
          request.rescuerId === user?.id && request.status !== "rescued"
      );
      setRequests(assignedRequests);
      setIsAssigned(assignedRequests.length > 0);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    !navigating &&
    (page === "Requests" || page === "Navigate") && (
      <div className="w-full sticky bottom-0 bg-background text-white flex items-center justify-around py-4 border-t-2 border-background-light">
        <Link
          to="/rescuer/requests"
          className={`flex flex-col items-center ${
            isAssigned ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={(e) => {
            if (!isAssigned) updatePage("Requests");
            else e.preventDefault();
          }}
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
        <a
          href="/rescuer/navigate"
          className={`flex flex-col items-center ${
            isAssigned ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={(e) => {
            if (!isAssigned) {
              updatePage("Navigate");
            }
          }}
        >
          <FaLocationArrow
            className={`text-xl ${
              page === "Navigate" ? "text-primary" : "text-background-medium"
            }`}
          />
          <span className="text-sm font-semibold text-primary-dark">
            Navigate
          </span>
        </a>
      </div>
    )
  );
};

export default Bottom;
