package com.example.demo.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String username) {
        if (username != null) {
            return userRepository.findAll().stream()
                        .filter(user -> user.getUsername().equalsIgnoreCase(username))
                        .collect(Collectors.toList());
        }
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            // Check if user already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User with this email already exists");
            }

            // Save user to database
            User savedUser = userService.saveUser(user);
            
            // Remove sensitive data before returning
            savedUser.setPassword(null);
            savedUser.setConfirmPassword(null);
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUser);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating user: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/findByEmail")
    public ResponseEntity<?> findUserByEmail(@RequestParam String email) {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                // Don't return the password in the response
                User userResponse = user.get();
                userResponse.setPassword(null);
                userResponse.setConfirmPassword(null);
                return ResponseEntity.ok(userResponse);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error finding user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        try {
            if (loginUser.getEmail() == null || loginUser.getPassword() == null) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email and password are required");
            }

            Optional<User> userOptional = userRepository.findByEmail(loginUser.getEmail());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Add debug logging to see what's being compared
                System.out.println("Login attempt: " + loginUser.getEmail());
                System.out.println("Input password length: " + (loginUser.getPassword() != null ? loginUser.getPassword().length() : 0));
                System.out.println("Stored hash exists: " + (user.getPassword() != null));
                
                if (bCryptPasswordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
                    System.out.println("Login successful for: " + user.getEmail());
                    return ResponseEntity.ok("Login successful");
                } else {
                    System.out.println("Password does not match for: " + user.getEmail());
                }
            } else {
                System.out.println("No user found with email: " + loginUser.getEmail());
            }
            
            // For security reasons, don't be too specific about which part failed
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
        } catch (Exception e) {
            // Replace printStackTrace with proper logging
            System.err.println("Login error: " + e.getMessage());
            // Create a dedicated logger for production code
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during login: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(@RequestParam String email, @RequestBody Map<String, String> credentials) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();
            // Verify password before deletion
            if (!bCryptPasswordEncoder.matches(credentials.get("password"), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }

            userRepository.delete(user);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting account: " + e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<List<User>> exportUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importUsers(@RequestBody List<User> users) {
        try {
            users.forEach(user -> {
                user.setId(0); // Reset IDs for new insert
                userService.saveUser(user);
            });
            return ResponseEntity.ok("Users imported successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error importing users: " + e.getMessage());
        }
    }
}
