import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaAmbulance, FaFileAlt } from "react-icons/fa";
import { AiFillSetting, AiOutlineLogout, AiOutlineUser, AiFillCaretDown } from "react-icons/ai";
import { MdMail, MdAssignmentInd, MdDashboard } from "react-icons/md"; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const initializeSidebar = () => {
    const pageWidth = window.innerWidth;

    if (pageWidth <= 675 && isOpen) {
      setIsOpen(false);
    } else {
      if (!isOpen) return;
      setIsOpen(true);
    }
  };

  window.addEventListener("resize", initializeSidebar);

  useEffect(() => {
    initializeSidebar();
  }, []);

  return (
    <div
      style={{ height: "100vh" }}
      className={`sticky top-0 left-0 h-full ${isOpen ? "w-64" : "w-20"} bg-[#557C55] text-white flex flex-col transition-all duration-300`}
      id="sidebar"
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center cursor-pointer" onClick={toggleSidebar}>
          <MdDashboard className={`text-3xl ${isOpen ? "text-2xl" : "text-3xl"} cursor-pointer`} />
          {isOpen && <span className="ml-2 text-lg font-bold">Dashboard</span>}
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative flex flex-col items-center p-4">
        <div className="flex items-center justify-center cursor-pointer" onClick={toggleDropdown}>
          <div className={`w-14 h-14 rounded-full ${isOpen ? 'bg-red-500' : 'bg-red-700'} text-white text-3xl flex items-center justify-center`}>
            <AiOutlineUser className={`text-xl ${!isOpen && "text-2xl"}`} />
          </div>
          {isOpen && (
            <AiFillCaretDown className="text-white ml-2 text-lg" />
          )}
        </div>
        <div
          className={`${
            isDropdownOpen ? "block" : "hidden"
          } bg-white text-[#6EA46E] absolute top-20 left-0 rounded-lg shadow-lg`}
        >
          <Link to="/viewProfile" className="block px-4 py-2 hover:bg-gray-200" onClick={closeDropdown}>
            View Profile
          </Link>
          <Link to="/changePassword" className="block px-4 py-2 hover:bg-gray-200" onClick={closeDropdown}>
            Change Password
          </Link>
        </div>
      </div>

      {/* Sidebar Dashboard */}
      <div className="flex flex-col space-y-2 mt-6">
        <Link to="/addRescuer" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaUserPlus className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} /> 
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Add Rescuer</span>
        </Link>
        <Link to="/incomingRequests" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <MdMail className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} /> 
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Incoming Requests</span>
        </Link>
        <Link to="/rescuers" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <MdAssignmentInd className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} /> 
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Rescuers</span>
        </Link>
        <Link to="/ongoingRescues" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaAmbulance className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Ongoing Rescues</span>
        </Link>
        <Link to="/generateReports" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaFileAlt className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Generate Reports</span>
        </Link>
        <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <AiFillSetting className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Settings</span>
        </Link>
        <Link to="/logout" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <AiOutlineLogout className={`text-lg ${!isOpen ? "text-xl" : "text-lg"}`} />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
