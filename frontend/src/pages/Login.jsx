import logo from "../assets/logo.png";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema } from "../models/Users";
import { useContext, useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
} from "react-icons/fa";
import { Loader, Toast } from "../components";
import axios from "axios";
import { toast } from "react-toastify";
import { StatusContext } from "../contexts/StatusContext";
import { updateLocationStatus } from "../services/firestoreService";

const Login = () => {
  // Get query params
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  // Show password state
  const [showPassword, setShowPassword] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  const { id } = useContext(StatusContext);

  // Navigation
  const navigate = useNavigate();

  // Back button function
  const handleBack = () => {
    navigate("/", { replace: true });
  };

  // Form validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
  });

  // Handle form submission
  const onSubmit = (data) => {
    login(data);
  };

  // Handle login
  const login = async ({ email, password }) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/auth/login",
        {
          email: email, // Use the email/username input here
          password: password,
          role: role,
        },
        { withCredentials: true }
      );

      setLoading(false);

      if (data.success) {
        toast.success(data.message);
        updateLocationStatus(id, "offline");
        setTimeout(() => {
          window.location = "/" + role.toLowerCase();
        }, 1500);
      } else {
        toast[data.error ? "error" : "warning"](data.message);
      }

      reset();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background-light">
      <div className="w-full max-w-md p-6 bg-background-light md:bg-white md:rounded-lg md:shadow-sm">
        <div
          onClick={handleBack}
          className="flex items-center gap-2 mb-10  cursor-pointer"
        >
          <FaChevronLeft className="text-xl text-background-dark" />
          <p className="text-background-dark text-lg font-semibold md:hidden">
            Back
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center border border-background-medium rounded-md focus-within:border-primary-medium">
            <FaEnvelope className="h-6 w-6 ml-2 mr-1 text-primary-dark" />
            <input
              {...register("email")}
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email or username"
              className="w-full px-3 py-2 bg-background focus:outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <div className="flex items-center border border-background-medium rounded-md focus-within:border-primary-medium">
            <FaLock className="h-6 w-6 ml-2 mr-1 text-primary-dark" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-white focus:outline-none"
            />
            <span
              className="ml-2 mr-2 cursor-pointer text-background-dark"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg text-background-medium" />
              ) : (
                <FaEye className="text-lg text-background-medium" />
              )}
            </span>
          </div>
          <p className="text-xs p-2 text-background-medium text-center gap-2">
            By continuing, you agree to our{" "}
            <Link
              to="/privacy-policy"
              className="underline text-background-dark"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-of-service"
              className="underline text-background-dark"
            >
              Terms of Service
            </Link>
          </p>
          <button
            type="submit"
            className="w-full bg-primary-medium text-white font-bold py-2 rounded-md hover:opacity-80 focus:outline-none"
          >
            {loading ? <Loader isLoading={loading} size={25} /> : "Login"}
          </button>
          <div
            onClick={() => navigate(`/forgot-password?role=${role}`)}
            className="cursor-pointer"
          >
            <p className="text-center text-sm mt-2 text-text-secondary">
              Forgot your password?{" "}
            </p>
          </div>
        </form>
        <Toast />
      </div>
    </div>
  );
};

export default Login;
