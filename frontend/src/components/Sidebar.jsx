import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserPlus, FaAmbulance, FaFileAlt } from "react-icons/fa";
import {
  AiFillSetting,
  AiOutlineLogout,
  AiFillCaretDown,
} from "react-icons/ai";
import { MdMail, MdAssignmentInd, MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/authService";

const Sidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    window.addEventListener("resize", initializeSidebar);
    return () => {
      window.removeEventListener("resize", initializeSidebar);
    };
  }, []);

  useEffect(() => {
    initializeSidebar();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        style={{ height: "100dvh" }}
        className={`hidden md:flex sticky top-0 left-0 h-full ${
          isOpen ? "w-64" : "w-20"
        } bg-[#557C55] text-white flex-col items-center transition-all duration-300`}
        id="desktopSidebar"
      >
        <div
          className={`flex items-center justify-between p-4 ${
            isOpen ? "self-start" : ""
          }`}
        >
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
        <div className="relative flex flex-col items-center p-4 w-full">
          <div
            className="flex items-center justify-center cursor-pointer w-full"
            onClick={isOpen ? toggleDropdown : toggleSidebar}
          >
            <div
              className={`w-12 h-12 rounded-full bg-white text-green text-3xl flex items-center justify-center ${
                isOpen ? "md:flex w-10 h-10 text-2xl" : "flex"
              }`}
            >
              <p className="text-xl text-primary-medium font-bold">
                {user.username.charAt(0).toUpperCase()}
              </p>
            </div>
            {isOpen && <AiFillCaretDown className="text-white ml-2 text-lg" />}
          </div>
          <div
            className={`${
              isDropdownOpen ? "block" : "hidden"
            } bg-white text-[#6EA46E] absolute top-full rounded-lg shadow-lg w-3/4 flex flex-col `}
          >
            <Link
              to="/admin/viewProfile"
              className="block p-2 text-center border-background-medium border-b hover:bg-gray-200"
              onClick={closeDropdown}
            >
              View Profile
            </Link>
            <Link
              to="/admin/changePassword"
              className="block p-2 text-center border-background-medium border-b hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Password
            </Link>
            <Link
              className="block p-2 text-center border-background-medium border-b hover:bg-gray-200"
              to="/admin/changeEmail"
              onClick={closeDropdown}
            >
              Change Email
            </Link>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col gap-6 mt-6">
          <Link
            to="/admin/incomingRequests"
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/incomingRequests")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
          >
            <MdMail className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Incoming Requests
            </span>
          </Link>
          <Link
            to="/admin/ongoingRescues"
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/ongoingRescues")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
          >
            <FaAmbulance
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Rescues
            </span>
          </Link>
          <Link
            to="/admin/addRescuer"
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/addRescuer")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
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
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/rescuers")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
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
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/generateReports")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
          >
            <FaFileAlt
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Logs
            </span>
          </Link>
          <Link
            to="/admin/settings"
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/settings")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
          >
            <AiFillSetting
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Settings
            </span>
          </Link>
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
            onClick={isOpen ? toggleDropdown : toggleSidebar}
          >
            <div
              className={`w-14 h-14 rounded-full bg-white text-primary text-3xl flex items-center justify-center ${
                isOpen ? "flex" : "hidden"
              }`}
            >
              <div
                className={`text-2xl bg-white text-primary-medium font-bold rounded-full flex items-center justify-center ${
                  !isOpen && "text-2xl"
                }`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            {isOpen && <AiFillCaretDown className="text-white ml-2 text-lg" />}
          </div>
          <div
            className={`${
              isDropdownOpen ? "block" : "hidden"
            } bg-white text-[#6EA46E] absolute top-20 rounded-lg shadow-lg`}
          >
            <Link
              to="/admin/viewProfile"
              className="block p-2 text-center border-background-medium border-b hover:bg-gray-200"
              onClick={closeDropdown}
            >
              View Profile
            </Link>
            <Link
              to="/admin/changePassword"
              className="block p-2 text-center border-background-medium border-b hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Password
            </Link>
            <Link
              to="/admin/changeEmail"
              className="block p-2 text-center border-background-medium border-b hover:bg-gray-200"
              onClick={closeDropdown}
            >
              Change Email
            </Link>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col gap-6 mt-6">
          <Link
            to="/admin/incomingRequests"
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/incomingRequests")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
          >
            <MdMail className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Incoming Requests
            </span>
          </Link>
          <Link
            to="/admin/ongoingRescues"
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/ongoingRescues")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
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
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/addRescuer")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
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
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/rescuers")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
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
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/generateReports")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
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
            className={`flex items-center px-4 py-2 hover:opacity-80 overflow-x-auto ${
              isActive("/admin/settings")
                ? "bg-white text-[#6EA46E] rounded-full"
                : ""
            }`}
          >
            <AiFillSetting
              className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`}
            />
            <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>
              Settings
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
