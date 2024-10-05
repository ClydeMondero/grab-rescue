import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Toast } from "../components";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import zxcvbn from "zxcvbn"; // Import zxcvbn
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await (
        await axios.post(`/users/reset-password/${token}`, {
          newPassword,
          confirmPassword,
        })
      ).data;

      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    // Update password strength on input change
    const result = zxcvbn(value);
    setPasswordStrength(result);
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
    <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold mb-5 text-[#557C55]">
          Reset Your Password
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Please enter a new password.
        </p>
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-1 font-semibold text-[#557C55]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#557C55]"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#557C55]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </button>
            </div>
            {/* Password Strength Meter */}
            <div className="mt-2">
              <strong className="text-sm text-[#557C55]">
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-semibold text-[#557C55]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#557C55]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#557C55]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#557C55] text-white py-2 rounded-md hover:bg-[#6EA46E]"
          >
            Reset Password
          </button>
        </form>
        <Toast />
      </div>
    </div>
  );
};

export default ResetPassword;
