// Initialize DOM elements only after document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'lbwj9tTDOgoh8MUEHdzU3ItZdFdfpKeEkWGSmwI7'; // USDA API KEY. DO NOT CHANGE.
    const trackedFoods = [];
    
    // Initialize Chart.js
    let myChart = null;
    
    // Load Chart.js script immediately
    (function loadChartJsScript() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1';
        script.async = true;
        document.head.appendChild(script);
    })();
    
    // Function to check if Chart.js is available
    function isChartJsLoaded() {
        return typeof window.Chart !== 'undefined';
    }
    
    // Initialize UI elements
    const searchButton = document.getElementById('searchButton');
    const foodInput = document.getElementById('foodInput');
    const loadingIndicator = document.getElementById('loading');
    const foodListContainer = document.getElementById('foodListContainer');
    const trackedFoodsList = document.getElementById('trackedFoodsList');
    const clearTrackerButton = document.getElementById('clearTracker');
    const showBreakdownButton = document.getElementById('showBreakdown');
    const statisticalBreakdown = document.getElementById('statisticalBreakdown');
    const chartCanvas = document.getElementById('macronutrientChart');
    
    // Add new button for logging food
    const logFoodButton = document.createElement('button');
    logFoodButton.id = 'logFoodButton';
    logFoodButton.textContent = 'Log Food to Database';
    logFoodButton.style.marginTop = '10px';
    logFoodButton.style.backgroundColor = 'var(--primary-color)';
    logFoodButton.style.color = 'white';
    logFoodButton.style.padding = '8px 16px';
    logFoodButton.style.border = 'none';
    logFoodButton.style.borderRadius = '4px';
    logFoodButton.style.cursor = 'pointer';
    
    // Append log button after the breakdown button
    showBreakdownButton.parentNode.insertBefore(logFoodButton, statisticalBreakdown);
    
    // Make sure all elements exist
    if (!searchButton || !foodInput || !loadingIndicator || !foodListContainer || 
        !trackedFoodsList || !clearTrackerButton || !showBreakdownButton || 
        !statisticalBreakdown || !chartCanvas) {
        console.error('Some UI elements are missing');
        return;
    }
    
    // Search button click handler
    searchButton.addEventListener('click', function (e) {
        e.preventDefault();
        const foodQuery = foodInput.value.trim();

        if (!foodQuery) {
            alert('Please enter a food name');
            return;
        }

        loadingIndicator.style.display = 'block';
        foodListContainer.style.display = 'none';
        foodListContainer.innerHTML = '';  // Clear previous results only, not tracked foods

        fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodQuery}&api_key=${apiKey}`) // DO NOT CHANGE THIS.
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                loadingIndicator.style.display = 'none';

                if (data.foods && data.foods.length > 0) {
                    foodListContainer.style.display = 'grid';

                    data.foods.forEach(food => {
                        const foodOption = document.createElement('button');
                        foodOption.classList.add('food-option');
                        foodOption.textContent = food.description;
                        foodOption.onclick = function () {
                            addFoodToTracker(food);
                        };
                        foodListContainer.appendChild(foodOption);
                    });
                } else {
                    alert('No foods found.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                loadingIndicator.style.display = 'none';
                alert('There was an error fetching data: ' + error.message);
            });
    });

    // Add food to the tracker list
    function addFoodToTracker(foodItem) {
        trackedFoods.push(foodItem);
        updateTrackedFoods();
        updateGraph();
    }

    // Update the list of tracked foods
    function updateTrackedFoods() {
        trackedFoodsList.innerHTML = '';

        trackedFoods.forEach((food, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = food.description;
            listItem.onclick = function () {
                removeFoodFromTracker(index);
            };
            trackedFoodsList.appendChild(listItem);
        });
    }

    // Remove food from the tracker list
    function removeFoodFromTracker(index) {
        trackedFoods.splice(index, 1);
        updateTrackedFoods();
        updateGraph();
    }

    // Clear the tracker list
    clearTrackerButton.addEventListener('click', function () {
        trackedFoods.length = 0;
        updateTrackedFoods();
        updateGraph();
        hideStatisticalBreakdown();
    });

    // Show or hide the statistical breakdown
    showBreakdownButton.addEventListener('click', function () {
        if (statisticalBreakdown.style.display === 'none') {
            statisticalBreakdown.style.display = 'block';
            updateStatisticalBreakdownFromGraph();
        } else {
            statisticalBreakdown.style.display = 'none';
        }
    });

    // Update the nutrient graph and calories
    function updateGraph() {
        if (myChart) {
            myChart.destroy();
        }

        // If no foods tracked, show empty chart
        if (trackedFoods.length === 0) {
            document.getElementById('caloriesStat').textContent = '0 kcal';
            document.getElementById('fatStat').textContent = '0 g';
            document.getElementById('proteinStat').textContent = '0 g';
            document.getElementById('carbsStat').textContent = '0 g';
            document.getElementById('fiberStat').textContent = '0 g';
            document.getElementById('sugarsStat').textContent = '0 g';
            return;
        }

        const labels = ['Protein (g)', 'Total Sugars (g)', 'Total Fat (g)', 'Carbohydrates (g)', 'Fiber (g)'];

        let protein = 0, totalSugars = 0, fat = 0, carbs = 0, fiber = 0;

        trackedFoods.forEach(food => {
            protein += getNutrientValue(food, 'Protein');
            totalSugars += getNutrientValue(food, 'Total Sugars');
            fat += getNutrientValue(food, 'Total lipid (fat)');
            carbs += getNutrientValue(food, 'Carbohydrate, by difference');
            fiber += getNutrientValue(food, 'Fiber, total dietary');
        });

        protein = roundToTwoDecimalPlaces(protein);
        totalSugars = roundToTwoDecimalPlaces(totalSugars);
        fat = roundToTwoDecimalPlaces(fat);
        carbs = roundToTwoDecimalPlaces(carbs);
        fiber = roundToTwoDecimalPlaces(fiber);

        // Create chart data based on the updated nutrients
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Nutrient Amount (g)',
                data: [protein, totalSugars, fat, carbs, fiber],
                backgroundColor: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
                borderColor: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
                borderWidth: 1
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.raw + 'g';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333'
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#ddd'
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333'
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#ddd'
                    }
                }
            }
        };

        try {
            // Check if Chart.js is loaded
            if (!isChartJsLoaded()) {
                // If not loaded, wait and try again in 500ms
                console.log('Chart.js not loaded yet, waiting...');
                setTimeout(updateGraph, 500);
                return;
            }
            
            createChart(chartCanvas, chartData, chartOptions);
        } catch (error) {
            console.error("Error creating chart:", error);
        }
    }
    
    function createChart(canvas, data, options) {
        // Only create chart if Chart.js is loaded
        if (!isChartJsLoaded()) {
            console.error("Chart.js is not loaded");
            return;
        }
        
        // Add responsive options
        const responsiveOptions = {
            ...options,
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5 // Width:height ratio
        };
        
        const ctx = canvas.getContext('2d');
        myChart = new window.Chart(ctx, {
            type: 'bar',
            data: data,
            options: responsiveOptions
        });
        
        updateStatisticalBreakdownFromGraph();
    }

    function updateStatisticalBreakdownFromGraph() {
        const totalCalories = getTotalCalories();
        
        // Get the values directly from our calculations, not from the chart
        document.getElementById('caloriesStat').textContent = `${roundToTwoDecimalPlaces(totalCalories)} kcal`;
        
        if (myChart && myChart.data && myChart.data.datasets[0].data) {
            const chartData = myChart.data.datasets[0].data;
            const [protein, totalSugars, fat, carbs, fiber] = chartData;
            
            document.getElementById('fatStat').textContent = `${fat} g`;
            document.getElementById('proteinStat').textContent = `${protein} g`;
            document.getElementById('carbsStat').textContent = `${carbs} g`;
            document.getElementById('fiberStat').textContent = `${fiber} g`;
            document.getElementById('sugarsStat').textContent = `${totalSugars} g`;
        }
    }

    function getTotalCalories() {
        let totalCalories = 0;
        trackedFoods.forEach(food => {
            totalCalories += getNutrientValue(food, 'Energy');
        });
        return totalCalories;
    }

    function roundToTwoDecimalPlaces(value) {
        return parseFloat(value.toFixed(2));
    }

    function getNutrientValue(food, nutrientName) {
        if (!food || !food.foodNutrients) return 0;
        
        const nutrient = food.foodNutrients.find(n => n.nutrientName === nutrientName);
        return nutrient ? nutrient.value : 0;
    }

    function hideStatisticalBreakdown() {
        statisticalBreakdown.style.display = 'none';
    }

    // Log Food button click handler
    logFoodButton.addEventListener('click', function() {
        if (trackedFoods.length === 0) {
            alert('Please add foods to track before logging');
            return;
        }

        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to save your food log');
            return;
        }
        
        // Calculate totals for all tracked foods
        let totalCalories = 0, totalProtein = 0, totalFat = 0, 
            totalCarbs = 0, totalFiber = 0, totalSugar = 0;
        
        trackedFoods.forEach(food => {
            totalCalories += getNutrientValue(food, 'Energy');
            totalProtein += getNutrientValue(food, 'Protein');
            totalFat += getNutrientValue(food, 'Total lipid (fat)');
            totalCarbs += getNutrientValue(food, 'Carbohydrate, by difference');
            totalFiber += getNutrientValue(food, 'Fiber, total dietary');
            totalSugar += getNutrientValue(food, 'Total Sugars');
        });
        
        // Create payload
        const foodLogData = {
            userId: userId,
            foodName: trackedFoods.map(f => f.description).join(", "),
            calories: roundToTwoDecimalPlaces(totalCalories),
            protein: roundToTwoDecimalPlaces(totalProtein),
            carbs: roundToTwoDecimalPlaces(totalCarbs),
            fat: roundToTwoDecimalPlaces(totalFat),
            fiber: roundToTwoDecimalPlaces(totalFiber),
            sugar: roundToTwoDecimalPlaces(totalSugar)
        };
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        
        // Check server connectivity first
        fetch('http://localhost:8081/api/food-logs', {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            // If server responds to OPTIONS, proceed with POST
            fetch('http://localhost:8081/api/food-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(foodLogData)
            })
            .then(response => {
                loadingIndicator.style.display = 'none';
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to log food');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Food logged successfully!');
                // Clear the tracker after successful logging
                trackedFoods.length = 0;
                updateTrackedFoods();
                updateGraph();
                hideStatisticalBreakdown();
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                console.error('Error logging food:', error);
                alert('Error logging food: ' + error.message);
            });
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            console.error('Server connectivity issue:', error);
            alert('Cannot connect to the server. Please check if the server is running on port 8080. Error: ' + error.message);
        });
    });
});
