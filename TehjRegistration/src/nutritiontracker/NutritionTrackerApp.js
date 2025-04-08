import React, { useState } from 'react';
import SearchPanel from './components/SearchPanel';
import GraphPanel from './components/GraphPanel';
import { searchFoodFromAPI } from './utils/api';
import './App.css';

function NutritionTrackerApp() {
  const [trackedFoods, setTrackedFoods] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const searchFood = async (foodQuery) => {
    if (!foodQuery.trim()) {
      alert('Please enter a food name');
      return;
    }

    setIsLoading(true);
    setSearchResults([]);

    try {
      console.log(`Searching for: "${foodQuery}"`);
      const foods = await searchFoodFromAPI(foodQuery);
      
      if (foods.length > 0) {
        console.log(`Found ${foods.length} food items`);
        setSearchResults(foods);
      } else {
        console.log('No foods found');
        alert('No foods found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Error searching for food: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addFoodToTracker = (foodItem) => {
    setTrackedFoods(prev => [...prev, foodItem]);
  };

  const removeFoodFromTracker = (index) => {
    setTrackedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const clearTrackedFoods = () => {
    setTrackedFoods([]);
    setShowBreakdown(false);
  };

  const toggleBreakdown = () => {
    setShowBreakdown(prev => !prev);
  };

  return (
    <div className="nutrition-tracker-app">
      <div className="container">
        <SearchPanel 
          searchFood={searchFood} 
          searchResults={searchResults}
          trackedFoods={trackedFoods}
          addFoodToTracker={addFoodToTracker}
          removeFoodFromTracker={removeFoodFromTracker}
          clearTrackedFoods={clearTrackedFoods}
          isLoading={isLoading}
          showBreakdown={showBreakdown}
          toggleBreakdown={toggleBreakdown}
        />
        <GraphPanel 
          trackedFoods={trackedFoods}
        />
      </div>
    </div>
  );
}

export default NutritionTrackerApp;
