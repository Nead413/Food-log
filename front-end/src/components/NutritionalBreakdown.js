import React from "react";

const NutritionalBreakdown = ({ data }) => (
  <div>
    <h2>Nutritional Breakdown</h2>
    <p>Calories: {data.calories} kcal</p>
    <p>Protein: {data.protein} g</p>
    <p>Fat: {data.fat} g</p>
    <p>Carbohydrates: {data.carbs} g</p>
  </div>
);

export default NutritionalBreakdown;
