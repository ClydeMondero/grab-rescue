import { useState } from 'react';
import { FaArrowLeft, FaSync } from 'react-icons/fa'; // Import FaSync icon
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Password updated successfully!');
  };

  return (
    <div className="flex-1 p-3 h-100 bg-gray-50 flex flex-col">
      <div className="flex items-center mb-2">
        <FaArrowLeft className="text-lg sm:text-xl text-[#557C55] cursor-pointer" onClick={() => navigate(-1)} />
        <h4 className="text-md sm:text-lg font-semibold ml-2 text-[#557C55]">Change Password</h4>
      </div>
      <div className="flex-1 bg-white rounded-lg p-3">
        <p className="text-sm sm:text-md mb-3 font-semibold text-[#557C55]">Update your password:</p>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current-password" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Current Password:</label>
            <input 
              type="password" 
              id="current-password" 
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-xs sm:text-sm font-semibold text-[#557C55]">New Password:</label>
            <input 
              type="password" 
              id="new-password" 
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter a new password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-semibold text-[#557C55]">Confirm New Password:</label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-1 border rounded bg-[#F9F9F9] border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Confirm your new password"
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#557C55] text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-[#6EA46E] transition flex items-center justify-center"
          >
            <FaSync className="mr-1" /> {/* FaSync icon */}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
