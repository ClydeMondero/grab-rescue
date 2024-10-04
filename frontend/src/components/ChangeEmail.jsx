import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
      // Sending PUT request to update email
      const response = await axios.put(
        `/users/updateEmail/${userId}`,
        data,
        createAuthHeader()
      );
      toast.success(response.data.message); // Success toast

      // Clear the email fields
      setNewEmail("");
      setError(""); // Clear any previous errors
      navigate("/admin/viewProfile");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);

        // Handle specific error codes
        if (error.response.status === 400) {
          toast.error(error.response.data.error); // Bad Request error (400)
        } else if (error.response.status === 404) {
          toast.error("Not Found: User does not exist"); // Not Found error (404)
        } else {
          toast.error(error.response.data.message); // Other errors
        }
      } else {
        console.error("Error:", error.message);
        toast.error("Something went wrong"); // Fallback error
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-3 h-100 bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft
          className="text-lg sm:text-xl text-[#557C55] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <MdMarkEmailRead className="text-2xl sm:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-xl sm:text-2xl font-semibold ml-2 text-[#557C55]">
          Change Email
        </h4>
      </div>
      <div className="flex-1 bg-white rounded-lg p-3">
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="relative">
            <label
              htmlFor="current-email"
              className="block text-xs sm:text-sm font-semibold text-[#557C55]"
            >
              Current Email:
            </label>
            <div className="relative flex items-center">
              <FaEnvelope
                className="absolute left-3 text-[#557C55]"
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

          <div className="relative">
            <label
              htmlFor="new-email"
              className="block text-xs sm:text-sm font-semibold text-[#557C55]"
            >
              New Email:
            </label>
            <div className="relative flex items-center">
              <FaEnvelope
                className="absolute left-3 text-[#557C55]"
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

          {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
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
  );
};

export default ChangeEmail;
