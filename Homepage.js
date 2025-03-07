import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <header className="nav-bar">
        <h1 className="logo">Healthy Habits</h1>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/food-log">Food Log</Link></li>
            <li><Link to="/workouts">Workouts</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Track Your Meals. Achieve Your Goals.</h2>
        <p>Join thousands of users making healthy choices every day.</p>
        <button className="cta-button">Get Started</button>
      </section>

            {/* Video Section */}
            <section className="video-section">
        <h3>Motivational Video of the Day</h3>
        <iframe
          width="560" // Width of the video
          height="500" // Height of the video
          src="https://www.youtube.com/embed/_JRefJH6N00?si=grSwgYx8mzCz0jCa"  // Replace with your video URL
          title="YouTube video"
          frameBorder="0" // Optional for border
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen // Allow full screen view
        ></iframe>
      </section>

      {/* Quick Stats Section */}
      <section className="quick-stats">
        <h3>Your Daily Progress</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-number">1200</p>
            <p className="stat-label">Calories Consumed</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">3/5</p>
            <p className="stat-label">Workouts Completed</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">2L</p>
            <p className="stat-label">Water Intake</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Buttons */}
      <section className="actions">
        <h3>What Would You Like to Do?</h3>
        <button>Log a Meal</button>
        <button>Track a Workout</button>
        <button>View Progress</button>
      </section>

      {/* Motivation Section */}
      <section className="motivation">
        <h3>Quote of The Day</h3>
        <blockquote>
          "Success is the sum of small efforts, repeated day in and day out."
        </blockquote>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Healthy Habits. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
