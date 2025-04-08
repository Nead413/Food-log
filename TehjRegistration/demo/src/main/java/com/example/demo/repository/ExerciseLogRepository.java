package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.ExerciseLog;
import com.example.demo.model.User;

@Repository
public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Integer> {
    List<ExerciseLog> findByUser(User user);
    
    // We don't need this method if we use User object directly
    // but keeping it for backward compatibility
    List<ExerciseLog> findByUserId(Integer userId);
}
