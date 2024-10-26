import { useState } from "react";
import {
  FaArrowLeft,
  FaSync,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLock,
  FaLockOpen,
} from "react-icons/fa"; // Import icons for password fields
import { useNavigate } from "react-router-dom";
import { createAuthHeader } from "../services/authService";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "../components";
import zxcvbn from "zxcvbn"; // Import zxcvbn for password strength

const ChangePassword = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const userId = user.id;

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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });
  const [showPasswordMeter, setShowPasswordMeter] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));

    // Show password meter only when user starts typing in the field
    if (name === "newPassword" && value.length > 0) {
      setShowPasswordMeter(true);
    }

    // Update password strength for new password
    if (name === "newPassword") {
      const result = zxcvbn(value);
      setPasswordStrength(result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    };

    console.log("User Id:", userId);
    console.log("Data being sent:", data);

    try {
      // Sending PUT request to update password
      const response = await (
        await axios.put(
          `/users/updatePassword/${userId}`,
          data,
          createAuthHeader()
        )
      ).data;

      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
      // Clear the password fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordMeter(false);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 p-3 h-full flex flex-col">
      <div className="flex items-center mb-2 max-w-md">
        <FaArrowLeft
          className="text-lg sm:text-xl text-[#557C55] cursor-pointer"
          onClick={() => {
            navigate(user.account_type === "Admin" ? "/admin" : "/rescuer");
          }}
        />
        <FaKey className="text-2xl sm:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-lg sm:text-xl font-semibold ml-2 text-[#557C55]">
          Change Password
        </h4>
      </div>
      <div className="flex-1 bg-white rounded-lg p-3">
        <p className="text-sm sm:text-md mb-3 font-semibold text-[#557C55]">
          Update your password:
        </p>
        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Current Password Field */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 pl-10 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("currentPassword")}
            >
              {showPasswords.currentPassword ? (
                <FaEyeSlash size={20} color="#557C55" />
              ) : (
                <FaEye size={20} color="#557C55" />
              )}
            </button>
          </div>

          {/* New Password Field */}
          <div className="relative">
            <FaLockOpen className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 pl-10 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter a new password"
            />
            <button
              type="button"
              className="absolute right-3 top-2 sm:top-5 sm:transform sm:-translate-y-1/2 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPasswords.newPassword ? (
                <FaEyeSlash size={20} color="#557C55" />
              ) : (
                <FaEye size={20} color="#557C55" />
              )}
            </button>
            {/* Password Strength Meter */}
            {showPasswordMeter && (
              <div className="mt-2">
                <strong className="block text-xs sm:text-sm font-semibold text-[#557C55]">
                  Password Strength: {getStrengthLabel(passwordStrength.score)}
                </strong>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: `${(passwordStrength.score + 1) * 20}%`,
                      height: "3px",
                      backgroundColor:
                        passwordStrength.score === 4
                          ? "green"
                          : passwordStrength.score === 3
                          ? "blue"
                          : passwordStrength.score === 2
                          ? "yellow"
                          : passwordStrength.score === 1
                          ? "orange"
                          : "red",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-red-500">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <FaLockOpen className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 pl-10 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
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
      <Toast />
    </div>
  );
};

export default ChangePassword;
