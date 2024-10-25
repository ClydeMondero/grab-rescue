import { useState, useContext } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { handleLogout } from "../services/authService";
import logo from "../assets/logo.png";
import { RescuerContext } from "../contexts/RescuerContext";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { page } = useContext(RescuerContext);

  return (
    <div className="bg-background text-white flex items-center justify-between p-6 sticky top-0 left-0 right-0 z-50">
      <div className="text-xl font-bold">
        <img src={logo} alt="" className="hidden h-10 md:block" />
        <p className="text-3xl text-primary-dark md:hidden">
          {page == "requests" ? "Requests" : "Navigate"}
        </p>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 ">
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
          <div className="absolute right-0 mt-2 bg-background text-primary-medium rounded-md shadow-lg w-40 cursor-pointer">
            <Link
              to="/rescuer/profile"
              className="block px-4 py-2 hover:bg-background-light"
            >
              My Profile
            </Link>
            <Link
              to="/rescuer/change-password"
              className="block px-4 py-2 hover:bg-background-light"
            >
              Change Password
            </Link>
            <Link
              to="/rescuer/change-email"
              className="block px-4 py-2 hover:bg-background-light"
            >
              Change Email
            </Link>
            <Link
              onClick={() => handleLogout(navigate)}
              className="block px-4 py-2 hover:bg-background-light"
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
