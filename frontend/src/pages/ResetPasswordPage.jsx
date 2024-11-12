import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Toast } from "../components";
import { FaEye, FaEyeSlash, FaLock, FaChevronLeft } from "react-icons/fa";
import zxcvbn from "zxcvbn";
import logo from "../assets/logo.png";
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
    <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
      <div className="w-full max-w-md p-6 bg-background-light md:bg-white md:rounded-lg md:shadow-sm">
        {/* Back button */}
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 cursor-pointer"
        >
          <FaChevronLeft className="text-xl text-background-dark cursor-pointer" />
          <p className="text-background-dark text-lg font-semibold md:hidden">
            Back
          </p>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <form className="space-y-4" onSubmit={handleResetPassword}>
          {/* New Password Input */}
          <div>
            <div className="flex items-center border border-background-medium rounded-md focus-within:border-primary-medium">
              <FaLock className="h-6 w-6 ml-2 mr-1 text-primary-dark" />
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                className="w-full px-3 py-2 bg-white focus:outline-none"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              <span
                className="ml-2 mr-2 cursor-pointer text-[#557C55]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <FaEyeSlash className="text-lg text-background-medium" />
                ) : (
                  <FaEye className="text-lg text-background-medium" />
                )}
              </span>
            </div>

            {/* Password Strength Meter */}
            {newPassword.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-text-secondary">
                  Password Strength: {getStrengthLabel(passwordStrength.score)}
                </p>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#f5f5f5",
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
                          ? "#557C55"
                          : passwordStrength.score === 3
                          ? "#6495ED"
                          : passwordStrength.score === 2
                          ? "#f7dc6f"
                          : passwordStrength.score === 1
                          ? "#ffa500"
                          : "#ff3737",
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
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <div className="flex items-center border border-background-medium rounded-md focus-within:border-primary-medium">
              <FaLock className="h-6 w-6 ml-2 mr-1 text-primary-dark" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-3 py-2 bg-white focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="ml-2 mr-2 cursor-pointer text-[#557C55]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-lg text-background-medium" />
                ) : (
                  <FaEye className="text-lg text-background-medium" />
                )}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#557C55] text-white font-bold py-2 rounded-md hover:opacity-80 focus:outline-none"
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
