package com.example.demo.service;

import com.example.demo.model.FoodLog;
import com.example.demo.repository.FoodLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodLogService {

    @Autowired
    private FoodLogRepository foodLogRepository;

    // Create a new food log
    public FoodLog createFoodLog(FoodLog foodLog) {
        return foodLogRepository.save(foodLog);
    }

    // Get all food logs
    public List<FoodLog> getAllFoodLogs() {
        return foodLogRepository.findAll();
    }

    // Get a food log by ID
    public FoodLog getFoodLogById(int id) {
        Optional<FoodLog> foodLog = foodLogRepository.findById(id);
        return foodLog.orElse(null); // Return null if not found
    }

    // Delete a food log by ID
    public void deleteFoodLog(int id) {
        foodLogRepository.deleteById(id);
    }

    // Update an existing food log by ID
    public FoodLog updateFoodLog(int id, FoodLog foodLog) {
        Optional<FoodLog> existingFoodLog = foodLogRepository.findById(id);
        if (existingFoodLog.isPresent()) {
            FoodLog updatedFoodLog = existingFoodLog.get();
            updatedFoodLog.setFoodName(foodLog.getFoodName());
            updatedFoodLog.setCalories(foodLog.getCalories());
            updatedFoodLog.setDate(foodLog.getDate());
            updatedFoodLog.setUser(foodLog.getUser());
            return foodLogRepository.save(updatedFoodLog);
        }
        return null; // Return null if food log with given ID does not exist
    }
}

