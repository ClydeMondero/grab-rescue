import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post("/users/verify", { token }, { withCredentials: true });
        toast.success("Your Email has been successfully Verified!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          setExit(true);
          setTimeout(() => navigate("/changeEmail"), 1000);
        }, 3000);
      } catch (error) {
        console.error(error);
        toast.error("Failed to verify email", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          setExit(true);
          setTimeout(() => navigate("/changeEmail"), 1000);
        }, 3000);
      }
    };

    verifyEmail();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex justify-center items-center">
        <div className="text-4xl font-bold animate-pulse">
          Your Email has been successfully Verified!
        </div>
      </div>
      {exit && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50"></div>
      )}
    </>
  );
};

export default VerifyEmail;
