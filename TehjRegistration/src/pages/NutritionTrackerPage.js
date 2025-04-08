import React from 'react';
import { Link } from 'react-router-dom';
import NutritionTrackerApp from '../nutritiontracker/NutritionTrackerApp';
import '../pages/WorkoutsPage.css'; // Use the same styling as the workout page

const NutritionTrackerPage = () => {
  return (
    <div className="workouts-container">
      <header className="workouts-header">
        <h1>Food Tracker</h1>
        <nav>
          <ul>
            <li><Link to="/homepage">Home</Link></li>
            <li className="active"><Link to="/nutritiontracker">Food Log</Link></li>
            <li><Link to="/workouts">Workouts</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/login">Sign Out</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="nutrition-tracker-wrapper">
        <div className="api-status-note">
          <p><strong>Note:</strong> This tracker uses the USDA FoodData Central API. If searches return no results, please check the console for API errors.</p>
        </div>
        <NutritionTrackerApp />
      </div>
    </div>
  );
};

export default NutritionTrackerPage;
