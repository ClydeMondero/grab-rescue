import { useState, useEffect } from 'react';
import { FaArrowLeft, FaSave } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const ViewProfile = (props) => {
  const navigate = useNavigate();
  const {user} = props;
  const [profile, setProfile] = useState(user);


  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="flex-1 p-3 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft className="text-lg sm:text-xl text-[#557C55] cursor-pointer" onClick={() => navigate(-1)} />
        <h4 className="text-md sm:text-lg font-semibold ml-2 text-[#557C55]">View Profile</h4>
      </div>
      <div className="flex flex-col space-y-4">
        {/* Profile Picture Section */}
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

        {/* Edit Profile Section */}
        <div className="flex-1 bg-white rounded-lg p-3">
          <p className="text-sm sm:text-md mb-3 font-semibold text-[#557C55]">Profile Information:</p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Name:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.first_name} {profile.middle_initial} {profile.last_name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Email:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Username:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.username}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Address:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.barangay}, {profile.municipality}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Contact Number:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.contact_number}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Birthday:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{new Date(profile.birthday).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <h4 className="text-sm sm:text-lg font-bold mb-2 text-[#557C55]">Edit Profile</h4>
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
              <label htmlFor="middle_initial" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Middle Name:</label>
              <input
                type="text"
                id="middle_initial"
                name="middle_initial"
                value={profile.middle_initial}
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
                placeholder="Enter your middle name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="barangay" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Barangay:</label>
              <input
                type="text"
                id="barangay"
                name="barangay"
                value={profile.barangay}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label htmlFor="municipality" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Municipality:</label>
              <input
                type="text"
                id="municipality"
                name="municipality"
                value={profile.municipality}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your address"
              />
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
                placeholder="Enter your Contact Number"
              />
            </div>
            <div>
              <label htmlFor="birthday" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Birthday:</label>
              <input
                type="text"
                id="birthday"
                name="birthday"
                value={new Date(profile.birthday).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your Contact Number"
              />
            </div>            
            <button
              type="submit"
              className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
            >
              <FaSave className="mr-1" /> 
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
