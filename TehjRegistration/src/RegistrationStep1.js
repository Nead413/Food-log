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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all fields');
      return;
    }
    console.log('Form submitted:', formData);
    localStorage.setItem('registrationStep1', JSON.stringify(formData));
    navigate('/step2');
  };

  const handleBack = () => {
    navigate('/');
  };

  const isFormValid = () => {
    const { username, email, password, confirmPassword } = formData;
    return (
      username.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register - Step 1</h2>
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
      <div className="button-group">
        <button type="button" onClick={handleBack}>Back</button>
        <button type="submit" disabled={!isFormValid()}>Next</button>
      </div>
    </form>
  );
}

export default RegistrationStep1;
