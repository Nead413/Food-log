import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Height input handling script
const heightInput = document.getElementById("height-text");
if (heightInput) {
  heightInput.addEventListener("input", () => {
    let value = heightInput.value.replace(/[^0-9']/g, ""); // Removes invalid characters
    if (value.length > 0 && !value.includes("'")) {
      value = value[0] + "'"; // Apostrophe added after first digit
    }
    const formatted = value.replace(/^(\d+)'?(\d*)$/, (_, feet, inches) => {
      return feet + "'" + (inches || ""); // Add inches after the apostrophe 
    });
    heightInput.value = formatted; 
  });

  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); 
      const feet = document.getElementById("height-feet").value; // Selected feet
      const inches = document.getElementById("height-inches").value; // Selected inches
      const typedHeight = heightInput.value; // Typed value of height
      let finalHeight = typedHeight || `${feet || "?"}'${inches || "?"}"`;
      if (!typedHeight && (!feet || !inches)) {
        alert("Please provide a valid integer for your height!"); // Error message displayed
        return;
      }
      alert("Submitted height: " + finalHeight); 
    });
  }
}