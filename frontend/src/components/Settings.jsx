import { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { SketchPicker } from 'react-color';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('text-xl');
  const [themeColor, setThemeColor] = useState('#557C55'); // Default color
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleColorChange = (color) => {
    setThemeColor(color.hex);
  };

  return (
    <div className={`pl-72 p-6 h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <h4 className={`bi bi-gear-fill text-4xl font-bold mb-6 ${isDarkMode ? 'text-[#A0D9A4]' : 'text-[#557C55]'}`}>
        Settings
      </h4>
      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-white rounded-full dark:bg-white dark:text-white">
          <label className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-[#557C55]'}`}>Dark Mode:</label>
          <button
            className={`text-3xl p-2 rounded-full transition-all ${isDarkMode ? 'text-[#557C55] hover:bg-[#557C55] hover:text-white' : 'text-[#557C55] hover:bg-[#557C55] hover:text-white'}`}
            onClick={handleThemeToggle}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        
        {/* Font Size Selector */}
        <div className="flex items-center justify-between p-4 bg-white rounded-full dark:bg-white dark:text-white">
          <label className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-[#557C55]'}`}>Font Size:</label>
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="bg-[#557C55] border rounded-full p-2 border-white dark:text-white"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-xl">Large</option>
          </select>
        </div>
        
        {/* Change Color Picker */}
        <div className="flex items-center justify-between p-4 bg-white rounded-full dark:bg-white dark:text-white">
          <label className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-[#557C55]'}`}>Change Color:</label>
          <button
            className="bg-[#557C55] text-white px-4 py-2 rounded-full hover:bg-[#6EA46E] transition"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            Pick Color
          </button>
          {showColorPicker && (
            <div className="absolute mt-2">
              <SketchPicker
                color={themeColor}
                onChangeComplete={handleColorChange}
                className="z-50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
