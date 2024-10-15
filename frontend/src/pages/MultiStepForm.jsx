import React, { useState } from "react";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    relation: "",
    picture: null,
  });

  const [currentInput, setCurrentInput] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setCurrentInput(value);
  };

  const handleFileChange = (e) => {
    setCurrentInput(e.target.files[0]);
  };

  const nextStep = () => {
    if (step === 1 && !currentInput) {
      alert("Phone number is required.");
      return;
    }

    const updatedFormData = { ...formData };
    if (step === 1) {
      updatedFormData.phoneNumber = currentInput;
    } else if (step === 2) {
      updatedFormData.name = currentInput;
    } else if (step === 3) {
      updatedFormData.relation = currentInput;
    } else if (step === 4) {
      updatedFormData.picture = currentInput;
    }

    setFormData(updatedFormData);
    setCurrentInput("");
    setStep(step + 1);
  };

  const skipStep = () => {
    setCurrentInput("");
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const formDataToSend = new FormData();
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("relation", formData.relation);
    formDataToSend.append("picture", formData.picture);

    try {
      const response = await fetch("/api/incident-report", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-md font-semibold text-primary-dark">
              Phone Number (required):
            </h2>
            <input
              type="tel"
              value={currentInput.slice(0, 11)}
              onChange={handleChange}
              required
              autoComplete="tel"
              maxLength={11}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-center">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-md font-semibold text-primary-dark">Name:</h2>
            <input
              type="text"
              value={currentInput}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
              <button
                className="border bg-warning hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
                onClick={skipStep}
              >
                Skip
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-md font-semibold text-primary-dark">
              Relation to the Victim:
            </h2>
            <input
              type="text"
              value={currentInput}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
              <button
                className="border bg-warning hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
                onClick={skipStep}
              >
                Skip
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-md font-semibold text-primary-dark">
              Upload Picture:
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between space-x-4">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
              <button
                className="border bg-warning hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
                onClick={skipStep}
              >
                Skip
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 border border-primary rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Incident Report Form
      </h1>
      {renderStep()}
    </div>
  );
};

export default MultiStepForm;
