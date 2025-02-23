package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Goal;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Integer> {
}
