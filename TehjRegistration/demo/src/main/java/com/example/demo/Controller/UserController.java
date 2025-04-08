package com.example.demo.Controller;

import java.io.File;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
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
            // Debug: Log the incoming user data (exclude password for security)
            System.out.println("Attempting to register user: " + user.getUsername() + ", Email: " + user.getEmail());
            
            // Check if user already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                System.out.println("Registration failed: Email already exists: " + user.getEmail());
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User with this email already exists");
            }
            
            // Additional check for username uniqueness
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                System.out.println("Registration failed: Username already exists: " + user.getUsername());
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User with this username already exists");
            }
            
            // Save user to databasea
            System.out.println("Savinag user to database...");
            User savedUser = userService.saveUser(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            
            // Verify the user was actually saved
            Optional<User> verifiedUser = userRepository.findById(savedUser.getId());
            if (verifiedUser.isPresent()) {
                System.out.println("Verification - User exists in database with ID: " + verifiedUser.get().getId());
            } else {
                System.err.println("WARNING: User was not found in database after save!");
            }
            
            // Remove sensitive data before returning
            savedUser.setPassword(null);
            savedUser.setConfirmPassword(null);
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUser);
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
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
            String loginIdentifier = loginUser.getEmail();
            String password = loginUser.getPassword();
            
            if (loginIdentifier == null || password == null) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Login identifier and password are required");
            }
            
            // Try to find user by email first
            Optional<User> userOptional = userRepository.findByEmail(loginIdentifier);
            
            // If not found by email, try by username
            if (!userOptional.isPresent()) {
                userOptional = userRepository.findByUsername(loginIdentifier);
            }
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Add debug logging
                System.out.println("Login attempt: " + loginIdentifier);
                System.out.println("User found with ID: " + user.getId());
                System.out.println("Input password length: " + (password != null ? password.length() : 0));
                System.out.println("Stored hash exists: " + (user.getPassword() != null));
                
                if (bCryptPasswordEncoder.matches(password, user.getPassword())) {
                    System.out.println("Login successful for: " + loginIdentifier);
                    return ResponseEntity.ok("Login successful");
                } else {
                    System.out.println("Password does not match for: " + loginIdentifier);
                }
            } else {
                System.out.println("No user found with identifier: " + loginIdentifier);
                
                // Emergency fallback for test account
                if ((loginIdentifier.equals("test@example.com") || loginIdentifier.equals("test")) && 
                    password.equals("password123")) {
                    System.out.println("EMERGENCY: Creating test user on the fly for development purposes");
                    
                    User newUser = new User();
                    newUser.setEmail("test@example.com");
                    newUser.setUsername("test");
                    newUser.setPassword(bCryptPasswordEncoder.encode("password123"));
                    newUser.setHeight("180");
                    newUser.setHeightUnit("cm");
                    newUser.setWeight("80");
                    newUser.setWeightUnit("kg");
                    newUser.setDesiredWeight("75");
                    newUser.setSex("Male");
                    newUser.setDob("2000-01-01");
                    
                    userRepository.save(newUser);
                    System.out.println("Emergency test user created with ID: " + newUser.getId());
                    return ResponseEntity.ok("Login successful (emergency user created)");
                }
            }
            
            // For security reasons, don't be too specific about which part failed
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username/email or password");
        } catch (Exception e) {
            // Replace printStackTrace with proper logging
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
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
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
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

    @GetMapping("/count")
    public ResponseEntity<?> getUserCount() {
        try {
            long count = userRepository.count();
            System.out.println("Current user count in database: " + count);
            return ResponseEntity.ok("User count: " + count);
        } catch (Exception e) {
            System.err.println("Error counting users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error counting users: " + e.getMessage());
        }
    }

    @GetMapping("/debug/db-url")
    public ResponseEntity<String> getDatabaseUrl() {
        try {
            // Get working directory
            String userDir = System.getProperty("user.dir");
            
            // This section needs to be implemented correctly based on how you access JDBC template
            // The following code is just a placeholder and likely won't work directly
            Connection conn = null;
            String dbUrl = "Unknown";
            try {
                DataSource dataSource = ((JdbcTemplate) userRepository
                    .getClass()
                    .getMethod("getJdbcTemplate")
                    .invoke(userRepository))
                    .getDataSource();
                
                conn = dataSource.getConnection();
                dbUrl = conn.getMetaData().getURL();
            } catch (Exception ex) {
                dbUrl = "Error getting connection: " + ex.getMessage();
            } finally {
                if (conn != null) conn.close();
            }
            
            StringBuilder response = new StringBuilder();
            response.append("Working directory: ").append(userDir).append("\n");
            response.append("Database URL: ").append(dbUrl).append("\n");
            
            // Get database file info
            String dbFileName = dbUrl.contains("userdb") ? "userdb.mv.db" : "tehjdb.mv.db";
            File dbFile = new File(userDir + "/data/" + dbFileName);
            
            response.append("Database file: ").append(dbFile.getAbsolutePath()).append("\n");
            response.append("File exists: ").append(dbFile.exists()).append("\n");
            if (dbFile.exists()) {
                response.append("File size: ").append(dbFile.length()).append(" bytes\n");
            }
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error getting database URL: " + e.getMessage());
        }
    }
    
    @GetMapping("/debug/db-info")
    public ResponseEntity<?> getDatabaseInfo() {
        try {
            Map<String, Object> dbInfo = new HashMap<>();
                   
            // This section needs to be implemented correctly based on how you access JDBC template
            // The following code is just a placeholder and likely won't work directly
            Connection conn = null;
            try {
                DataSource dataSource = ((JdbcTemplate) userRepository
                    .getClass()
                    .getMethod("getJdbcTemplate")
                    .invoke(userRepository))
                    .getDataSource();
                
                conn = dataSource.getConnection();
                DatabaseMetaData metaData = conn.getMetaData();
                
                dbInfo.put("databaseProductName", metaData.getDatabaseProductName());
                dbInfo.put("databaseProductVersion", metaData.getDatabaseProductVersion());
                dbInfo.put("databaseUrl", metaData.getURL());
                dbInfo.put("driverName", metaData.getDriverName());
                dbInfo.put("username", metaData.getUserName());
            } catch (Exception ex) {
                dbInfo.put("error", "Error getting connection: " + ex.getMessage());
            } finally {
                if (conn != null) conn.close();
            }
            
            // User count
            long userCount = userRepository.count();
            dbInfo.put("userCount", userCount);
            
            // List of all users (limit sensitive info)
            List<Map<String, Object>> userSummaries = userRepository.findAll().stream()
                .map(user -> {
                    Map<String, Object> summary = new HashMap<>();
                    summary.put("id", user.getId());
                    summary.put("username", user.getUsername());
                    summary.put("email", user.getEmail());
                    return summary;
                })
                .collect(Collectors.toList());
            dbInfo.put("users", userSummaries);
            
            return ResponseEntity.ok(dbInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving database info: " + e.getMessage());
        }
    }
}