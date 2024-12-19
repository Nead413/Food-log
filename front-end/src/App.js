import React, { useState } from "react";
import Header from "./components/Header";
import FoodInput from "./components/FoodInput";
import NutritionalBreakdown from "./components/NutritionalBreakdown";
import GraphicalData from "./components/GraphicalData";
import "./App.css";

const App = () => {
  const [nutritionalData, setNutritionalData] = useState(null);

  const handleFoodInput = (data) => {
    setNutritionalData(data);
  };

  return (
    <div className="app">
      <Header />
      <FoodInput onFoodInput={handleFoodInput} />
      {nutritionalData && (
        <>
          <NutritionalBreakdown data={nutritionalData} />
          <GraphicalData data={nutritionalData} />
        </>
      )}
    </div>
  );
};

export default App;
