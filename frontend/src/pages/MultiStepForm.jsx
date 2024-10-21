import React, { useState } from "react";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    relation: "",
    picture: "",
  });

  const nextStep = () => {
    if (step === 1 && !formData.phoneNumber) {
      alert("Phone number is required.");
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Handle file input separately
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("formDataToSend", formData);
      // TODO: send data to firebase or your backend service
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Phone Number (required):
              </h2>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                maxLength={11}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Name:
              </h2>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Relation to the Victim:
              </h2>
              <input
                type="text"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Upload Picture:
              </h2>
              <input
                type="file"
                name="picture"
                accept="image/*"
                value={formData.picture}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between space-x-4">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full bg-white p-6 md:w-1/2">{renderStep()}</div>
  );
};

export default MultiStepForm;
