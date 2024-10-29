import { useState, useContext, useEffect } from "react";
import { FaUserCircle, FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { handleLogout } from "../services/authService";
import logo from "../assets/logo.png";
import { RescuerContext } from "../contexts/RescuerContext";
import { getRequestsFromFirestore } from "../services/firestoreService";

const Header = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { page, setPage } = useContext(RescuerContext);
  const [requests, setRequests] = useState([]);
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
    const unsubscribe = getRequestsFromFirestore((requests) => {
      const assignedRequests = requests.filter(
        (request) =>
          request.rescuerId === user?.id && request.status === "assigned"
      );
      setRequests(assignedRequests);
      setIsAssigned(assignedRequests.length > 0);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="bg-background text-white flex items-center justify-between p-6 sticky top-0 left-0 right-0 z-50">
      <div className="text-xl font-bold flex items-center">
        <img src={logo} alt="" className="hidden h-10 md:block" />
        <div className="flex items-center gap-4 md:hidden">
          {page !== "Navigate" && page !== "Requests" && (
            <FaChevronLeft
              className="text-background-dark text-2xl cursor-pointer"
              onClick={() => {
                navigate("/rescuer/navigate");
                setPage("Navigate");
              }}
            />
          )}
          <p
            className={`text-primary-dark ${
              page === "Change Password" || page === "Change Email"
                ? "text-2xl"
                : "text-3xl"
            }`}
          >
            {page}
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative z-10">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center text-white"
        >
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-3xl text-primary-medium" />
            <FaChevronDown className="text-lg text-text-secondary" />
          </div>
        </button>
        {showDropdown && (
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className={`absolute right-0 mt-2 bg-background text-primary-medium rounded-md shadow-lg w-40 cursor-pointer ${
              isAssigned ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Link
              to="/rescuer/profile"
              className={`block px-4 py-2 hover:bg-background-light ${
                isAssigned ? "opacity-50" : ""
              }`}
              onClick={() => {
                if (!isAssigned) {
                  setPage("Profile");
                }
              }}
            >
              My Profile
            </Link>
            <Link
              to="/rescuer/change-password"
              className={`block px-4 py-2 hover:bg-background-light ${
                isAssigned ? "opacity-50" : ""
              }`}
              onClick={() => {
                if (!isAssigned) {
                  setPage("Change Password");
                }
              }}
            >
              Change Password
            </Link>
            <Link
              to="/rescuer/change-email"
              className={`block px-4 py-2 hover:bg-background-light ${
                isAssigned ? "opacity-50" : ""
              }`}
              onClick={() => {
                if (!isAssigned) {
                  setPage("Change Email");
                }
              }}
            >
              Change Email
            </Link>
            <Link
              onClick={() => !isAssigned && handleLogout(navigate)}
              className={`block px-4 py-2 hover:bg-background-light ${
                isAssigned ? "opacity-50" : ""
              }`}
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
