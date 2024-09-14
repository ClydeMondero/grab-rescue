const ForgotPassword = () => {
    return (
      <div className="bg-image-logo bg-cover w-full h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => window.history.back()} 
            className="mb-4 text-[#FA7070] hover:text-red-600"
          >
            &larr; Back to Login
          </button>
          <h2 className="text-center text-2xl font-semibold mb-5 text-[#557C55]">Forgot Password</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter your email address, and we will send you a link to reset your password.
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold text-[#557C55]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#557C55]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#557C55] text-white py-2 rounded-md hover:bg-[#6EA46E]"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;
  