import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    desiredWeight: '',
    sex: '',
    dob: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/users', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        height: formData.height,
        weight: formData.weight,
        desiredWeight: formData.desiredWeight,
        sex: formData.sex,
        dob: formData.dob
      });
      console.log('User created:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);git 
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Healthy Habits Registration</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
      </div>
      <div>
        <label>Height:</label>
        <input
          type="text"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Enter your height (ft/inch or cm)"
        />
      </div>
      <div>
        <label>Weight:</label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter your weight (pounds, kilos or stone)"
        />
      </div>
      <div>
        <label>Desired Weight:</label>
        <input
          type="text"
          name="desiredWeight"
          value={formData.desiredWeight}
          onChange={handleChange}
          placeholder="Enter your desired weight"
        />
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
      <div>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={togglePasswordVisibility}
        />
        <label>Show Password</label>
      </div>
      <button type="submit">Create Account</button>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </form>
  );
}

export default RegistrationForm;