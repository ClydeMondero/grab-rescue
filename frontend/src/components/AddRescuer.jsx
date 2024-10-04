import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md"; // New icon for AddRescuer
import axios from "axios";
import { toast } from "react-toastify";
import { barangaysData } from "../constants/Barangays";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Toast } from "../components";
import "react-toastify/dist/ReactToastify.css";

const AddRescuer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    // Check if formData contains all required fields
    console.log("Form data before submission:", formData);

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

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(
          `Please fill out the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field.`
        );
        setLoading(false); // Stop loading state on error
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false); // Stop loading state on error
      return;
    }

    try {
      const response = await axios.post("/rescuers/create", formData);
      toast.success(response.data.message); // Display success message
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.status === 400) {
          toast.error(error.response.data.error); // Show the error message from the server
        } else if (error.response.status === 404) {
          toast.error("Resource not found. Please check the entered data."); // Custom message for 404
        } else {
          toast.error("An unexpected error occurred. Please try again."); // General error message
        }
      } else {
        toast.error("Network error. Please check your connection."); // Handle network errors
      }
    } finally {
      setLoading(false); // Ensure loading state is reset in all cases
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
                Middle Name:
              </label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                placeholder="Middle name"
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
                    <AiFillEyeInvisible className="text-gray-400" />
                  ) : (
                    <AiFillEye className="text-gray-400" />
                  )}
                </div>
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
                    <AiFillEyeInvisible className="text-gray-400" />
                  ) : (
                    <AiFillEye className="text-gray-400" />
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
              disabled={loading} // Disable the button when loading
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
      <Toast /> {/* Include Toast notification component */}
    </div>
  );
};

export default AddRescuer;
