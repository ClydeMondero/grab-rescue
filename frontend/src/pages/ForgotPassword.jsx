import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Toast } from "../components";
import { FaChevronLeft, FaEnvelope } from "react-icons/fa";
import logo from "../../public/logo.png";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex items-center justify-center h-screen bg-background-light">
      <div className="w-full max-w-md p-6 bg-background-light md:bg-white md:rounded-lg md:shadow-sm">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 cursor-pointer"
        >
          <FaChevronLeft className="text-xl text-background-dark" />
          <p className="text-background-dark text-lg font-semibold md:hidden">
            Back
          </p>
        </div>
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-5 text-text-primary">
          {role === "Admin"
            ? "Admin Forgot Password"
            : "Rescuer Forgot Password"}
        </h2>
        <p className="text-center text-sm text-text-secondary mb-6">
          Enter your email address, and we will send you a link to reset your
          password.
        </p>
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <div className="flex items-center border border-background-medium rounded-md focus-within:border-primary-medium">
            <FaEnvelope className="h-6 w-6 ml-2 mr-1 text-primary-dark" />
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
                ? "bg-background-medium cursor-not-allowed"
                : "bg-primary-medium hover:opacity-80 cursor-pointer"
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
