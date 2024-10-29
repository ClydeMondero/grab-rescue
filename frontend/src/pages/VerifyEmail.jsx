import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [verified, setVerified] = useState(false);
  const [exit, setExit] = useState(false);
  const [role, setRole] = useState(null); // State to hold the user role
  const nav = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!verified) {
          const response = await axios.put(`/users/verify/${token}`);
          const userRole = response.data.role; // Assume the response has the user role

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

          setVerified(true);
          setRole(userRole);

          if (role === "Admin" || role === "Rescuer") {
            // Close the tab and exit the page after the toast
            setTimeout(() => {
              window.close();
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error during verification:", error);
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

    const timeoutId = setTimeout(() => {
      verifyEmail();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [token, verified, nav]);

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex justify-center items-center">
        <div className="text-6xlxl font-bold animate-pulse text-[#557C55]">
          {verified
            ? "Your Email has been successfully Verified!"
            : "Verifying..."}
        </div>
      </div>

      {exit && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50"></div>
      )}
    </>
  );
};

export default VerifyEmail;
