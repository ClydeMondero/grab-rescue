import { useState, useEffect, useContext } from "react";
import logo from "../assets/logo.png";
import { RequestContext } from "../contexts/RequestContext";
import { FaTimes } from "react-icons/fa";

const Nav = ({ navigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { requesting } = useContext(RequestContext);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Helper function to disable buttons
  const buttonStyle = requesting
    ? "cursor-not-allowed opacity-50 text-gray-400"
    : "cursor-pointer text-text-primary";

  return (
    <div className="hidden lg:h-[10%] bg-accent text-white shadow-lg px-4 py-2 lg:flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="logo"
          className="h-10 text-primary cursor-pointer"
          onClick={() => !requesting && navigate("/")}
        />
      </div>
      <ul className="space-x-4 flex items-center justify-center">
        <li>
          <p
            className={`text-lg font-semibold ${buttonStyle}`}
            onClick={() => !requesting && navigate("/")}
          >
            Home
          </p>
        </li>
        <li>
          <p
            className={`text-lg font-semibold ${buttonStyle}`}
            onClick={() => !requesting && navigate("/download")}
          >
            Download
          </p>
        </li>
        <li>
          <p
            className={`text-lg font-semibold ${buttonStyle}`}
            onClick={() => !requesting && navigate("/about")}
          >
            About
          </p>
        </li>
        <li>
          <button
            onClick={toggleModal}
            className={`px-6 py-2 rounded-md bg-primary ${buttonStyle}`}
            disabled={requesting}
          >
            <p className="text-white text-md font-semibold">Login</p>
          </button>
        </li>
      </ul>

      {/* Minimal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-green-700 bg-opacity-80 flex flex-col items-center justify-center z-[100] text-white p-6">
          <button
            onClick={toggleModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes className="text-2xl" />
          </button>
          <h2 className="text-3xl font-bold mb-4">Choose Account Type</h2>
          <p className="text-lg mb-6 text-center max-w-sm">
            Select your account type to proceed with login.
          </p>
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <button
              onClick={() => {
                if (!requesting) {
                  navigate("/login?role=Rescuer");
                  setIsModalOpen(false);
                }
              }}
              className={`w-full bg-white text-green-700 font-bold py-3 rounded-lg hover:bg-gray-100 text-center ${
                requesting ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={requesting}
            >
              Login as Rescuer
            </button>
            <button
              onClick={() => {
                if (!requesting) {
                  navigate("/login?role=Admin");
                  setIsModalOpen(false);
                }
              }}
              className={`w-full bg-white text-green-700 font-bold py-3 rounded-lg hover:bg-gray-100 text-center ${
                requesting ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={requesting}
            >
              Login as Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
