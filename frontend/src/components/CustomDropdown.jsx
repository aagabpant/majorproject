import { useState } from "react";

const CustomDropdown = ({ options, selectedOptions, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleOptionClick = (option) => {
    onSelect(option);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={toggleDropdown}>Select Banks</button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1,
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionClick(option)}
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
