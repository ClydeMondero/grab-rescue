import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure styles are imported
import { data } from "autoprefixer";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading state

    try {
      const response = await axios.post("/users/forgot-password", { email });
      toast.success(response.data.message);
      console.log(response.data.message); // Show success message
    } catch (err) {
      // Handle error and show error message
      toast.error(err.response?.data?.error || "Failed to send reset link.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="bg-image-logo bg-cover w-full h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-[#A0D9A4] hover:text-[#557C55]"
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
              required // Added required for validation
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white py-2 rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#557C55] hover:bg-[#6EA46E]"
            }`}
            disabled={loading} // Disable button during loading
          >
            {loading ? "Sending..." : "Send Reset Link"}{" "}
            {/* Change button text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
