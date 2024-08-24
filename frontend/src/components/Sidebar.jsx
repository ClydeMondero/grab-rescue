import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaRegEnvelope, FaUserPlus, FaAmbulance, FaFileAlt } from "react-icons/fa";
import { AiFillSetting, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const initializeSidebar = () => {
    const pageWidth = window.innerWidth;
    
    if(pageWidth <= 675 && isOpen){
      setIsOpen(false);
    }else {
      if(!isOpen) return;
      setIsOpen(true);
    }

  }

  window.addEventListener('resize', initializeSidebar);

  useEffect(() => {
    initializeSidebar();
  }, []);

  console.log("Sidebar rendered");

  return (
    <div
      style={{height: "100vh"}}
      className={`top-0 left-0 h-full ${isOpen ? "w-64" : "w-20"} bg-[#557C55] text-white flex flex-col transition-all duration-300`}
      id="sidebar"
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center cursor-pointer" onClick={toggleSidebar}>
          <FaHome className={`text-3xl ${isOpen ? "w-8" : "w-16"} cursor-pointer`} />
          {isOpen && <span className="ml-2 text-lg font-bold">Dashboard</span>}
        </div>
        {!isOpen && (
          <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
        )}
      </div>

      {/* Profile Section */}
      <div className="relative flex flex-col items-center p-4">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 text-white text-2xl cursor-pointer"
          onClick={toggleDropdown}
        >
          <AiOutlineUser />
        </div>
        <div className={`${isDropdownOpen ? "block" : "hidden"} bg-white text-[#6EA46E] absolute top-20 left-0 rounded-lg shadow-lg`}>
          <Link to="/viewProfile" className="block px-4 py-2 hover:bg-gray-200">
            View Profile
          </Link>
          <Link to="/changePassword" className="block px-4 py-2 hover:bg-gray-200">
            Change Password
          </Link>
        </div>
      </div>

      {/* Sidebar Dashboard */}
      <div className="flex flex-col space-y-2 mt-6">
        <Link to="/incomingRequests" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaRegEnvelope className="text-lg" />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Incoming Requests</span>
        </Link>
        <Link to="/assignRescuer" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaUserPlus className="text-lg" />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Assign Rescuer</span>
        </Link>
        <Link to="/ongoingRescues" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaAmbulance className="text-lg" />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Ongoing Rescues</span>
        </Link>
        <Link to="/generateReports" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <FaFileAlt className="text-lg" />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Generate Reports</span>
        </Link>
        <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <AiFillSetting className="text-lg" />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Settings</span>
        </Link>
        <Link to="/logout" className="flex items-center px-4 py-2 hover:bg-[#6EA46E]">
          <AiOutlineLogout className="text-lg" />
          <span className={`${!isOpen && "hidden"} ml-4 duration-300`}>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
