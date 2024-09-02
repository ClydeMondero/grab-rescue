import logo from "../assets/logo.png";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema } from "../models/Users";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader } from "../components";
import axios from "axios";

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
        },
        { withCredentials: true }
      );

      if (data.success) {
        setLoading(false);

        if (role == data.role) {
          //TODO: show toast for successful login
          navigate("/" + role.toLowerCase(), { replace: true });
        } else {
          //TODO: show toast for role mismatch

          console.log("Role mismatch");

          navigate("/");
        }

        //TODO: show toast for failed login
      }

      setLoading(false);

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-md w-full  bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-24" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-5">
          Login as {role}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-sm text-[#557C55]"
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#557C55]"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 font-semibold text-sm text-[#557C55]"
            >
              Password
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#557C55]"
            />
            <span
              className="absolute top-12 right-3 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-red-400 text-white font-bold py-2 rounded-md hover:opacity-80 focus:outline-none"
          >
            {loading ? <Loader {...{ isLoading: loading }} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
