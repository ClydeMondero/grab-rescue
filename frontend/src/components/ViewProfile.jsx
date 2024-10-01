import { useState, useEffect } from 'react';
import { FaArrowLeft, FaSave } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createAuthHeader } from '../services/authService'; // Assuming you have a token-based auth service
import { barangaysData } from "../constants/Barangays";

const ViewProfile = (props) => {
  const navigate = useNavigate();
  const { user } = props; // Destructuring user from props
  const [profile, setProfile] = useState(user); // Initialize state with user props
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  // Handle input changes for profile fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authHeader = createAuthHeader(); // Assuming this adds an authorization header
      const response = await axios.put(
        `/admins/update/${profile.id}`, // Send profile id in the API URL
        profile,
        {
          headers: {
            ...authHeader,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-3 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft className="text-lg sm:text-xl text-[#557C55] cursor-pointer" onClick={() => navigate(-1)} />
        <h4 className="text-md sm:text-lg font-semibold ml-2 text-[#557C55]">View Profile</h4>
      </div>
      <div className="flex flex-col space-y-4">
        {/* Profile Picture Section */}
        {/*
        <div className="flex-shrink-0 w-full bg-white rounded-lg p-3 flex flex-col items-center">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-24 h-24 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#557C55] mb-2"
          />
          <input
            type="file"
            id="profile-picture"
            name="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="mb-2 w-full text-xs sm:text-sm text-[#557C55]"
          />
          <button
            onClick={() => alert('Profile picture updated!')}
            className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition w-full flex items-center justify-center"
          >
            <FaSave className="mr-1" /> 
            Save
          </button>
        </div>
        */}

        {/* Edit Profile Section */}
        <div className="flex-1 bg-white rounded-lg p-3">
          <p className="text-sm sm:text-md mb-3 font-semibold text-[#557C55]">Profile Information:</p>
          <div className="space-y-2 mb-3">
            {/* Display Profile Info */}
            {/* (Existing profile information rendering logic) */}
          </div>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <h4 className="text-sm sm:text-lg font-bold mb-2 text-[#557C55]">Edit Profile</h4>
            {/* Input fields for updating profile information */}
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="first_name" className="block text-xs sm:text-sm font-semibold text-[#557C55]">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={profile.first_name}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="middle_initials" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Middle Name:</label>
              <input
                type="text"
                id="middle_initials"
                name="middle_initials"
                value={profile.middle_initials}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your middle name"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={profile.last_name}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label htmlFor="municipality" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Municipality:</label>
              <select
                id="municipality"
                name="municipality"
                value={profile.municipality}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
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
              <label htmlFor="barangay" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Barangay:</label>
              <select
                id="barangay"
                name="barangay"
                value={profile.barangay}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              >
                <option value="">Select Barangay</option>
                {barangaysData[profile.municipality] ? (
                  barangaysData[profile.municipality].map((barangay) => (
                    <option key={barangay} value={barangay}>
                      {barangay}
                    </option>
                  ))
                ) : (
                  <option value="">No barangays available</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="contact_number" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Contact Number:</label>
              <input
                type="text"
                id="contact_number"
                name="contact_number"
                value={profile.contact_number}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your contact number"
              />
            </div>
            <div>
              <label htmlFor="birthday" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Birthday:</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={profile.birthday}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your birthday"
              />
            </div>       
            <button
              type="submit"
              className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
              disabled={loading}
            >
              <FaSave className="mr-1" />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
