import { useState } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { handleLogout } from "../services/authService";
import logo from "../assets/logo.png";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-background text-white flex items-center justify-between p-4">
      <div className="text-xl font-bold">
        <img src={logo} alt="" className="h-8" />
      </div>

      {/* Profile Section */}
      <div className="relative z-10 ">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center text-white"
        >
          <FaUserCircle className="text-2xl mr-2 text-primary" />
          <span className="text-sm text-primary">Profile</span>
          <FaChevronDown className="text-xl ml-2 text-primary" />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-white text-[#557C55] rounded-lg shadow-lg w-40 cursor-pointer">
            <Link
              to="/rescuer/profile"
              className="block px-4 py-2 text-primary hover:bg-gray-200"
            >
              My Profile
            </Link>
            <Link
              to="/rescuer/change-password"
              className="block px-4 py-2 text-primary hover:bg-gray-200"
            >
              Change Password
            </Link>
            <Link
              to="/rescuer/change-email"
              className="block px-4 py-2 text-primary hover:bg-gray-200"
            >
              Change Email
            </Link>
            <Link
              onClick={() => handleLogout(navigate)}
              className="block px-4 py-2 text-primary hover:bg-gray-200"
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
