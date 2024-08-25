import { useState } from 'react';
import { FaSave } from 'react-icons/fa'; 
import { MdAdd } from 'react-icons/md';
import { MdPersonAdd } from 'react-icons/md'; // New icon for AddRescuer

const AddRescuer = () => {
  const [rescuer, setRescuer] = useState({
    name: '',
    hotline: '',
    location: '',
    cityMunicipality: '',
    email: '',
    barangay: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRescuer((prevRescuer) => ({
      ...prevRescuer,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRescuer((prevRescuer) => ({
          ...prevRescuer,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rescuer.password !== rescuer.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Rescuer added successfully!');
  };

  return (
    <div className="flex-1 p-2 sm:p-4 lg:p-6 h-full bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="flex items-center mb-2 sm:mb-4">
        <MdPersonAdd className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-sm sm:text-md lg:text-lg font-semibold text-[#557C55]">Add Rescuer</h4>
      </div>

      {/* Add Rescuer Form */}
      <div className="flex-1 bg-white rounded-md p-4 sm:p-6 lg:p-8">
        <form className="space-y-2 sm:space-y-4" onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <img
                src={rescuer.profilePicture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#557C55]"
              />
              <label htmlFor="profile-picture" className="absolute bottom-0 right-0 p-1 sm:p-2 bg-[#557C55] text-white rounded-full cursor-pointer">
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
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-[#557C55] flex items-center">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={rescuer.name}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label htmlFor="hotline" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Hotline:</label>
              <input
                type="text"
                id="hotline"
                name="hotline"
                value={rescuer.hotline}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter hotline"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={rescuer.location}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label htmlFor="cityMunicipality" className="block text-xs sm:text-sm font-semibold text-[#557C55]">City/Municipality:</label>
              <input
                type="text"
                id="cityMunicipality"
                name="cityMunicipality"
                value={rescuer.cityMunicipality}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter city/municipality"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={rescuer.email}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label htmlFor="barangay" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Barangay:</label>
              <input
                type="text"
                id="barangay"
                name="barangay"
                value={rescuer.barangay}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter barangay"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={rescuer.password}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={rescuer.confirmPassword}
                onChange={handleChange}
                className="w-full p-1 sm:p-2 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                placeholder="Confirm password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#557C55] text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center mt-4"
          >
            <FaSave className="mr-1 sm:mr-2" /> {/* FaSave icon */}
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRescuer;
