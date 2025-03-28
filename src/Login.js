import React, { useState, useEffect } from 'react';
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

  // Auto-redirect to homepage ONLY in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      navigate('/homepage');
    }
  }, [navigate]);

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
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            localStorage.setItem('userId', userResponse.data.id);

            navigate('/homepage');
          } else {
            setErrors({ login: 'User data not found' });
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setErrors({ login: 'Login successful but could not fetch user data' });
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
