package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class FoodLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String foodName;
    private int calories;
    private String date;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // Default constructor
    public FoodLog() {}

    // Constructor with attributes
    public FoodLog(String foodName, int calories, String date, User user) {
        this.foodName = foodName;
        this.calories = calories;
        this.date = date;
        this.user = user;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
