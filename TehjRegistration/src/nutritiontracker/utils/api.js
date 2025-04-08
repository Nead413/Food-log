// Replace the placeholder with a real USDA API key
const API_KEY = "lbwj9tTDOgoh8MUEHdzU3ItZdFdfpKeEkWGSmwI7"; // USDA FoodData Central API key

export const searchFoodFromAPI = async (foodQuery) => {
  try {
    console.log(`Searching for food: ${foodQuery}`);
    const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodQuery}&api_key=${API_KEY}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}): ${errorText}`);
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.foods?.length || 0} results`);
    return data.foods || [];
  } catch (error) {
    console.error("Error fetching food data:", error);
    return [];
  }
};
