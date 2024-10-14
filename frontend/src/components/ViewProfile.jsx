import { useState, useEffect } from "react";
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createAuthHeader } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "../components";

const ViewProfile = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Remove the redirect for Admin users
  useEffect(() => {
    console.log(profile);
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
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
    <div className="flex-1 p-2 md:p-4 h-full">
      {/* Back button and header */}
      <div className="flex items-center mb-2 md:mb-4">
        <FaArrowLeft
          className="text-base md:text-lg text-[#557C55] cursor-pointer"
          onClick={() => {
            if (user.account_type === "Admin") {
              navigate("/admin");
            } else if (user.account_type === "Rescuer") {
              navigate("/rescuer");
            }
          }}
        />
        <FaUser className="text-xl md:text-2xl text-[#557C55] mr-1" />
        <h4 className="text-sm md:text-lg font-semibold ml-1 text-[#557C55]">
          View Profile
        </h4>
      </div>

      {/* Main Profile Container */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg p-2 md:p-4 ">
          <h2 className="text-xs md:text-sm font-bold text-[#557C55] mb-1">
            Profile Picture
          </h2>
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/path/to/profile-picture.jpg" // Change this to your profile picture source
                alt="Profile"
                className="rounded-full w-20 md:w-32 h-20 md:h-32 object-cover border border-gray-300 shadow-md"
              />
              {/* Upload new picture */}
              <button className="absolute bottom-0 right-0 bg-[#557C55] text-white p-1 md:p-2 rounded-full hover:bg-[#6EA46E] transition shadow-md">
                <FaEdit className="text-xs md:text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-lg p-2 md:p-4 ">
          <h2 className="text-xs md:text-sm font-bold text-[#557C55] mb-1">
            Profile Information
          </h2>
          <dl className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 text-xs text-gray-700">
            <dt className="font-semibold text-[#557C55]">Username:</dt>
            <dd>{profile.username}</dd>

            <dt className="font-semibold text-[#557C55]">First Name:</dt>
            <dd>{profile.first_name}</dd>

            <dt className="font-semibold text-[#557C55]">Last Name:</dt>
            <dd>{profile.last_name}</dd>

            {user.account_type === "Admin" && (
              <>
                <dt className="font-semibold text-[#557C55]">Municipality:</dt>
                <dd>{profile.municipality}</dd>

                <dt className="font-semibold text-[#557C55]">Barangay:</dt>
                <dd>{profile.barangay}</dd>
              </>
            )}

            <dt className="font-semibold text-[#557C55]">Contact Number:</dt>
            <dd>{profile.contact_number}</dd>

            <dt className="font-semibold text-[#557C55]">Birthday:</dt>
            <dd>
              {profile.birthday
                ? new Date(profile.birthday).toLocaleDateString()
                : ""}
            </dd>
          </dl>

          {/* Edit Profile Button */}
          <div className="mt-2 md:mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#557C55] text-white px-2 py-1 md:px-3 md:py-2 rounded-md text-xs font-semibold hover:bg-[#6EA46E] transition flex items-center shadow-md"
            >
              <FaEdit className="mr-1" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-2 md:p-4 w-full md:w-2/3 lg:w-1/2 max-h-[500px] overflow-y-auto rounded-lg shadow-lg">
            <FaTimes
              className="absolute top-2 right-2 text-[#557C55] hover:text-gray-700 cursor-pointer"
              onClick={() => setIsEditing(false)}
            />
            <div className="flex items-center mb-2 md:mb-4">
              <FaUser className="mr-1 md:mr-2 text-[#557C55]" />
              <h4 className="text-sm md:text-lg font-bold text-[#557C55]">
                Edit Profile
              </h4>
            </div>
            <form className="space-y-1 md:space-y-2" onSubmit={handleSubmit}>
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
                  className="w-full p-1 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                />
              </div>

              {/* Common fields for both roles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
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
                    className="w-full p-1 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
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
                    className="w-full p-1 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>
              </div>

              {/* Only Admins should see these fields */}
              {user.account_type === "Admin" && (
                <>
                  <div>
                    <label
                      htmlFor="municipality"
                      className="block text-xs font-semibold text-[#557C55]"
                    >
                      Municipality:
                    </label>
                    <input
                      type="text"
                      id="municipality"
                      name="municipality"
                      value={profile.municipality}
                      onChange={handleProfileChange}
                      className="w-full p-1 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="barangay"
                      className="block text-xs font-semibold text-[#557C55]"
                    >
                      Barangay:
                    </label>
                    <input
                      type="text"
                      id="barangay"
                      name="barangay"
                      value={profile.barangay}
                      onChange={handleProfileChange}
                      className="w-full p-1 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                </>
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
                  className="w-full p-1 border rounded-lg bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#557C55] text-white px-2 py-1 rounded-md text-xs font-semibold hover:bg-[#6EA46E] transition flex items-center shadow-md"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}{" "}
                  <FaSave className="ml-1" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toast />
    </div>
  );
};

export default ViewProfile;
