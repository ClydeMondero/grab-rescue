import { useState } from "react";
import logo from "../assets/logo.png";
import { FaTimes } from "react-icons/fa";

const Nav = ({ navigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="hidden lg:h-[10%] bg-accent text-white shadow-lg px-4 py-2 lg:flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="logo"
          className="h- text-primary cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <ul className="space-x-4 flex items-center justify-center">
        <li>
          <p
            className="text-lg font-semibold cursor-pointer text-text-primary"
            onClick={() => navigate("/")}
          >
            Home
          </p>
        </li>
        <li>
          <p
            className="text-lg font-semibold cursor-pointer text-text-primary"
            onClick={() => navigate("/download")}
          >
            Download
          </p>
        </li>
        <li>
          <p
            className="text-lg font-semibold cursor-pointer text-text-primary"
            onClick={() => navigate("/about")}
          >
            About
          </p>
        </li>
        <li>
          <button
            onClick={toggleModal}
            className="cursor-pointer bg-primary px-6 py-2 rounded-md hover:opacity-80"
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
                navigate("/login?role=Rescuer");
                setIsModalOpen(false);
              }}
              className="w-full bg-white text-green-700 font-bold py-3 rounded-lg hover:bg-gray-100 text-center"
            >
              Login as Rescuer
            </button>
            <button
              onClick={() => {
                navigate("/login?role=Admin");
                setIsModalOpen(false);
              }}
              className="w-full bg-white text-green-700 font-bold py-3 rounded-lg hover:bg-gray-100 text-center"
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
