import { useState } from "react";
import { FaArrowLeft, FaSync, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createAuthHeader } from "../services/authService";
import axios from "axios";

const ChangePassword = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const userId = user.id; // Get user ID from props
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    const authHeader = createAuthHeader();

    try {
      const response = await axios.put(
        `/users/updatePassword/${userId}`,
        passwords,
        {
          headers: {
            ...authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Password updated successfully!");
        navigate(-1);
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex-1 p-3 h-100 bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft
          className="text-lg sm:text-xl text-[#557C55] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h4 className="text-md sm:text-lg font-semibold ml-2 text-[#557C55]">
          Change Password
        </h4>
      </div>
      <div className="flex-1 bg-white rounded-lg p-3">
        <p className="text-sm sm:text-md mb-3 font-semibold text-[#557C55]">
          Update your password:
        </p>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="relative">
            <label
              htmlFor="current-password"
              className="block text-xs sm:text-sm font-semibold text-[#557C55]"
            >
              Current Password:
            </label>
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 top-5 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("currentPassword")}
            >
              {showPasswords.currentPassword ? (
                <FaEyeSlash size={20} color="#557C55" />
              ) : (
                <FaEye size={20} color="#557C55" />
              )}
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-xs sm:text-sm font-semibold text-[#557C55]"
            >
              New Password:
            </label>
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter a new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 top-5 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPasswords.newPassword ? (
                <FaEyeSlash size={20} color="#557C55" />
              ) : (
                <FaEye size={20} color="#557C55" />
              )}
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-xs sm:text-sm font-semibold text-[#557C55]"
            >
              Confirm New Password:
            </label>
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 top-5 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPasswords.confirmPassword ? (
                <FaEyeSlash size={20} color="#557C55" />
              ) : (
                <FaEye size={20} color="#557C55" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
          >
            <FaSync className="mr-1" />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
