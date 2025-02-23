package com.example.demo.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "\"USER\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Username is mandatory")
    private String username;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, message = "Password should have at least 6 characters")
    private String password;

    private String confirmPassword;
    private String height;
    private String heightUnit;
    private String weight;
    private String weightUnit;
    private String desiredWeight;
    private String sex;
    private String dob;

    @OneToMany(mappedBy = "user")
    private List<FoodLog> foodLogs;

    @OneToMany(mappedBy = "user")
    private List<ExerciseLog> exerciseLogs;

    @OneToMany(mappedBy = "user")
    private List<Goal> goals;

    // Constructor to initialize all fields
    public User(String username, String email, String password, String confirmPassword,
                String height, String heightUnit, String weight, String weightUnit,
                String desiredWeight, String sex, String dob) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.height = height;
        this.heightUnit = heightUnit;
        this.weight = weight;
        this.weightUnit = weightUnit;
        this.desiredWeight = desiredWeight;
        this.sex = sex;
        this.dob = dob;
    }

    // Default constructor
    public User() {}

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }

    public String getHeightUnit() { return heightUnit; }
    public void setHeightUnit(String heightUnit) { this.heightUnit = heightUnit; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getWeightUnit() { return weightUnit; }
    public void setWeightUnit(String weightUnit) { this.weightUnit = weightUnit; }

    public String getDesiredWeight() { return desiredWeight; }
    public void setDesiredWeight(String desiredWeight) { this.desiredWeight = desiredWeight; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public List<FoodLog> getFoodLogs() { return foodLogs; }
    public void setFoodLogs(List<FoodLog> foodLogs) { this.foodLogs = foodLogs; }

    public List<ExerciseLog> getExerciseLogs() { return exerciseLogs; }
    public void setExerciseLogs(List<ExerciseLog> exerciseLogs) { this.exerciseLogs = exerciseLogs; }

    public List<Goal> getGoals() { return goals; }
    public void setGoals(List<Goal> goals) { this.goals = goals; }
}
