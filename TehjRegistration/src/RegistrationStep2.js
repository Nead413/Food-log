import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

function RegistrationStep2() {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    desiredWeight: '',
    sex: '',
    dob: ''
  });

  // Using a ref instead of state since we're not using it for rendering
  const heightUnitRef = React.useRef('cm');
  const [weightUnit, setWeightUnit] = useState('kg');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHeightChange = (e) => {
    let value = e.target.value;
    if (heightUnitRef.current === 'ft') {
      // Remove non-numeric chars except for apostrophe
      value = value.replace(/[^0-9']/g, '');
      
      // Format to ensure proper pattern
      if (value.length > 0 && !value.includes("'")) {
        // If we have at least one digit but no apostrophe, add it after the first digit
        value = value[0] + "'" + value.substring(1);
      }
      
      // Ensure there's only one apostrophe
      const parts = value.split("'");
      if (parts.length > 2) {
        value = parts[0] + "'" + parts.slice(1).join("");
      }
    }
    
    setFormData({
      ...formData,
      height: value,
    });
  };

  const handleHeightDropdownChange = (e, type) => {
    const value = e.target.value;
    let height = formData.height.split("'");

    if (type === 'feet') {
      height[0] = value;
      // Update the ref when dropdown changes
      heightUnitRef.current = 'ft';
    } else {
      height[1] = value.replace('"', '');
    }

    setFormData({
      ...formData,
      height: `${height[0] || ''}'${height[1] || ''}"`,
    });
  };

  const handleWeightChange = (e) => {
    let value = e.target.value;
    setFormData({
      ...formData,
      weight: value,
    });
  };

  const handleWeightDropdownChange = (e) => {
    const value = e.target.value;
    setWeightUnit(value);
  };

  const handleSexChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      sex: value,
    });
  };

  const isFormValid = () => {
    const { height, weight, desiredWeight, sex, dob } = formData;
    return (
      height.trim() !== '' &&
      weight.trim() !== '' &&
      desiredWeight.trim() !== '' &&
      sex.trim() !== '' &&
      dob.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all fields');
      return;
    }

    const step1Data = JSON.parse(localStorage.getItem('registrationStep1'));
    const completeFormData = { 
      ...step1Data, 
      ...formData, 
      heightUnit: heightUnitRef.current,  // Use the ref here 
      weightUnit,
      // Ensure all required fields are present
      username: step1Data.username,
      email: step1Data.email,
      password: step1Data.password,
      confirmPassword: step1Data.confirmPassword 
    };

    try {
      const springResponse = await axios.post('http://localhost:8081/users', completeFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (springResponse.status === 201) {
        const userData = {
          username: completeFormData.username,
          email: completeFormData.email,
          health: {
            weight: parseFloat(completeFormData.weight),
            targetWeight: parseFloat(completeFormData.desiredWeight),
            height: completeFormData.height,
            activityLevel: "Moderate"
          },
          weightHistory: [{
            date: new Date().toLocaleString('default', { month: 'short' }),
            weight: parseFloat(completeFormData.weight)
          }]
        };

        localStorage.setItem('dietTrackerUserData', JSON.stringify(userData));
        localStorage.setItem('userEmail', completeFormData.email);
        localStorage.setItem('userId', springResponse.data.id);
        
        navigate('/login');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      const errorMessage = error.response?.data || 'Error registering user';
      alert(errorMessage);
    }
  };

  const handleBack = () => {
    navigate('/step1');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register - Step 2</h2>
      <div>
        <label>Height:</label>
        <div className="height-input">
          <select
            id="height-feet"
            value={formData.height.split("'")[0] || ''}
            onChange={(e) => handleHeightDropdownChange(e, 'feet')}
          >
            <option value="" disabled>Feet</option>
            <option value="3">3'</option>
            <option value="4">4'</option>
            <option value="5">5'</option>
            <option value="6">6'</option>
            <option value="7">7'</option>
          </select>
          <select
            id="height-inches"
            value={formData.height.split("'")[1]?.replace('"', '') || ''}
            onChange={(e) => handleHeightDropdownChange(e, 'inches')}
          >
            <option value="" disabled>Inches</option>
            <option value="0">0"</option>
            <option value="1">1"</option>
            <option value="2">2"</option>
            <option value="3">3"</option>
            <option value="4">4"</option>
            <option value="5">5"</option>
            <option value="6">6"</option>
            <option value="7">7"</option>
            <option value="8">8"</option>
            <option value="9">9"</option>
            <option value="10">10"</option>
            <option value="11">11"</option>
          </select>
          <input
            type="text"
            id="height-text"
            placeholder="Or type (e.g., 5'8)"
            maxLength="5"
            value={formData.height}
            onChange={handleHeightChange}
          />
        </div>
      </div>
      <div>
        <label>Weight:</label>
        <div className="weight-input">
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleWeightChange}
            placeholder={`Enter your weight (${weightUnit})`}
          />
          <select value={weightUnit} onChange={handleWeightDropdownChange}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>
      <div>
        <label>Desired Weight:</label>
        <input
          type="text"
          name="desiredWeight"
          value={formData.desiredWeight}
          onChange={handleChange}
          placeholder={`Enter your desired weight (${weightUnit})`}
        />
      </div>
      <div>
        <label>Sex:</label>
        <div className="sex-input">
          <select
            id="sex-select"
            value={formData.sex}
            onChange={handleSexChange}
          >
            <option value="" disabled>Select your sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            placeholder="Or type your sex"
          />
        </div>
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button type="button" onClick={handleBack}>Back</button>
        <button type="submit" disabled={!isFormValid()}>Submit</button>
      </div>
    </form>
  );
}

export default RegistrationStep2;
