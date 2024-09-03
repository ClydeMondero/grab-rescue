import React, { useState } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const Header = () => {
  return (
    <div>
      <header className="bg-[#557C55] text-white flex items-center justify-between p-4">
        <div className="text-xl font-bold">
          <span className="text-[#A5CE97]">Rescuer</span> Logo
        </div>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center text-white"
          >
            <FaUserCircle className="text-2xl mr-2" />
            <span className="text-sm">Profile</span>
            <FaChevronDown className="text-xl ml-2" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white text-[#557C55] rounded-lg shadow-lg w-40">
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                My Profile
              </a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                Change Password
              </a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                Logout
              </a>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
