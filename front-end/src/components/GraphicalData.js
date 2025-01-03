import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const GraphicalData = ({ data }) => {
  const chartData = {
    labels: ["Calories", "Protein", "Fat", "Carbohydrates"],
    datasets: [
      {
        label: "Nutritional Value",
        data: [data.calories, data.protein, data.fat, data.carbs],
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
      },
    ],
  };

  return (
    <div>
      <h2>Graphical Data</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default GraphicalData;
