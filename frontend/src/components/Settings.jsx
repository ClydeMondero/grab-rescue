import { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { SketchPicker } from 'react-color';
import { AiFillSetting } from 'react-icons/ai';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('text-xl');
  const [themeColor, setThemeColor] = useState('#557C55'); // Default color
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  const handleColorChange = (color) => {
    setThemeColor(color.hex);
  };

  return (
    <div className={`flex-1 p-2 sm:p-4 lg:p-6 h-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} flex flex-col`}>
      <div className="flex items-center mb-4 sm:mb-6 pb-2 sm:pb-4 p-2 rounded-md">
      <AiFillSetting className="text-2xl sm:text-3xl text-[#557C55] mr-2 sm:mr-3" />
        <h4 className={`text-lg sm:text-2xl font-semibold ${isDarkMode ? 'text-[#A0D9A4]' : 'text-[#557C55]'}`}>
          Settings
        </h4>
      </div>

      <div className="bg-white rounded-md p-2 sm:p-4 flex flex-col space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-2 sm:p-4 bg-[#F9F9F9] rounded-md">
          <label className={`text-sm sm:text-lg font-medium ${isDarkMode ? 'text-white' : 'text-[#557C55]'}`}>
            Dark Mode:
          </label>
          <button
            className={`text-xl sm:text-2xl p-2 rounded-full transition-all ${isDarkMode ? 'text-[#557C55] hover:bg-[#557C55] hover:text-white' : 'text-[#557C55] hover:bg-[#557C55] hover:text-white'}`}
            onClick={handleThemeToggle}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center justify-between p-2 sm:p-4 bg-[#F9F9F9] rounded-md">
          <label className={`text-sm sm:text-lg font-medium ${isDarkMode ? 'text-white' : 'text-[#557C55]'}`}>
            Font Size:
          </label>
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="bg-[#557C55] border rounded-full p-1 sm:p-2 border-white text-white text-xs sm:text-sm"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-xl">Large</option>
          </select>
        </div>

        {/* Change Color Picker */}
        <div className="flex items-center justify-between p-2 sm:p-4 bg-[#F9F9F9] rounded-md relative">
          <label className={`text-sm sm:text-lg font-medium ${isDarkMode ? 'text-white' : 'text-[#557C55]'}`}>
            Change Color:
          </label>
          <button
            className="bg-[#557C55] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-[#6EA46E] transition"
            onClick={() => setShowColorPicker(prev => !prev)}
          >
            Pick Color
          </button>
          {showColorPicker && (
            <div className="absolute right-0 top-full mt-2 z-50">
              <SketchPicker
                color={themeColor}
                onChangeComplete={handleColorChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
