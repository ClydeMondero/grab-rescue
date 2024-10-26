import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaAmbulance, FaFileAlt } from "react-icons/fa";
import {
  AiFillSetting,
  AiOutlineLogout,
  AiOutlineUser,
  AiFillCaretDown,
} from "react-icons/ai";
import { MdMail, MdAssignmentInd, MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/authService";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const initializeSidebar = () => {
    const pageWidth = window.innerWidth;

    if (pageWidth <= 768 && isOpen) {
      setIsOpen(false);
      setIsDropdownOpen(false);
    } else {
      if (!isOpen) {
        setIsOpen(true);
        setIsDropdownOpen(false);
      }
    }
  };

  // Ensure sidebar visibility on screen resize
  useEffect(() => {
    window.addEventListener("resize", initializeSidebar);
    return () => {
      window.removeEventListener("resize", initializeSidebar);
    };
  }, []);

  useEffect(() => {
    initializeSidebar();
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        style={{ height: "100vh" }}
        className={`hidden md:flex sticky top-0 left-0 h-full ${
          isOpen ? "w-64" : "w-20"
        } bg-[#557C55] text-white flex-col transition-all duration-300`}
        id="desktopSidebar"
      >
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between p-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleSidebar}
          >
            <MdDashboard
              className={`text-3xl ${isOpen ? "text-2xl" : "text-3xl"}`}
            />
            {isOpen && (
              <span className="ml-2 text-lg font-bold">Dashboard</span>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative flex flex-col items-center p-4">
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <div
              className={`w-14 h-14 rounded-full bg-white text-primary text-2xl flex items-center justify-center ${
                isOpen ? "md:flex" : "flex"
              }`}
            >
              <AiOutlineUser className={`text-xl ${!isOpen && "text-2xl"}`} />
            </div>
            {isOpen && <AiFillCaretDown className="text-white ml-2 text-lg" />}
          </div>
          <div
            className={`${
              isDropdownOpen ? "block" : "hidden"
            } bg-white text-[#6EA46E] absolute top-20 left-0 rounded-lg shadow-lg w-full`}
          >
            <Link
              to="/admin/viewProfile"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={closeDropdown}
            >
              View Profile
            </Link>
            <Link
              to="/admin/changePassword"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Password
            </Link>
            <Link
              to="/admin/changeEmail"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Email
            </Link>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col space-y-2 mt-6">
          <Link
            to="/admin/incomingRequests"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <MdMail className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Incoming Requests
            </span>
          </Link>
          <Link
            to="/admin/ongoingRescues"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <FaAmbulance
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Ongoing Rescues
            </span>
          </Link>
          <Link
            to="/admin/addRescuer"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <FaUserPlus
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Add Rescuer
            </span>
          </Link>
          <Link
            to="/admin/rescuers"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <MdAssignmentInd
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Rescuers
            </span>
          </Link>
          <Link
            to="/admin/generateReports"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <FaFileAlt
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Generate Reports
            </span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <AiFillSetting
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Settings
            </span>
          </Link>
          <div
            onClick={() => handleLogout(navigate)}
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E] cursor-pointer"
          >
            <AiOutlineLogout
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Logout
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        style={{ height: "100vh", zIndex: 1 }}
        className={`md:hidden fixed top-0 left-0 h-full ${
          isOpen ? "w-64" : "w-0"
        } bg-[#557C55] text-white flex-col transition-all duration-300`}
        id="mobileSidebar"
      >
        <div className="flex items-center justify-between p-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleSidebar}
          >
            <MdDashboard
              className={`text-3xl cursor-pointer ${
                isOpen ? "text-white" : "text-[#557C55]"
              }`}
            />
            <span
              className={`${isOpen ? "" : "hidden"} ml-2 text-lg font-bold`}
            >
              Dashboard
            </span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative flex flex-col items-center p-4">
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <div
              className={`w-14 h-14 rounded-full bg-white text-primary text-3xl flex items-center justify-center ${
                isOpen ? "flex" : "hidden"
              }`}
            >
              <AiOutlineUser className={`text-xl ${!isOpen && "text-2xl"}`} />
            </div>
            {isOpen && <AiFillCaretDown className="text-white ml-2 text-lg" />}
          </div>
          <div
            className={`${
              isDropdownOpen ? "block" : "hidden"
            } bg-white text-[#6EA46E] absolute top-20 left-0 rounded-lg shadow-lg`}
          >
            <Link
              to="/admin/viewProfile"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={closeDropdown}
            >
              View Profile
            </Link>
            <Link
              to="/admin/changePassword"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Password
            </Link>
            <Link
              to="/admin/changeEmail"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Email
            </Link>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col space-y-2 mt-6">
          <Link
            to="/admin/incomingRequests"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <MdMail className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Incoming Requests
            </span>
          </Link>
          <Link
            to="/admin/ongoingRescues"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <FaAmbulance
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Ongoing Rescues
            </span>
          </Link>
          <Link
            to="/admin/addRescuer"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <FaUserPlus
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Add Rescuer
            </span>
          </Link>
          <Link
            to="/admin/rescuers"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <MdAssignmentInd
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Rescuers
            </span>
          </Link>
          <Link
            to="/admin/generateReports"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <FaFileAlt
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Generate Reports
            </span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E]"
          >
            <AiFillSetting
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Settings
            </span>
          </Link>
          <div
            onClick={() => handleLogout(navigate)}
            className="flex items-center px-4 py-2 hover:bg-[#6EA46E] cursor-pointer"
          >
            <AiOutlineLogout
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
