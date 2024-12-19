import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const FoodInput = ({ onFoodInput }) => {
  const [foodName, setFoodName] = useState("");

  const fetchFoodData = async (food) => {
    const apiKey = "oAdhuGTKFXxD3pri4fxKqZjRb4rgWfezdh1jxnMk"; // Replace with your actual API key
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${apiKey}`
    );
    const data = await response.json();
    const nutrients = data.foods[0]?.foodNutrients || [];
    const mappedData = {
      calories: nutrients.find((n) => n.nutrientName === "Energy")?.value || 0,
      protein: nutrients.find((n) => n.nutrientName === "Protein")?.value || 0,
      fat: nutrients.find((n) => n.nutrientName === "Total lipid (fat)")?.value || 0,
      carbs: nutrients.find((n) => n.nutrientName === "Carbohydrate, by difference")?.value || 0,
    };
    onFoodInput(mappedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFoodData(foodName);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="foodInput">
        <Form.Label>Enter Food Name</Form.Label>
        <Form.Control
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="e.g. Apple, Chicken Breast"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Get Nutritional Info
      </Button>
    </Form>
  );
};

export default FoodInput;
