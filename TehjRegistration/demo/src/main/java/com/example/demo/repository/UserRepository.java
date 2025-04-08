package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    
    // Find all users with the same email
    List<User> findAllByEmail(String email);
    
    // Find all users with the same username
    List<User> findAllByUsername(String username);
    
    // Custom query to find first user by email or username
    @Query("SELECT u FROM User u WHERE u.email = ?1 OR u.username = ?1 ORDER BY u.id ASC LIMIT 1")
    Optional<User> findFirstByEmailOrUsername(String identifier);
}
