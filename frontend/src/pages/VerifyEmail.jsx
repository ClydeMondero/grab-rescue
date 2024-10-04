import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [exit, setExit] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("Token:", token); // Log the token value
      try {
        await axios.put(`/users/verify/${token}`);
        toast.success("Your Email has been successfully Verified!", {
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          animation: false,
          style: {
            animation: "slideInFromTop 1s ease-in-out",
            backgroundColor: "inherit",
          },
        });
        setTimeout(() => {
          nav("/admin/changeEmail");
        }, 2000);
      } catch (error) {
        console.error(error);
        toast.error("Failed to verify email", {
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          setExit(true);
        }, 2000);
      }
    };
    setTimeout(() => {
      verifyEmail();
    }, 1000);
  }, [token]);

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
