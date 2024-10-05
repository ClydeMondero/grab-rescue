import { useState } from "react";
import { FaArrowLeft, FaSync, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));

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
    <div className="flex-1 p-3 h-100 bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft
          className="text-lg sm:text-xl text-[#557C55] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <FaKey className="text-2xl sm:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-xl sm:text-2xl font-semibold ml-2 text-[#557C55]">
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
                <FaEyeSlash
                  style={{ marginTop: "-40px" }}
                  size={20}
                  color="#557C55"
                />
              ) : (
                <FaEye
                  style={{ marginTop: "-40px" }}
                  size={20}
                  color="#557C55"
                />
              )}
            </button>
            {/* Password Strength Meter */}
            <div className="mt-2">
              <strong className="block text-xs sm:text-sm md:text-base font-semibold text-[#557C55]">
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
                    height: "5px",
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
                <ul className="text-sm text-red-500">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
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
        <Toast />
      </div>
    </div>
  );
};

export default ChangePassword;
