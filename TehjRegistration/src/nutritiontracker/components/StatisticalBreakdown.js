import React from 'react';
import { 
  calculateTotalCalories, 
  calculateNutrient 
} from '../utils/nutrientCalculator';

function StatisticalBreakdown({ trackedFoods }) {
  return (
    <div id="statisticalBreakdown">
      <h4>Statistical Breakdown</h4>
      <p><strong>Calories:</strong> <span id="caloriesStat">{calculateTotalCalories(trackedFoods).toFixed(2)} kcal</span></p>
      <p><strong>Fat:</strong> <span id="fatStat">{calculateNutrient(trackedFoods, 'Total lipid (fat)').toFixed(2)} g</span></p>
      <p><strong>Protein:</strong> <span id="proteinStat">{calculateNutrient(trackedFoods, 'Protein').toFixed(2)} g</span></p>
      <p><strong>Carbs:</strong> <span id="carbsStat">{calculateNutrient(trackedFoods, 'Carbohydrate, by difference').toFixed(2)} g</span></p>
      <p><strong>Fiber:</strong> <span id="fiberStat">{calculateNutrient(trackedFoods, 'Fiber, total dietary').toFixed(2)} g</span></p>
      <p><strong>Sugars:</strong> <span id="sugarsStat">{calculateNutrient(trackedFoods, 'Total Sugars').toFixed(2)} g</span></p>
    </div>
  );
}

export default StatisticalBreakdown;
