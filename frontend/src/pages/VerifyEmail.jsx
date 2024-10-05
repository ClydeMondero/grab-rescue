import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [verified, setVerified] = useState(false);
  const [exit, setExit] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("Token:", token);
      try {
        if (!verified) {
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

          setVerified(true);
          setTimeout(() => {
            nav("/admin/changeEmail");
          }, 2000);
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
        <div className="text-4xl font-bold animate-pulse">
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
