import React, { useState } from 'react';
import Header from './components/Header';
import SearchPanel from './components/SearchPanel';
import GraphPanel from './components/GraphPanel';
import { searchFoodFromAPI } from './utils/api';
import './App.css';

function App() {
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
      const foods = await searchFoodFromAPI(foodQuery);
      
      if (foods.length > 0) {
        setSearchResults(foods);
      } else {
        alert('No foods found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('There was an error fetching data.');
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
    <div className="App">
      <Header />
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

export default App;