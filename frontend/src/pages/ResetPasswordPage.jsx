import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Toast } from "../components";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`/users/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });

      // Show success toast for 200 response
      toast.success(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to reset password.";

      // Show error toast for 400 and 404 status
      if (err.response) {
        if (err.response.status === 400) {
          toast.error(errorMessage); // Display the error message for 400 status
        } else if (err.response.status === 404) {
          toast.error(errorMessage); // Display the error message for 404 status
        } else {
          toast.error("Something went wrong. Please try again."); // General error toast
        }
      } else {
        toast.error("Network error. Please check your connection."); // Handle other cases
      }
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
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#557C55]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                {/* Toggle icon */}
              </button>
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
                {/* Toggle icon */}
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
