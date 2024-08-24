import { useState } from 'react';

const ViewProfile = () => {
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
    <div className="flex-1 p-6 lg:p-8 h-full bg-gray-50 flex flex-col">
      <h4 className="text-xl font-semibold mb-4 text-[#557C55]">View Profile</h4>
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Profile Picture Section */}
        <div className="flex-shrink-0 w-full lg:w-1/4 bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
          <img 
            src={profile.profilePicture} 
            alt="Profile" 
            className="w-28 h-28 rounded-full object-cover border-4 border-[#557C55] mb-3"
          />
          <input 
            type="file" 
            id="profile-picture" 
            name="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="mb-3 w-full text-[#557C55]"
          />
          <button 
            onClick={() => alert('Profile picture updated!')}
            className="bg-[#557C55] text-white px-3 py-1 rounded-lg text-md hover:bg-[#6EA46E] transition w-full"
          >
            Save Picture
          </button>
        </div>

        {/* Edit Profile Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <p className="text-lg mb-4 font-semibold text-[#557C55]">Profile Information:</p>
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <h5 className="text-md font-semibold text-[#557C55] w-20">Name:</h5>
              <p className="text-gray-700 text-sm">{profile.name}</p>
            </div>
            <div className="flex items-center">
              <h5 className="text-md font-semibold text-[#557C55] w-20">Email:</h5>
              <p className="text-gray-700 text-sm">{profile.email}</p>
            </div>
            <div className="flex items-center">
              <h5 className="text-md font-semibold text-[#557C55] w-20">Address:</h5>
              <p className="text-gray-700 text-sm">{profile.address}</p>
            </div>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <h4 className="text-xl font-bold mb-3 text-[#557C55]">Edit Profile</h4>
            <div>
              <label htmlFor="name" className="block text-md font-semibold text-[#557C55]">Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded-lg bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-md font-semibold text-[#557C55]">Address:</label>
              <input 
                type="text" 
                id="address" 
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full p-1 border rounded-lg bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
                placeholder="Enter your address"
              />
            </div>
            <button 
              type="submit" 
              className="bg-[#557C55] text-white px-3 py-1 rounded-lg text-md hover:bg-[#6EA46E] transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
