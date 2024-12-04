import { useState } from "react";
import { FaEye, FaEyeSlash, FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn"; // Import zxcvbn
import "react-toastify/dist/ReactToastify.css";
import { createAuthHeader } from "../services/authService";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { barangaysData } from "../constants/Barangays";
import { Toast } from "../components";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Step tracker
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
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
    return monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
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

  const handleNext = () => {
    // Basic validation for required fields in the current step
    const validationRules = {
      1: [
        "firstName",
        "middleName",
        "lastName",
        "birthday",
        "municipality",
        "barangay",
      ],
      2: ["contactNumber", "email", "username"],
      3: ["password", "confirmPassword"],
    };

    const fieldsToValidate = validationRules[currentStep];
    const invalidFields = fieldsToValidate.filter((field) => !formData[field]);

    if (invalidFields.length > 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Move to the next step
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/", { replace: true });
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/citizens/register", formData, {
        ...createAuthHeader(),
        withCredentials: true,
      });

      if (!response.data.success) throw new Error(response.data.message);

      toast.success(response.data.message);
      setFormData({
        firstName: "",
        middleName: "",
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

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            {/* Fields for Step 1 */}
            <div className="flex flex-col gap-2">
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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                  placeholder="First name"
                />
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-[#557C55]"
                >
                  Middle Initial:
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
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
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
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
            </div>

            {/* Add other Step 1 fields */}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            {/* Fields for Step 1 */}
            <div className="flex flex-col gap-2">
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
                  maxLength={11}
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
            </div>

            {/* Add other Step 1 fields */}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Passwords</h2>
            {/* Fields for Step 1 */}
            <div className="flex flex-col gap-2">
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
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#557C55] focus:border-[#557C55] transition"
                    placeholder="Password"
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-lg text-background-medium" />
                    ) : (
                      <FaEye className="text-lg text-background-medium" />
                    )}
                  </span>
                </div>
                {/* Conditionally render the password strength meter */}
                {isPasswordFocused && formData.password && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      Password Strength:{" "}
                      <strong>
                        {getStrengthLabel(passwordStrength.score)}
                      </strong>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-full rounded-full ${
                          passwordStrength.score === 0
                            ? "bg-red-500"
                            : passwordStrength.score === 1
                            ? "bg-orange-500"
                            : passwordStrength.score === 2
                            ? "bg-yellow-500"
                            : passwordStrength.score === 3
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
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
                    placeholder="Confirm Password"
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-lg text-background-medium" />
                    ) : (
                      <FaEye className="text-lg text-background-medium" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Add other Step 1 fields */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-8">
        <img src={logo} alt="Logo" />
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
          >
            {currentStep === 1 ? "Back to Home" : "Back"}
          </button>
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>

      <Toast />
    </div>
  );
};

export default Register;
