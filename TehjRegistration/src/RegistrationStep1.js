import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

function RegistrationStep1() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Email validation
    if (!emailPattern.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Password validation
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    navigate('/step2', { state: { formData } });
  };

  return (
    <form onSubmit={handleNext}>
      <h2>Step 1: Account Details</h2>
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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
      </div>
      <button type="submit">Next</button>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </form>
  );
}

export default RegistrationStep1;
