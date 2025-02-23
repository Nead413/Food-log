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

  const [heightUnit, setHeightUnit] = useState('cm');
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
    if (heightUnit === 'ft') {
      // Automatically add apostrophe at the correct point for feet and inches
      value = value.replace(/[^0-9']/g, ''); // Remove non-numeric characters except apostrophe
      if (value.length === 2 && !value.includes("'")) {
        value = value[0] + "'" + value[1];
      }
    }
    setFormData({
      ...formData,
      height: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Retrieve step 1 data from localStorage
    const step1Data = JSON.parse(localStorage.getItem('registrationStep1'));
    const completeFormData = { ...step1Data, ...formData, heightUnit, weightUnit };

    try {
      await axios.post('/users', completeFormData);
      navigate('/login');
    } catch (error) {
      alert('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register - Step 2</h2>
      <div>
        <label>Height:</label>
        <input
          type="text"
          name="height"
          value={formData.height}
          onChange={handleHeightChange}
          placeholder={`Enter your height (${heightUnit})`}
        />
        <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)}>
          <option value="cm">cm</option>
          <option value="ft">ft</option>
        </select>
      </div>
      <div>
        <label>Weight:</label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder={`Enter your weight (${weightUnit})`}
        />
        <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
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
        <input
          type="text"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          placeholder="Enter your sex"
        />
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
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationStep2;
