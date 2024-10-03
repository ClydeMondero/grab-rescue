import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/users/forgot-password", {
        email,
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link.");
    }
  };

  return (
    <div className="bg-image-logo bg-cover w-full h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-[#FA7070] hover:text-red-600"
        >
          &larr; Back to Login
        </button>
        <h2 className="text-center text-2xl font-semibold mb-5 text-[#557C55]">
          {role === "Admin"
            ? "Admin Forgot Password"
            : "Rescuer Forgot Password"}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your email address, and we will send you a link to reset your
          password.
        </p>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-[#557C55]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#557C55]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#557C55] text-white py-2 rounded-md hover:bg-[#6EA46E]"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
