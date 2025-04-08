import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; // optional, if you want to add custom styling

const NavBar = () => {
  const navigate = useNavigate();  // Hook for programmatically navigating

  const handleSignOut = () => {
    // Clear the authentication data from localStorage or sessionStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('dietTrackerUserData');

    // Redirect the user to the login page
    navigate('/');
  };

  return (
    <header className="nav-bar">
      <h1 className="logo"><Link to="/homepage">Healthy Habits</Link></h1>
      <nav>
        <ul>
          <li><Link to="/nutritiontracker">Food Log</Link></li>
          <li><Link to="/workouts">Workouts</Link></li>
          <li><Link to="/tracker">Tracker</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
