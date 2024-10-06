import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Toast } from "../components";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import logo from "../../public/logo.png";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await (
        await axios.post("/users/forgot-password", { email })
      ).data;
      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="text-[#557C55] hover:text-red-600 transition-colors duration-200 ease-in-out flex items-center"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Back</span>
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
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
          <div className="flex items-center border border-gray-300 rounded-md focus-within:border-[#557C55]">
            <FaEnvelope className="h-6 w-6 ml-2 mr-1 text-gray-600" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white py-2 rounded-md font-bold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#557C55] hover:bg-[#6EA46E]"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <Toast />
      </div>
    </div>
  );
};

export default ForgotPassword;
