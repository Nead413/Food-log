import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
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
      
      const springResponse = await axios.post('http://localhost:8081/users/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Server response:', springResponse);
      
      if (springResponse.data === 'Login successful') {
        try {
          const userResponse = await axios.get(`http://localhost:8081/users/findByEmail?email=${formData.email}`);
          
          if (userResponse.data) {
            // Store complete user data locally
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            localStorage.setItem('userId', userResponse.data.id);

            // Also store user preferences and settings in the expected format
            const defaultUserData = {
              username: userResponse.data.username || formData.email.split('@')[0],
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
      const parts = heightStr.split("'");
      const feet = parseInt(parts[0]) || 0;
      const inches = parseInt(parts[1]) || 0;
      return (feet * 12) + inches;
    } catch (e) {
      console.error("Error parsing height:", e);
      return 0;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errors.login && <p className="error">{errors.login}</p>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <p className="error">{errors.email}</p>}
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
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="/">Create one here</a></p>
    </form>
  );
}

export default Login;
