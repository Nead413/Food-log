package com.example.demo.Controller;

import com.example.demo.model.FoodLog;
import com.example.demo.service.FoodLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foodlog")
public class FoodLogController {

    @Autowired
    private FoodLogService foodLogService;

    // Save a new food log
    @PostMapping
    public ResponseEntity<FoodLog> createFoodLog(@RequestBody FoodLog foodLog) {
        return ResponseEntity.ok(foodLogService.createFoodLog(foodLog));
    }

    // Get all food logs
    @GetMapping
    public ResponseEntity<List<FoodLog>> getAllFoodLogs() {
        return ResponseEntity.ok(foodLogService.getAllFoodLogs());
    }

    // Get food log by ID
    @GetMapping("/{id}")
    public ResponseEntity<FoodLog> getFoodLogById(@PathVariable int id) {
        return ResponseEntity.ok(foodLogService.getFoodLogById(id));
    }

    // Delete a food log by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFoodLog(@PathVariable int id) {
        foodLogService.deleteFoodLog(id);
        return ResponseEntity.ok("Food log deleted successfully!");
    }

    // Update an existing food log by ID
    @PutMapping("/{id}")
    public ResponseEntity<FoodLog> updateFoodLog(@PathVariable int id, @RequestBody FoodLog foodLog) {
        return ResponseEntity.ok(foodLogService.updateFoodLog(id, foodLog));
    }
}
