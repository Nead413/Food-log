import React from 'react';
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const foodQuery = e.target.elements.foodInput.value;
    searchFood(foodQuery);
  };

  return (
    <div className="left-panel">
      <div className="search-box">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="foodInput" 
            placeholder="Search for food..." 
          />
          <button type="submit" id="searchButton">Search</button>
        </form>
        {isLoading && <div id="loading">Loading...</div>}
      </div>

      {searchResults.length > 0 && (
        <div id="foodListContainer" className="food-list-container">
          {searchResults.map((food, index) => (
            <button 
              key={index} 
              className="food-option"
              onClick={() => addFoodToTracker(food)}
            >
              {food.description}
            </button>
          ))}
        </div>
      )}

      <div className="tracker">
        <h3>Tracked Foods</h3>
        <ul id="trackedFoodsList">
          {trackedFoods.map((food, index) => (
            <li 
              key={index} 
              onClick={() => removeFoodFromTracker(index)}
            >
              {food.description}
            </li>
          ))}
        </ul>
        <button id="clearTracker" onClick={clearTrackedFoods}>Clear Tracker</button>
        <button id="showBreakdown" onClick={toggleBreakdown}>
          {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
        </button>

        {showBreakdown && <StatisticalBreakdown trackedFoods={trackedFoods} />}
      </div>
    </div>
  );
}

export default SearchPanel;