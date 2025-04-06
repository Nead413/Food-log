import { API_KEY } from '../constants/config';

export const searchFoodFromAPI = async (foodQuery) => {
  const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodQuery}&api_key=${API_KEY}`);
  const data = await response.json();
  return data.foods || [];
};