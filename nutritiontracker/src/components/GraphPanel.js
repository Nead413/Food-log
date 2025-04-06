import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { getNutrientValue } from '../utils/nutrientCalculator';

function GraphPanel({ trackedFoods }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const calculateNutrients = () => {
    const labels = ['Protein (g)', 'Total Sugars (g)', 'Total Fat (g)', 'Carbohydrates (g)', 'Fiber (g)'];
    let protein = 0, totalSugars = 0, fat = 0, carbs = 0, fiber = 0;

    trackedFoods.forEach(food => {
      protein += getNutrientValue(food, 'Protein');
      totalSugars += getNutrientValue(food, 'Total Sugars');
      fat += getNutrientValue(food, 'Total lipid (fat)');
      carbs += getNutrientValue(food, 'Carbohydrate, by difference');
      fiber += getNutrientValue(food, 'Fiber, total dietary');
    });

    return {
      labels,
      data: [
        Number(protein.toFixed(2)), 
        Number(totalSugars.toFixed(2)), 
        Number(fat.toFixed(2)), 
        Number(carbs.toFixed(2)), 
        Number(fiber.toFixed(2))
      ]
    };
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const { labels, data } = calculateNutrients();

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
          borderColor: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed.y + 'g';
              }
            }
          }
        }
      }
    });
  }, [trackedFoods]);

  return (
    <div className="right-panel">
      <h3>Macronutrient Graph</h3>
      <canvas ref={chartRef} id="macronutrientChart" width="800" height="600"></canvas>
    </div>
  );
}

export default GraphPanel;