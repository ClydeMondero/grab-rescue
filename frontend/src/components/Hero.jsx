import { useState } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { handleLogout } from "../services/authService";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-[#557C55] text-white flex items-center justify-between p-4">
      <div className="text-xl font-bold">
        <span className="text-[#A5CE97]">Rescuer</span> Logo
      </div>

      {/* Profile Section */}
      <div className="relative z-10">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center text-white"
        >
          <FaUserCircle className="text-2xl mr-2" />
          <span className="text-sm">Profile</span>
          <FaChevronDown className="text-xl ml-2" />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-white text-[#557C55] rounded-lg shadow-lg w-40 cursor-pointer">
            <Link
              to="/rescuer/profile"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              My Profile
            </Link>
            <Link
              to="/rescuer/change-password"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Change Password
            </Link>
            <Link
              to="/rescuer/change-email"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Change Email
            </Link>
            <Link
              onClick={() => handleLogout(navigate)}
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
