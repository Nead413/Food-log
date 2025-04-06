import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // optional, if you want to add custom styling

const NavBar = () => {
  return (
    <header className="nav-bar">
      <h1 className="logo"><Link to="/homepage">Healthy Habits</Link></h1>
      <nav>
        <ul>
          <li><Link to="/food-log">Food Log</Link></li>
          <li><Link to="/workouts">Workouts</Link></li>
          <li><Link to="/tracker">Tracker</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
