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
  const { user } = props; // Assume user is passed as a prop
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if the user is an Admin
  useEffect(() => {
    if (user.role === "Admin") {
      navigate("/admin");
    }
  }, [user.role, navigate]);

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
      const response = await axios.put(`/users/update/${profile.id}`, profile, {
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex-1 p-6 h-full bg-gray-100">
      {/* Back button and header */}
      <div className="flex items-center mb-6">
        <FaArrowLeft
          className="text-xl text-[#557C55] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <FaUser className="text-2xl sm:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-xl sm:text-2xl font-semibold ml-2 text-[#557C55]">
          View Profile
        </h4>
      </div>

      {/* Main Profile Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#557C55] mb-4">
            Profile Picture
          </h2>
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/path/to/profile-picture.jpg" // Change this to your profile picture source
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover"
              />
              {/* Upload new picture */}
              <button className="absolute bottom-0 right-0 bg-[#557C55] text-white p-2 rounded-full hover:bg-[#6EA46E] transition">
                <FaEdit />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#557C55] mb-4">
            Profile Information
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
            <dt className="font-semibold text-[#557C55]">Username:</dt>
            <dd>{profile.username}</dd>

            <dt className="font-semibold text-[#557C55]">First Name:</dt>
            <dd>{profile.first_name}</dd>

            <dt className="font-semibold text-[#557C55]">Last Name:</dt>
            <dd>{profile.last_name}</dd>

            {user.role === "Admin" && (
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
          <div className="mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#557C55] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6EA46E] transition flex items-center"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-2/3 md:w-2/3 lg:w-1/2 max-h-[500px] overflow-y-auto">
            <FaTimes
              className="absolute top-4 right-4 text-[#557C55] hover:text-gray-700 cursor-pointer"
              onClick={() => setIsEditing(false)}
            />
            <div className="flex items-center mb-4">
              <FaUser className="mr-2 text-[#557C55]" />
              <h4 className="text-lg font-bold text-[#557C55]">Edit Profile</h4>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
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

              {/* Common fields for both roles */}
              <div className="grid grid-cols-2 gap-4">
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

              {/* Only Admins should see these fields */}
              {user.role === "Admin" && (
                <>
                  <div>
                    <label
                      htmlFor="municipality"
                      className="block text-sm font-semibold text-[#557C55]"
                    >
                      Municipality:
                    </label>
                    <input
                      type="text"
                      id="municipality"
                      name="municipality"
                      value={profile.municipality}
                      onChange={handleProfileChange}
                      className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="barangay"
                      className="block text-sm font-semibold text-[#557C55]"
                    >
                      Barangay:
                    </label>
                    <input
                      type="text"
                      id="barangay"
                      name="barangay"
                      value={profile.barangay}
                      onChange={handleProfileChange}
                      className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                    />
                  </div>
                </>
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
                  value={profile.birthday}
                  onChange={handleProfileChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                />
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#557C55] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6EA46E] transition flex items-center"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
            <Toast />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
