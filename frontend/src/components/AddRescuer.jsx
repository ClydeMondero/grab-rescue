import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { barangaysData } from "../constants/Barangays";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Toast } from "../components";
import zxcvbn from "zxcvbn"; // Import zxcvbn
import "react-toastify/dist/ReactToastify.css";

const AddRescuer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    birthday: "",
    municipality: "",
    barangay: "",
    contactNumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
  });

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      const age = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        age: age,
      }));
    } else if (name === "password") {
      // Update password strength on password input change
      const result = zxcvbn(value);
      setPasswordStrength(result);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleInitial: "",
      lastName: "",
      birthday: "",
      municipality: "",
      barangay: "",
      contactNumber: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      age: "",
    });
    setPasswordStrength({ score: 0, feedback: [] }); // Reset password strength
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    const requiredFields = [
      "firstName",
      "lastName",
      "municipality",
      "barangay",
      "contactNumber",
      "email",
      "age",
      "username",
      "password",
      "confirmPassword",
    ];

    try {
      const response = await (
        await axios.post("/rescuers/create", formData)
      ).data;
      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
      resetForm();
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 lg:p-6 h-full bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="flex items-center mb-2 sm:mb-4">
        <MdPersonAdd className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-sm sm:text-md lg:text-lg font-semibold text-[#557C55]">
          Add Rescuer
        </h4>
      </div>
      {/* Add Rescuer Form */}
      <div className="flex-1 bg-white rounded-md p-4 sm:p-6 lg:p-8">
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Form Fields */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-[#557C55]"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="First name"
              />
            </div>
            <div>
              <label
                htmlFor="middleInitial"
                className="block text-sm font-medium text-[#557C55]"
              >
                Middle Initial:
              </label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Middle Initial"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-[#557C55]"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Last name"
              />
            </div>
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-[#557C55]"
              >
                Birthday:
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
              />
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-[#557C55]"
              >
                Age:
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                readOnly
                className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Age"
              />
            </div>
            <div>
              <label
                htmlFor="municipality"
                className="block text-sm font-semibold text-[#557C55]"
              >
                Municipality:
              </label>
              <select
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
              >
                <option value="">Select Municipality</option>
                {Object.keys(barangaysData).map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="barangay"
                className="block text-sm font-semibold text-[#557C55]"
              >
                Barangay:
              </label>
              <select
                id="barangay"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
              >
                <option value="">Select Barangay</option>
                {barangaysData[formData.municipality]?.map((barangay) => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-[#557C55]"
              >
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#557C55]"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#557C55]"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#557C55]"
              >
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                  placeholder="Enter password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-[#557C55]" />
                  ) : (
                    <AiFillEye className="text-[#557C55]" />
                  )}
                </div>
              </div>
              {/* Password Strength Meter */}
              <div className="mt-2">
                <strong className="text-sm text-[#557C55]">
                  Password Strength: {getStrengthLabel(passwordStrength.score)}
                </strong>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: `${(passwordStrength.score + 1) * 20}%`,
                      height: "5px",
                      backgroundColor:
                        passwordStrength.score === 4
                          ? "green"
                          : passwordStrength.score === 3
                          ? "blue"
                          : passwordStrength.score === 2
                          ? "yellow"
                          : passwordStrength.score === 1
                          ? "orange"
                          : "red",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-sm text-red-500">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#557C55]"
              >
                Confirm Password:
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                  placeholder="Confirm password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <AiFillEyeInvisible className="text-[#557C55]" />
                  ) : (
                    <AiFillEye className="text-[#557C55]" />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 text-white bg-[#557C55] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e5f2e] transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Rescuer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default AddRescuer;
