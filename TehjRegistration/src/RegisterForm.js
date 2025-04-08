import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    desiredWeight: '',
    sex: '',
    dob: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log('Submitting registration data:', formData);
        
        // Add timestamp to help with debugging
        console.log('Request sent at:', new Date().toISOString());
        
        const response = await axios.post('http://localhost:8080/users', formData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Registration response received at:', new Date().toISOString());
        console.log('Registration response status:', response.status);
        console.log('Registration response data:', response.data);
        
        if (response.status === 201) {
          console.log('Registration successful! User ID:', response.data.id);
          
          // Verify the user exists by making another request
          try {
            const verifyResponse = await axios.get(`http://localhost:8080/users/debug/db-info`);
            console.log('Database verification response:', verifyResponse.data);
            
            if (verifyResponse.data.users) {
              const foundUser = verifyResponse.data.users.find(u => 
                u.email === formData.email || u.username === formData.username
              );
              
              if (foundUser) {
                console.log('User verified in database:', foundUser);
              } else {
                console.warn('Warning: User not found in verification check!');
              }
            }
          } catch (verifyError) {
            console.error('Error verifying user in database:', verifyError);
          }
          
          alert('Registration successful! Please log in.');
          navigate('/login');
        } else {
          console.error('Unexpected response status:', response.status);
          setErrors({ submit: 'Registration failed with status: ' + response.status });
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMsg = error.response?.data || 'Error during registration';
        console.error('Server error message:', errorMsg);
        setErrors({ submit: errorMsg });
        alert('Registration failed: ' + errorMsg);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create an Account</h2>
        <p className="form-subtitle">Join us and start your fitness journey</p>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="form-control"
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-control"
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="form-control"
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="form-control"
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="height">Height:</label>
          <input
            id="height"
            type="text"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Enter your height"
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="heightUnit">Height Unit:</label>
          <select
            id="heightUnit"
            name="heightUnit"
            value={formData.heightUnit}
            onChange={handleChange}
            className="form-control"
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            id="weight"
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter your weight"
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="weightUnit">Weight Unit:</label>
          <select
            id="weightUnit"
            name="weightUnit"
            value={formData.weightUnit}
            onChange={handleChange}
            className="form-control"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="desiredWeight">Desired Weight:</label>
          <input
            id="desiredWeight"
            type="text"
            name="desiredWeight"
            value={formData.desiredWeight}
            onChange={handleChange}
            placeholder="Enter your desired weight"
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            id="dob"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-register">Register</button>
        </div>
        
        <div className="form-footer">
          <p>Already have an account? <a href="/login" className="login-link">Log in here</a></p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;