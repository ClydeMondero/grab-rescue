const ChangePassword = () => {
  return (
    <div className="pl-72 p-6 h-screen">
      <h4 className="bi bi-lock-fill text-4xl font-bold mb-6 text-[#557C55]">Change Password</h4>
      <div className="p-6 rounded-lg bg-white">
        <p className="text-xl mb-4">Update your password:</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-lg font-semibold text-[#557C55]">Current Password:</label>
            <input 
              type="password" 
              id="current-password" 
              className="w-full p-2 border rounded-lg mt-1 bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] transition" 
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-lg font-semibold text-[#557C55]">New Password:</label>
            <input 
              type="password" 
              id="new-password" 
              className="w-full p-2 border rounded-lg mt-1 bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] transition" 
              placeholder="Enter a new password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-lg font-semibold text-[#557C55]">Confirm New Password:</label>
            <input 
              type="password" 
              id="confirm-password" 
              className="w-full p-2 border rounded-lg mt-1 bg-[#F9F9F9] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] transition" 
              placeholder="Confirm your new password"
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#557C55] text-white px-4 py-2 rounded-lg hover:bg-[#6EA46E] transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
