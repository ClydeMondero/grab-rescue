import React from "react";
import { MdWarning, MdTurnSlightLeft, MdTurnSlightRight } from "react-icons/md"; // Import the warning icon

//TODO: add distance to turn
const TurnIndicator = ({ routeData, routeOpacity, isOnRoute }) => {
  if (!routeData) return null;

  const instructions = routeData.legs[0].steps.map(
    (step) => step.maneuver.instruction
  );

  const turnInstructions = instructions.filter((instruction) =>
    ["Turn left", "Turn right"].includes(instruction)
  );

  const nextInstruction = turnInstructions[0];

  if (!isOnRoute) {
    return (
      <div
        className="absolute top-6 left-1/2 transform -translate-x-1/2"
        style={{
          opacity: routeOpacity.line,
          zIndex: 10,
        }}
      >
        <div className="flex items-center bg-secondary/80 text-white shadow-2xl rounded-full p-4 gap-2 md:scale-75">
          <MdWarning className="h-6 w-6 text-white" /> {/* Warning Icon */}
          <span className="flex-1 text-sm font-bold">You're off route!</span>
        </div>
      </div>
    );
  }

  return nextInstruction ? (
    <div
      className="absolute top-10 left-1/2 transform -translate-x-1/2"
      style={{
        opacity: routeOpacity.line,
        zIndex: 10,
      }}
    >
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-3 border border-gray-300">
        <div className="flex items-center">
          {nextInstruction === "Turn left" ? (
            <MdTurnSlightLeft className="text-primary h-8 w-8" />
          ) : (
            <MdTurnSlightRight className="text-primary h-8 w-8" />
          )}
          <span className="text-gray-800 font-semibold ml-2 text-lg">
            {nextInstruction}
          </span>
        </div>
      </div>
    </div>
  ) : null;
};

export default TurnIndicator;
