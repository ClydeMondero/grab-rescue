import { useState } from 'react';

const ViewProfile = () => {
  // Example profile data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, San Rafael, Bulacan',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image
  });

  // Handler to update profile data
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handler to update profile picture
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

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="pl-72 p-6 h-screen">
      <h4 className="bi bi-person-fill text-4xl font-bold mb-6 text-[#557C55]">View Profile</h4>
      <div className="flex space-x-8">
        {/* Profile Picture Section */}
        <div className="flex-shrink-0 w-1/3">
          <img 
            src={profile.profilePicture} 
            alt="Profile" 
            className="w-full h-auto rounded-full object-cover mb-4"
          />
          <input 
            type="file" 
            id="profile-picture" 
            name="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="mb-4 w-full"
          />
          <button 
            onClick={() => alert('Profile picture updated!')}
            className="bg-[#557C55] text-white px-4 py-2 rounded-lg text-lg hover:bg-[#6EA46E] transition w-full"
          >
            Save Profile Picture
          </button>
        </div>
        {/* Edit Profile Section */}
        <div className="flex-1">
          <div className="p-6 rounded-lg bg-white">
            <p className="text-xl mb-4">Profile Information:</p>
            <div className="space-y-6">
              <div>
                <h5 className="text-2xl font-semibold text-[#557C55]">Name:</h5>
                <p className="text-lg text-gray-700">{profile.name}</p>
              </div>
              <div>
                <h5 className="text-2xl font-semibold text-[#557C55]">Email:</h5>
                <p className="text-lg text-gray-700">{profile.email}</p>
              </div>
              <div>
                <h5 className="text-2xl font-semibold text-[#557C55]">Address:</h5>
                <p className="text-lg text-gray-700">{profile.address}</p>
              </div>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <h4 className="text-3xl font-bold mb-4 text-[#557C55]">Edit Profile</h4>
              <div>
                <label htmlFor="name" className="block text-xl font-semibold text-[#557C55]">Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded-lg bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-xl font-semibold text-[#557C55]">Address:</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded-lg bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  placeholder="Enter your address"
                />
              </div>
              <button 
                type="submit" 
                className="bg-[#557C55] text-white px-3 py-2 rounded-lg text-lg hover:bg-[#6EA46E] transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
