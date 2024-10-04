import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const ChangeEmail = () => {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentEmail = async () => {
      try {
        const { data } = await axios.get("/users/email", {
          withCredentials: true,
        });

        if (data.success) {
          setCurrentEmail(data.email);
        } else {
          setError(data.error);
          toast.error(data.error);
        }
      } catch (error) {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      }
    };

    fetchCurrentEmail();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        "/users/email",
        { email },
        { withCredentials: true }
      );

      if (data.success) {
        setSuccess(true);
        setError("");
        toast.success("Email changed successfully!");
      } else {
        setError(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      setError(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="flex-1 p-3 h-100 bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft
          className="text-lg sm:text-xl text-[#557C55] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h4 className="text-md sm:text-lg font-semibold ml-2 text-[#557C55]">
          Change Email
        </h4>
      </div>
      <div className="flex-1 bg-white rounded-lg p-3">
        <p className="text-sm sm:text-md mb-3 font-semibold text-[#557C55]">
          Update your email:
        </p>
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
                value={currentEmail}
                disabled
                className="w-full p-3 pl-10 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your new email"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your new email"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
          {success && (
            <p className="text-green-500 text-xs sm:text-sm">
              Email changed successfully!
            </p>
          )}
          <button
            type="submit"
            className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
          >
            Change Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmail;
