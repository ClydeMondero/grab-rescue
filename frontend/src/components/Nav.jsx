import { useState, useContext } from "react";
import logo from "../assets/logo.png";
import { FaTimes } from "react-icons/fa";

const Nav = ({ navigate, scrollToAbout, scrollToGetStarted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="hidden lg:h-[10%] bg-accent text-white shadow-md p-4 lg:flex items-center justify-between sticky top-0 z-50 bg-white">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="logo"
          className="h-10 text-primary cursor-pointer"
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
            onClick={() => scrollToAbout()}
          >
            About
          </p>
        </li>
        <li>
          <p
            className="text-lg font-semibold cursor-pointer text-primary"
            onClick={() => scrollToGetStarted()}
          >
            Get Started
          </p>
        </li>
        <li>
          <button
            onClick={toggleModal}
            className="px-6 py-2 rounded-md bg-primary cursor-pointer text-text-primary"
          >
            <p className="text-white text-md font-semibold">Login</p>
          </button>
        </li>
      </ul>

      {/* Minimal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-highlight bg-opacity-80 flex flex-col items-center justify-center z-[100] text-white p-6">
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
                navigate("/login?role=Citizen");
                setIsModalOpen(false);
              }}
              className="w-full bg-white text-highlight font-bold py-3 rounded-lg hover:bg-gray-100 text-center"
            >
              Login as Citizen
            </button>
            <button
              onClick={() => {
                navigate("/login?role=Admin");
                setIsModalOpen(false);
              }}
              className="w-full bg-white text-highlight font-bold py-3 rounded-lg hover:bg-gray-100 text-center"
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
