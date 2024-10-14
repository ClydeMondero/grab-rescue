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

  // Render form steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Phone Number (required):</h2>
            <input
              type="tel"
              value={currentInput}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-between">
              <button className="btn-primary" onClick={nextStep}>
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Name:</h2>
            <input
              type="text"
              value={currentInput}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>
                Back
              </button>
              <button className="btn-primary" onClick={nextStep}>
                Next
              </button>
              <button className="btn-skip" onClick={skipStep}>
                Skip
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Relation to the Victim:</h2>
            <input
              type="text"
              value={currentInput}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>
                Back
              </button>
              <button className="btn-primary" onClick={nextStep}>
                Next
              </button>
              <button className="btn-skip" onClick={skipStep}>
                Skip
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upload Picture:</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>
                Back
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btn-skip" onClick={skipStep}>
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
    <div className="max-w-lg mx-auto bg-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Incident Report Form
      </h1>
      {renderStep()}
    </div>
  );
};

export default MultiStepForm;
