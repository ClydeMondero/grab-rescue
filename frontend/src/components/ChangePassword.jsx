import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
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
    <div className="p-4 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-4">
        <FaArrowLeft className="text-2xl text-[#557C55] cursor-pointer" onClick={() => navigate(-1)} />
        <h4 className="text-xl font-semibold ml-4 text-[#557C55]">Change Password</h4>
      </div>
      <div className="p-4 bg-white rounded-lg">
        <p className="text-lg mb-4 font-semibold text-[#557C55]">Update your password:</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current-password" className="block text-md font-semibold text-[#557C55]">Current Password:</label>
            <input 
              type="password" 
              id="current-password" 
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded-lg mt-1 bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-md font-semibold text-[#557C55]">New Password:</label>
            <input 
              type="password" 
              id="new-password" 
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded-lg mt-1 bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Enter a new password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-md font-semibold text-[#557C55]">Confirm New Password:</label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded-lg mt-1 bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#557C55] transition"
              placeholder="Confirm your new password"
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#557C55] text-white px-4 py-2 rounded-lg text-md hover:bg-[#6EA46E] transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
