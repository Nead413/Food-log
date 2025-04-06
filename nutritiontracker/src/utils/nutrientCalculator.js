export const getNutrientValue = (food, nutrientName) => {
  const nutrient = food.foodNutrients ? 
    food.foodNutrients.find(nutrient => nutrient.nutrientName === nutrientName) 
    : null;
  return nutrient ? nutrient.value : 0;
};

export const calculateTotalCalories = (trackedFoods) => {
  return trackedFoods.reduce((total, food) => 
    total + getNutrientValue(food, 'Energy'), 0
  );
};

export const calculateNutrient = (trackedFoods, nutrientName) => {
  return trackedFoods.reduce((total, food) => 
    total + getNutrientValue(food, nutrientName), 0
  );
};