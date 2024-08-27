import logo from "../assets/logo.png";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema } from "../models/Users";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  //get query params
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  //show password
  const [showPassword, setShowPassword] = useState(false);

  //form validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
  });

  //handle form submission
  const onSubmit = (data) => {
    console.log(data);
    reset();
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
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <div className="relative">
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
            className="w-full bg-red-400 text-white font-bold py-2 rounded-md hover:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
