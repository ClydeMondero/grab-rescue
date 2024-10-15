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
  FaChevronLeft,
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
    <div className="flex items-center justify-center h-screen bg-background-light">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between mb-4">
          <FaChevronLeft
            className="text-xl text-background-dark cursor-pointer"
            onClick={handleBack}
          />
        </div>
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-5 text-primary-dark">
          Login as {role}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center border border-background-medium rounded-md focus-within:border-primary-medium">
            <FaEnvelope className="h-6 w-6 ml-2 mr-1 text-primary-dark" />
            <input
              {...register("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
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
          <button
            type="submit"
            className="w-full bg-primary-medium text-white font-bold py-2 rounded-md hover:opacity-80 focus:outline-none"
          >
            {loading ? <Loader {...{ isLoading: loading }} /> : "Login"}
          </button>
          <a
            href={`/forgot-password?role=${role}`}
            className="text-[#FA7070] hover:text-red-600 transition-colors duration-200 ease-in-out"
          >
            <p className="text-center text-sm mt-2 text-text-secondary">
              Forgot your password?{" "}
            </p>
          </a>
        </form>
        <Toast />
      </div>
    </div>
  );
};

export default Login;
