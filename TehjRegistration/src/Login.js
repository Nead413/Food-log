import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '', // This will now be used for both email and username
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', formData);
      
      const loginData = {
        email: formData.email, // This field will contain either email or username
        password: formData.password
      };
      
      const springResponse = await axios.post('http://localhost:8080/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Server response:', springResponse);
      
      if (springResponse.data === 'Login successful') {
        try {
          // First try to find user by email
          let userResponse;
          try {
            userResponse = await axios.get(`http://localhost:8080/users/findByEmail?email=${formData.email}`);
          } catch (emailError) {
            // If email lookup fails, the input might be a username instead of email
            // Try to find the user another way, perhaps using the first user from filtered users
            const usersResponse = await axios.get(`http://localhost:8080/users?username=${formData.email}`);
            if (usersResponse.data && usersResponse.data.length > 0) {
              userResponse = { data: usersResponse.data[0] };
            } else {
              throw new Error('User not found');
            }
          }
          
          if (userResponse && userResponse.data) {
            // Log the user ID for debugging
            console.log('User ID from response:', userResponse.data.id);
            
            // Store complete user data locally
            localStorage.setItem('userEmail', userResponse.data.email);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            
            // Make sure to set userId in localStorage
            if (userResponse.data.id) {
              localStorage.setItem('userId', userResponse.data.id);
            } else {
              console.error('User ID is missing from response!');
            }

            // Also store user preferences and settings in the expected format
            const defaultUserData = {
              username: userResponse.data.username || userResponse.data.email.split('@')[0],
              email: userResponse.data.email,
              avatar: "/api/placeholder/150/150", // Add default avatar
              health: {
                weight: parseFloat(userResponse.data.weight) || 70,
                targetWeight: parseFloat(userResponse.data.desiredWeight) || 65,
                height: userResponse.data.height && userResponse.data.height.includes("'") ? 
                  convertHeightToInches(userResponse.data.height) : 
                  parseInt(userResponse.data.height) || 68,
                activityLevel: "Moderate"
              },
              stats: {
                daysTracked: 0,
                currentStreak: 0,
                avgCalories: 0,
                avgProtein: 0,
                avgCarbs: 0,
                avgFat: 0,
              },
              goals: {
                calories: 2000,
                protein: 50,
                carbs: 250,
                fat: 70,
              },
              weightHistory: [{
                date: new Date().toLocaleString('default', { month: 'short' }),
                weight: parseFloat(userResponse.data.weight) || 70
              }]
            };
            
            // Debug what we're storing
            console.log('Storing user data:', defaultUserData);
            
            localStorage.setItem('dietTrackerUserData', JSON.stringify(defaultUserData));
            
            navigate('/homepage');
          } else {
            setErrors({ login: 'User data not found' });
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setErrors({ login: 'Login successful but could not fetch user data' });
          // Still navigate to homepage as login was successful
          navigate('/homepage');
        }
      } else {
        setErrors({ login: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error('Login error details:', error);
      setErrors({ login: error.response?.data || 'Error logging in' });
      alert('Login failed: ' + (error.response?.data || 'Unknown error'));
    }
  };
  
  // Helper function to convert height string to inches
  const convertHeightToInches = (heightStr) => {
    if (!heightStr) return 0;
    try {
      // Check if height is already a number (in cm)
      if (!isNaN(heightStr)) {
        // Convert cm to inches approximately
        return Math.round(parseInt(heightStr) / 2.54);
      }
      
      // Handle feet/inches format like "5'10"
      const parts = heightStr.split("'");
      const feet = parseInt(parts[0]) || 0;
      // Handle case with or without the inch symbol (")
      const inches = parseInt(parts[1]?.replace('"', '')) || 0;
      return (feet * 12) + inches;
    } catch (e) {
      console.error("Error parsing height:", e, "Height value was:", heightStr);
      return 0;
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <p className="form-subtitle">Log in to continue your fitness journey</p>
        
        {errors.login && <div className="error-message">{errors.login}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Username or Email:</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your username or email"
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
        
        <div className="form-actions">
          <button type="submit" className="btn-login">Log In</button>
        </div>
        
        <div className="form-footer">
          <p>Don't have an account? <a href="/" className="signup-link">Create one here</a></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
