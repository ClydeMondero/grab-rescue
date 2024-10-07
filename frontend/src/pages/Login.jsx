import logo from "../../public/logo.png";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema } from "../models/Users";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { Loader, Toast } from "../components";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  //get query params
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  //show password
  const [showPassword, setShowPassword] = useState(false);

  //loading
  const [loading, setLoading] = useState(false);

  //navigate
  const navigate = useNavigate();

  //back button function
  const handleBack = () => {
    navigate("/", { replace: true });
  };

  //form validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
  });

  //handle form submission
  const onSubmit = (data) => {
    login(data);
  };

  //handle login
  const login = async ({ email, password }) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/auth/login",
        {
          email: email,
          password: password,
          role: role,
        },
        { withCredentials: true }
      );

      setLoading(false);

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/" + role.toLowerCase(), { replace: true });
        }, 1500);
      } else {
        if (data.error) {
          toast.error(data.message);
          console.error(data.error);
        } else {
          toast.warning(data.message);
        }
      }

      setLoading(false);

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="text-[#557C55] hover:text-red-600 transition-colors duration-200 ease-in-out flex items-center"
            onClick={handleBack}
          >
            <FaArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Back</span>
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-5 text-[#557C55]">
          Login as {role}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center border border-gray-300 rounded-md focus-within:border-[#557C55]">
            <FaEnvelope className="h-6 w-6 ml-2 mr-1 text-gray-600" />
            <input
              {...register("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-white focus:outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <div className="flex items-center border border-gray-300 rounded-md focus-within:border-[#557C55]">
            <FaLock className="h-6 w-6 ml-2 mr-1 text-gray-600" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-white focus:outline-none"
            />
            <span
              className="ml-2 mr-2 cursor-pointer text-[#557C55]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-6 w-6" />
              ) : (
                <FaEye className="h-6 w-6" />
              )}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-[#557C55] text-white font-bold py-2 rounded-md hover:opacity-80 focus:outline-none"
          >
            {loading ? <Loader {...{ isLoading: loading }} /> : "Login"}
          </button>
          <p className="text-center text-sm mt-2 text-[#557C55]">
            Forgot your password?{" "}
            <a
              href={`/forgot-password?role=${role}`}
              className="text-[#FA7070] hover:text-red-600 transition-colors duration-200 ease-in-out"
            >
              Reset it here
            </a>
          </p>
        </form>
        <Toast />
      </div>
    </div>
  );
};

export default Login;
