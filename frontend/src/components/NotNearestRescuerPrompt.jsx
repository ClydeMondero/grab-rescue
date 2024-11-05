import React, { useEffect, useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { MdLocationOff } from "react-icons/md";
import { RescuerContext } from "../contexts/RescuerContext";
import { MdWarningAmber } from "react-icons/md";

const NotNearestRescuerPrompt = ({ onContinue, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-orange-700 bg-opacity-80 flex items-center justify-center z-[100] fade-in">
      <div className="text-white flex flex-col items-center text-center p-10">
        <MdWarningAmber className="text-8xl text-white mb-4" />
        <div className="text-center p-6 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            You Are Not the Nearest Rescuer
          </h2>
          <p className="text-lg">
            <span className="font-bold">
              Another rescuer is currently closer to this location.
            </span>
            We appreciate your readiness to assist! For now, it’s best to allow
            the nearest rescuer to respond first for the quickest assistance.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            className="w-full bg-white text-orange-700 font-bold py-3 px-6 text-xl rounded-lg hover:bg-orange-800 hover:text-white"
            onClick={onContinue}
          >
            Continue
          </button>
          <button className="mt-4 text-white underline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotNearestRescuerPrompt;
