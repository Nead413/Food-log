import React, { useState } from 'react';
import StatisticalBreakdown from './StatisticalBreakdown';

function SearchPanel({ 
  searchFood, 
  searchResults, 
  trackedFoods, 
  addFoodToTracker, 
  removeFoodFromTracker,
  clearTrackedFoods,
  isLoading,
  showBreakdown,
  toggleBreakdown 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    searchFood(searchTerm);
  };

  return (
    <div className="left-panel">
      <div className="search-box">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="foodInput" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for food..." 
          />
          <button type="submit" id="searchButton" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {isLoading && <div id="loading">Loading...</div>}
      </div>

      {searchResults.length > 0 && (
        <div id="foodListContainer" className="food-list-container">
          <h4>Search Results - Click to Add</h4>
          {searchResults.map((food, index) => (
            <button 
              key={index} 
              className="food-option"
              onClick={() => addFoodToTracker(food)}
              title={food.description}
            >
              {food.description}
            </button>
          ))}
        </div>
      )}

      <div className="tracker">
        <h3>Tracked Foods</h3>
        {trackedFoods.length === 0 ? (
          <p>No foods tracked yet. Search and add foods above.</p>
        ) : (
          <ul id="trackedFoodsList">
            {trackedFoods.map((food, index) => (
              <li 
                key={index} 
                onClick={() => removeFoodFromTracker(index)}
                title="Click to remove"
              >
                {food.description}
              </li>
            ))}
          </ul>
        )}
        <button id="clearTracker" onClick={clearTrackedFoods} disabled={trackedFoods.length === 0}>Clear Tracker</button>
        <button id="showBreakdown" onClick={toggleBreakdown} disabled={trackedFoods.length === 0}>
          {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
        </button>

        {showBreakdown && <StatisticalBreakdown trackedFoods={trackedFoods} />}
      </div>
    </div>
  );
}

export default SearchPanel;
