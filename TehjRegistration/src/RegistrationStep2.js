import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationForm.css';

function RegistrationStep2() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ...location.state.formData,
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    desiredWeight: '',
    sex: '',
    dob: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users', formData);
      console.log('User created:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/', { state: { formData } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Step 2: Personal Details</h2>
      <div>
        <label>Height:</label>
        <div className="input-group">
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Enter your height"
          />
          <select
            name="heightUnit"
            value={formData.heightUnit}
            onChange={handleChange}
          >
            <option value="cm">cm</option>
            <option value="ft">ft/inch</option>
          </select>
        </div>
      </div>
      <div>
        <label>Weight:</label>
        <div className="input-group">
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter your weight"
          />
          <select
            name="weightUnit"
            value={formData.weightUnit}
            onChange={handleChange}
          >
            <option value="kg">kg</option>
            <option value="lbs">pounds</option>
            <option value="stone">stone</option>
          </select>
        </div>
      </div>
      <div>
        <label>Desired Weight:</label>
        <div className="input-group">
          <input
            type="text"
            name="desiredWeight"
            value={formData.desiredWeight}
            onChange={handleChange}
            placeholder="Enter your desired weight"
          />
          <select
            name="weightUnit"
            value={formData.weightUnit}
            onChange={handleChange}
          >
            <option value="kg">kg</option>
            <option value="lbs">pounds</option>
            <option value="stone">stone</option>
          </select>
        </div>
      </div>
      <div>
        <label>Sex:</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
        >
          <option value="">Select your sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
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
        <button type="submit">Create Account</button>
      </div>
    </form>
  );
}

export default RegistrationStep2;
