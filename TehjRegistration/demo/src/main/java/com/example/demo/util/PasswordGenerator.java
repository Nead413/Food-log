package com.example.demo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Password hash for 'password123': " + encoder.encode("password123"));
        
        // Check if our test password matches the hash in data.sql
        System.out.println("Does 'password123' match stored hash?: " + 
            encoder.matches("password123", "$2a$10$9tWNGK8wZgoHQeBL3ZEZKOhZnKIXYUFpRjPaJQWq1V95AQ19o9br6"));
    }
}
