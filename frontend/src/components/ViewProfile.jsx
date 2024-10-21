import { useState, useEffect } from "react";
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createAuthHeader } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "../components";
import { barangaysData } from "../constants/Barangays"; // Imported barangaysData

const ViewProfile = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const [profile, setProfile] = useState(user);
  const [age, setAge] = useState(null); // Added state for age
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Extract municipalities from barangaysData
  const municipalities = Object.keys(barangaysData);

  useEffect(() => {
    calculateAge(profile.birthday);
  }, [profile]);

  // Function to calculate age based on birthday
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
    if (name === "birthday") calculateAge(value); // Update age on birthday change
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
    <>
      <div className="flex-1 p-2 md:p-4 h-full">
        {/* Back button and header */}
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="text-base md:text-lg text-[#557C55] cursor-pointer"
            onClick={() => {
              navigate(user.account_type === "Admin" ? "/admin" : "/rescuer");
            }}
          />
          <FaUser className="text-xl md:text-2xl text-[#557C55] mr-1" />
          <h4 className="text-sm md:text-lg font-semibold ml-1 text-[#557C55]">
            View Profile
          </h4>
        </div>

        {/* Main Profile Container */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-sm font-semibold text-[#557C55] mb-1">
              Profile Picture
            </h2>
            <div className="flex justify-center mb-2">
              <div className="relative">
                <img
                  src={profile.profile_image}
                  alt="Profile"
                  className="rounded-full w-24 h-24 object-cover border border-gray-300 shadow-md"
                />
                {/* Upload new picture */}
                <button className="absolute bottom-0 right-0 bg-[#557C55] text-white p-1 rounded-full hover:bg-[#6EA46E] transition shadow-md">
                  <FaEdit className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-sm font-semibold text-[#557C55] mb-3">
              Profile Information
            </h2>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
              <div>
                <span className="font-semibold text-[#557C55]">Username:</span>
                <p>{profile.username}</p>
              </div>
              <div>
                <span className="font-semibold text-[#557C55]">
                  First Name:
                </span>
                <p>{profile.first_name}</p>
              </div>
              <div>
                <span className="font-semibold text-[#557C55]">Last Name:</span>
                <p>{profile.last_name}</p>
              </div>
              {user.account_type === "Admin" && (
                <>
                  <div>
                    <span className="font-semibold text-[#557C55]">
                      Municipality:
                    </span>
                    <p>{profile.municipality}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#557C55]">
                      Barangay:
                    </span>
                    <p>{profile.barangay}</p>
                  </div>
                </>
              )}
              <div>
                <span className="font-semibold text-[#557C55]">
                  Contact Number:
                </span>
                <p>{profile.contact_number}</p>
              </div>
              <div>
                <span className="font-semibold text-[#557C55]">Birthday:</span>
                <p>
                  {profile.birthday
                    ? new Date(profile.birthday).toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#557C55]">Age:</span>
                <p>{age || "N/A"}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#557C55] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#6EA46E] transition flex items-center shadow-md"
              >
                <FaEdit className="mr-1 text-xs" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-4 w-full md:w-2/3 lg:w-1/2 max-h-[500px] overflow-y-auto rounded-lg shadow-lg">
              <FaTimes
                className="absolute top-2 right-2 text-[#557C55] hover:text-gray-700 cursor-pointer"
                onClick={() => setIsEditing(false)}
              />
              <div className="flex items-center mb-4">
                <FaUser className="mr-1 text-[#557C55]" />
                <h4 className="text-lg font-bold text-[#557C55]">
                  Edit Profile
                </h4>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-semibold text-[#557C55]"
                  >
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-xs font-semibold text-[#557C55]"
                    >
                      First Name:
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-xs font-semibold text-[#557C55]"
                    >
                      Last Name:
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                </div>

                {user.account_type === "Admin" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="municipality"
                        className="block text-xs font-semibold text-[#557C55]"
                      >
                        Municipality:
                      </label>
                      <select
                        id="municipality"
                        name="municipality"
                        value={profile.municipality}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      >
                        <option value="">Select Municipality</option>
                        {municipalities.map((municipality) => (
                          <option key={municipality} value={municipality}>
                            {municipality}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="barangay"
                        className="block text-xs font-semibold text-[#557C55]"
                      >
                        Barangay:
                      </label>
                      <select
                        id="barangay"
                        name="barangay"
                        value={profile.barangay}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      >
                        <option value="">Select Barangay</option>
                        {barangaysData[profile.municipality]?.map(
                          (barangay) => (
                            <option key={barangay} value={barangay}>
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
                    className="block text-xs font-semibold text-[#557C55]"
                  >
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    id="contact_number"
                    name="contact_number"
                    value={profile.contact_number}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthday"
                    className="block text-xs font-semibold text-[#557C55]"
                  >
                    Birthday:
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={profile.birthday}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#557C55] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#6EA46E] transition"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaSave className="mr-1" /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Toast />
    </>
  );
};

export default ViewProfile;
