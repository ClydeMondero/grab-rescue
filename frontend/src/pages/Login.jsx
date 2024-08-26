import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-image-logo bg-cover w-full h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-[#557C55]">Welcome Back</h2>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-sm text-[#557C55]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#557C55]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-sm text-[#557C55]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#557C55]"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={handlePasswordToggle}
              >
                {showPassword ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-[#557C55] hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-[#557C55] text-white py-2 rounded-md hover:bg-[#6EA46E] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
