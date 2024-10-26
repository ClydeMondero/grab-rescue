import React, { useContext, useState } from "react";
import { FaSave, FaEnvelope, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast, Loader } from "../components";
import { createAuthHeader } from "../services/authService";
import { RescuerContext } from "../contexts/RescuerContext";

const ChangeEmail = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const userId = user.id;

  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setPage =
    user.account_type === "Rescuer" ? useContext(RescuerContext).setPage : null;

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
      <div className="flex-1 p-6 h-100 bg-light flex flex-col items-center justify-center">
        <div className="w-full items-center gap-4 mb-6 hidden md:flex">
          <FaChevronLeft
            className="text-background-dark text-2xl cursor-pointer "
            onClick={() => {
              navigate(`/${user.account_type.toLowerCase()}`);
              setPage("Navigate");
            }}
          />
          <p className="text-3xl text-primary-dark font-bold">Change Email</p>
        </div>
        <div className="w-full max-w-md mx-auto bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold text-[#557C55] self-start mb-2">
            New Email
          </h2>
          <form className="space-y-2" onSubmit={handleSubmit}>
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

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#557C55] text-white px-6 py-4 rounded-md text-sm font-semibold hover:bg-[#6EA46E] transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader isLoading={isLoading} />
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
      </div>
    </>
  );
};

export default ChangeEmail;
