import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { MdPersonAdd } from "react-icons/md"; // New icon for AddRescuer
import axios from "axios";
import { toast } from "react-toastify";

const AddRescuer = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/rescuers/create", formData);
      toast.success("Rescuer added successfully:", response.message);
      console.log("Rescuer added successfully:", response.data);
      // Handle success, reset form or redirect as needed
    } catch (error) {
      console.error("Error adding rescuer:", error);
      toast.error("Error adding rescuer. Please try again.");
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
        <form className="space-y-2 sm:space-y-4" onSubmit={handleSubmit}>
          {/* Profile Picture Section (commented out) */}
          {/* <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <img
                src={
                  rescuer.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#557C55]"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 p-1 sm:p-2 bg-[#557C55] text-white rounded-full cursor-pointer"
              >
                <span className="sr-only">Change Profile Picture</span>
                <input
                  type="file"
                  id="profile-picture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <MdAdd className="w-4 h-4 sm:w-6 sm:h-6" />
              </label>
            </div>
          </div> */}

          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {/* Form Fields */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label
                htmlFor="middleInitial"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Middle Name:
              </label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label
                htmlFor="birthday"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Birthday:
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
              />
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Age:
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                readOnly
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Age"
              />
            </div>
            <div>
              <label
                htmlFor="municipality"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Municipality:
              </label>
              <input
                type="text"
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter municipality"
              />
            </div>
            <div>
              <label
                htmlFor="barangay"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Barangay:
              </label>
              <input
                type="text"
                id="barangay"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter barangay"
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter Username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-semibold text-[#557C55]"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-[#557C55] text-white rounded-md hover:bg-[#3c5e3c] focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
            >
              <FaSave className="mr-2" />
              Save Rescuer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRescuer;
