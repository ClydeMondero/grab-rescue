import React, { useState } from "react";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "../components";
import { createAuthHeader } from "../services/authService";

const ChangeEmail = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const userId = user.id;
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      email: newEmail,
    };

    try {
      const response = await (
        await axios.put(
          `/users/updateEmail/${userId}`,
          data,
          createAuthHeader()
        )
      ).data;

      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
      console.log("Response message:", response.message);

      // Clear the email fields
      setNewEmail("");
      setError("");
      navigate(
        user.account_type === "Admin"
          ? "/admin/viewProfile"
          : "/rescuer/profile"
      );
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast />
      <div className="flex-1 p-3 h-full flex flex-col">
        <div className="flex items-center mb-2">
          <MdMarkEmailRead className="text-2xl sm:text-3xl text-[#557C55] mr-2" />
          <h4 className="text-md sm:text-xl lg:text-2xl font-semibold text-[#557C55]">
            Change Email
          </h4>
        </div>
        <div className="flex-1 bg-white rounded-lg p-3">
          <form className="space-y-2" onSubmit={handleSubmit}>
            {/* Show current email only if the role is not rescuer */}
            {user.account_type !== "Rescuer" && (
              <div className="relative">
                <label
                  htmlFor="current-email"
                  className="block text-xs sm:text-sm font-semibold text-[#557C55]"
                >
                  Current Email:
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope
                    className="absolute left-3 text-gray-600"
                    size={20}
                  />
                  <input
                    type="email"
                    id="current-email"
                    value={user.email}
                    disabled
                    className="w-full p-3 pl-10 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                    placeholder="Enter your current email"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <div className="relative flex items-center">
                <FaEnvelope
                  className="absolute left-3 text-gray-600"
                  size={20}
                />
                <input
                  type="email"
                  id="new-email"
                  name="newEmail"
                  value={newEmail}
                  onChange={handleEmailChange}
                  className="w-full p-3 pl-10 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                  placeholder="Enter your new email"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs sm:text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="bg-primary-medium text-white px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-primary transition flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FFFFFF] mr-2"></div>
              ) : (
                "Change Email"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangeEmail;
