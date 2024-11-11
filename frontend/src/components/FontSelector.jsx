import React, { useState, useEffect } from "react";

const FontSelector = ({ onFontChange }) => {
  const fonts = {
    sans: "Sans-serif",
    serif: "Serif",
    mono: "Monospace",
    custom: "Custom Font",
  };

  const [fontFamily, setFontFamily] = useState(
    localStorage.getItem("fontFamily") || "sans"
  );

  useEffect(() => {
    // Call onFontChange prop to update font globally
    onFontChange(fontFamily);
  }, [fontFamily, onFontChange]);

  const handleFontChange = (event) => {
    setFontFamily(event.target.value);
  };

  return (
    <div>
      <select
        id="font-family"
        value={fontFamily}
        onChange={handleFontChange}
        className="bg-white dark:bg-dark-background-light border border-gray-300 dark:border-dark-border text-primary-medium dark:text-dark-text-secondary p-2 rounded-md"
      >
        {Object.entries(fonts).map(([key, label]) => (
          <option key={key} value={key} className={`font-${key}`}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;
