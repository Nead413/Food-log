package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import jakarta.persistence.EntityManager;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Autowired
    private EntityManager entityManager;

    @Transactional
    public User saveUser(User user) {
        try {
            System.out.println("UserService.saveUser - Encoding password for: " + user.getUsername());
            // Ensure the password is not null or empty
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Password cannot be null or empty");
            }
            
            // Encrypt the password
            String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            
            // Save the user to the database
            System.out.println("UserService.saveUser - Saving user to database: " + user.getUsername());
            User savedUser = userRepository.save(user);
            
            // Force flush to ensure the entity is persisted immediately
            entityManager.flush();
            
            // Verify the user was saved by querying it back
            Optional<User> verifiedUser = userRepository.findById(savedUser.getId());
            if (verifiedUser.isPresent()) {
                System.out.println("UserService.saveUser - User verified in database with ID: " + savedUser.getId());
            } else {
                System.err.println("UserService.saveUser - WARNING: User not found in database after save!");
            }
            
            return savedUser;
        } catch (Exception e) {
            System.err.println("UserService.saveUser - Error while saving user: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw the exception to be handled by the controller
        }
    }

    /**
     * Find a user by either username or email
     * @param identifier The username or email to search for
     * @return Optional<User> The user if found, empty otherwise
     */
    public Optional<User> findByUsernameOrEmail(String identifier) {
        // First try by email
        Optional<User> user = userRepository.findByEmail(identifier);
        if (!user.isPresent()) {
            // If not found by email, try by username
            user = userRepository.findByUsername(identifier);
        }
        return user;
    }
}
