package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ExerciseLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String exerciseName;
    private int duration; // in minutes
    private String date;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // Default constructor
    public ExerciseLog() {}

    // Constructor with attributes
    public ExerciseLog(String exerciseName, int duration, String date, User user) {
        this.exerciseName = exerciseName;
        this.duration = duration;
        this.date = date;
        this.user = user;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
