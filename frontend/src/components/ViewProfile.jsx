import { useState, useEffect } from "react";
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createAuthHeader } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "../components";
import { barangaysData } from "../constants/Barangays";

const ViewProfile = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const [profile, setProfile] = useState(user);
  const [age, setAge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const municipalities = Object.keys(barangaysData);

  useEffect(() => {
    calculateAge(profile.birthday);
  }, [profile]);

  const calculateAge = (birthday) => {
    if (!birthday) return;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    setAge(age);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    if (name === "birthday") calculateAge(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authHeader = createAuthHeader();
      const response = await (
        await axios.put(`/users/update/${profile.id}`, profile, {
          headers: {
            ...authHeader,
            "Content-Type": "application/json",
          },
        })
      ).data;

      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto max-h-full">
        <div className="flex items-center mb-8">
          <FaUser className="text-xl md:text-2xl text-[#557C55] mr-3" />
          <h4 className="text-md sm:text-xl lg:text-2xl font-semibold text-[#557C55]">
            Profile Overview
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-md p-4 col-span-full">
            <h2 className="block text-xs sm:text-xl font-semibold text-[#557C55]pb-2">
              Profile Details
            </h2>
            <div className="grid grid-cols-1 gap-4 text-base">
              <div className="flex justify-between border-b border-warning">
                <span className="font-semibold text-primary">Username:</span>
                <p className="text-right font-semibold text-primary-dark">
                  {profile.username}
                </p>
              </div>
              <div className="flex justify-between border-b border-warning">
                <span className="font-semibold text-primary">First Name:</span>
                <p className="text-right font-semibold text-primary-dark">
                  {profile.first_name}
                </p>
              </div>
              <div className="flex justify-between border-b border-warning">
                <span className="font-semibold text-primary">Last Name:</span>
                <p className="text-right font-semibold text-primary-dark">
                  {profile.last_name}
                </p>
              </div>
              {user.account_type === "Admin" && (
                <>
                  <div className="flex justify-between border-b border-warning">
                    <span className="font-semibold text-primary">
                      Municipality:
                    </span>
                    <p className="text-right font-semibold text-primary-dark">
                      {profile.municipality}
                    </p>
                  </div>
                  <div className="flex justify-between border-b border-warning">
                    <span className="font-semibold text-primary">
                      Barangay:
                    </span>
                    <p className="text-right font-semibold text-primary-dark">
                      {profile.barangay}
                    </p>
                  </div>
                </>
              )}
              <div className="flex justify-between border-b border-warning">
                <span className="font-semibold text-primary">
                  Contact Number:
                </span>
                <p className="text-right font-semibold text-primary-dark">
                  {profile.contact_number}
                </p>
              </div>
              <div className="flex justify-between border-b border-warning">
                <span className="font-semibold text-primary">Birthday:</span>
                <p className="text-right font-semibold text-primary-dark">
                  {profile.birthday
                    ? new Date(profile.birthday).toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div className="flex justify-between border-b border-warning">
                <span className="font-semibold text-primary">Age:</span>
                <p className="text-right font-semibold text-primary-dark">
                  {profile.age || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary-medium text-white px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-primary transition flex items-center justify-center"
              >
                <FaEdit className="mr-2 text-lg" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 w-full md:w-2/3 lg:w-1/2 max-h-[600px] overflow-y-auto rounded-lg shadow-xl">
              <FaTimes
                className="absolute top-3 right-3 text-[#557C55] hover:text-gray-700 cursor-pointer"
                onClick={() => setIsEditing(false)}
              />
              <div className="flex items-center mb-6">
                <FaUser className="mr-2 text-[#557C55]" />
                <h4 className="text-xl font-bold text-[#557C55]">
                  Edit Profile
                </h4>
              </div>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-[#557C55]"
                  >
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-semibold text-[#557C55]"
                    >
                      First Name:
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-semibold text-[#557C55]"
                    >
                      Last Name:
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                </div>

                {user.account_type === "Admin" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={profile.municipality}
                        onChange={handleProfileChange}
                        className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      >
                        <option value="">Select Municipality</option>
                        {municipalities.map((municipality, index) => (
                          <option key={index} value={municipality}>
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
                        value={profile.barangay}
                        onChange={handleProfileChange}
                        className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      >
                        <option value="">Select Barangay</option>
                        {profile.municipality &&
                          barangaysData[profile.municipality].map(
                            (barangay, index) => (
                              <option key={index} value={barangay}>
                                {barangay}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contact_number"
                    className="block text-sm font-semibold text-[#557C55]"
                  >
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    id="contact_number"
                    name="contact_number"
                    value={profile.contact_number}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthday"
                    className="block text-sm font-semibold text-[#557C55]"
                  >
                    Birthday:
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={profile.birthday || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#6EA46E] transition flex items-center shadow-md"
                  >
                    {loading ? (
                      <>
                        <span className="loader"></span> Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2 text-xs" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
};

export default ViewProfile;
