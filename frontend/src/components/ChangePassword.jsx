import { useContext, useState } from "react";
import {
  FaSave,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaChevronLeft,
} from "react-icons/fa"; // Import icons for password fields
import { useNavigate } from "react-router-dom";
import { createAuthHeader } from "../services/authService";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast, Loader } from "../components";
import zxcvbn from "zxcvbn"; // Import zxcvbn for password strength
import { RescuerContext } from "../contexts/RescuerContext";

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
  const [isLoading, setIsLoading] = useState(false);

  const setPage =
    user.account_type === "Rescuer" ? useContext(RescuerContext).setPage : null;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));

    // Show password meter only when user starts typing in the field
    if (name === "newPassword" && value.length > 0) {
      setShowPasswordMeter(true);
    } else {
      setShowPasswordMeter(false);
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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    <div className="flex-1 p-6 h-full flex flex-col items-center">
      <div className="w-full items-center gap-4 mb-6 hidden md:flex border-b-2 pb-2 border-gray-200">
        <FaChevronLeft
          className="text-background-dark text-2xl cursor-pointer "
          onClick={() => {
            navigate(`/${user.account_type.toLowerCase()}`);
            setPage("Navigate");
          }}
        />
        <p className="text-3xl text-primary-dark font-bold">Change Password</p>
      </div>
      <div className="w-full bg-white rounded-lg p-4 md:w-1/2">
        <p className="text-lg mb-3 font-semibold text-[#557C55]">
          Update your password
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Current Password Field */}
          <div className="relative ">
            <FaLock className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 pl-10 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("currentPassword")}
            >
              {showPasswords.currentPassword ? (
                <FaEyeSlash className="text-lg text-background-medium" />
              ) : (
                <FaEye className="text-lg text-background-medium" />
              )}
            </button>
          </div>

          {/* New Password Field */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 pl-10 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
              placeholder="Enter a new password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPasswords.newPassword ? (
                <FaEyeSlash className="text-lg text-background-medium" />
              ) : (
                <FaEye className="text-lg text-background-medium" />
              )}
            </button>
          </div>

          {/* Password Strength Meter */}
          {showPasswordMeter && (
            <div className="mt-3">
              <strong className="block text-xs sm:text-sm font-semibold text-[#557C55]">
                Password Strength: {getStrengthLabel(passwordStrength.score)}
              </strong>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                  marginTop: "5px",
                  height: "3px",
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
                <ul className="text-xs text-red-500 mt-2">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 pl-10 pr-12 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 flex items-center justify-center"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPasswords.confirmPassword ? (
                <FaEyeSlash className="text-lg text-background-medium" />
              ) : (
                <FaEye className="text-lg text-background-medium" />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#557C55] text-white px-6 py-4 rounded-md text-sm font-semibold hover:bg-[#6EA46E] transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader isLoading={isLoading} size={25} />
              ) : (
                <div className="flex items-center gap-2 font-bold">
                  <FaSave />
                  Save
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default ChangePassword;
