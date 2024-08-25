import { useState } from 'react';
import { FaArrowLeft, FaSave } from 'react-icons/fa'; // Import the FaSave icon
import { useNavigate } from 'react-router-dom';

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, San Rafael, Bulacan',
    profilePicture: 'https://via.placeholder.com/150',
  });

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
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Email:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h5 className="text-xs sm:text-sm font-semibold text-[#557C55] w-16 truncate">Address:</h5>
              <p className="text-gray-700 text-xs sm:text-sm truncate">{profile.address}</p>
            </div>
          </div>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <h4 className="text-sm sm:text-lg font-bold mb-2 text-[#557C55]">Edit Profile</h4>
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your address"
              />
            </div>
            <button
              type="submit"
              className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
            >
              <FaSave className="mr-1" /> {/* FaSave icon */}
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
