import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CitizenMap as Map } from "../components";
import {
  FaChevronDown,
  FaUserCircle,
  FaUserPlus,
  FaAmbulance,
  FaFileAlt,
} from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidHide, BiSolidAmbulance } from "react-icons/bi";
import { MdRoute } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  //go to user page if already logged in
  const verifyToken = async () => {
    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      const role = data.user.account_type;

      navigate("/" + role.toLowerCase(), { replace: true });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  //TODO: add footer for big screens
  return (
    <div className="h-screen flex flex-col">
      <div className="hidden  lg:h-[10%] bg-[#557C55] text-white shadow-lg px-4 py-2 lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-12" />
        </div>
        <ul className="space-x-4 flex items-center justify-center">
          <li className="hover:underline">
            <a href="/about" className="text-md font-semibold">
              About
            </a>
          </li>
          <li className="border-[2px] border-white px-4 py-2 rounded-md">
            <a href="/login?role=Rescuer" className="text-md font-semibold">
              Login as Rescuer
            </a>
          </li>
          <li className="border-[2px] border-white px-4 py-2 rounded-md">
            <a href="/login?role=Admin" className="text-md font-semibold">
              Login as Admin
            </a>
          </li>
          <li className="bg-white text-[#557C55] px-4 py-2 hover:underline rounded-md">
            <a href="/register" className="text-md font-semibold">
              Be a Rescuer
            </a>
          </li>
        </ul>
      </div>
      <div className="w-full h-[80%] relative lg:h-[90%] lg:bg-slate-200">
        <div className="absolute top-4 right-4 m-2 p-2 z-10 rounded-full bg-white shadow-lg lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-md cursor-pointer text-gray-700 rounded-full p-2 hover:bg-gra"
          >
            <FaChevronDown />
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-14 right-0 w-56 bg-white rounded-md shadow-lg py-2 flex items-center justify-center">
              <ul className="space-y-2 flex flex-col items-center w-full">
                <li className="py-2 border-b w-full justify-center">
                  <a
                    href="/login?role=Rescuer"
                    className="flex items-center justify-center w-full text-lg font-semibold hover:underline"
                  >
                    <FaAmbulance className="mr-2" />
                    Login as Rescuer
                  </a>
                </li>
                <li className="py-2 border-b w-full justify-center">
                  <a
                    href="/login?role=Admin"
                    className="flex items-center justify-center w-full text-lg font-semibold hover:underline"
                  >
                    <FaUserCircle className="mr-2" />
                    Login as Admin
                  </a>
                </li>
                <li className="py-2 border-b w-full">
                  <a
                    href="/register"
                    className="flex items-center justify-center w-full text-lg font-semibold hover:underline"
                  >
                    <FaUserPlus className="mr-2" />
                    Be a Rescuer
                  </a>
                </li>
                <li className="py-2">
                  <a
                    href="/about"
                    className="flex items-center w-full text-lg font-semibold hover:underline"
                  >
                    <FaFileAlt className="mr-2" />
                    About
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        {/*TODO: update marker icons and route*/}
        <Map />
      </div>
      {/*TODO: call control functions*/}
      <div className="h-[20%] bg-slate-200 px-2 pb-2 flex flex-col justify-between gap-2 lg:h-[10%]">
        <button className="flex-1 bg-[#FF5757] hover:bg-red-700 text-white font-bold p-2 rounded">
          Request for Help
        </button>
        <div className="flex items-center gap-4 lg:hidden">
          <div className="bg-white flex items-center justify-around gap-4 rounded-lg px-2 py-4 font-medium text-sm text-center flex-1">
            <div className="flex flex-col items-center">
              <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 flex items-center justify-center">
                <FaLocationPin className="text-2xl" />
              </button>
              <p>My Location</p>
            </div>
            <div className="flex flex-col items-center">
              <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 flex items-center justify-center">
                <BiSolidAmbulance className="text-2xl" />
              </button>
              <p>Nearest Rescuer</p>
            </div>
            <div className="flex flex-col items-center">
              <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 flex items-center justify-center">
                <MdRoute className="text-2xl" />
              </button>
              <p>View Route</p>
            </div>
            <div className="flex flex-col items-center">
              <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 flex items-center justify-center">
                <BiSolidHide className="text-2xl" />
              </button>
              <p>Hide Route</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
