package com.example.demo.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ExerciseLog;
import com.example.demo.model.User;
import com.example.demo.repository.ExerciseLogRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/exerciseLogs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Fixed CORS configuration
public class ExerciseLogController {
    
    @Autowired
    private ExerciseLogRepository exerciseLogRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all exercise logs
    @GetMapping
    public List<ExerciseLog> getAllExerciseLogs() {
        return exerciseLogRepository.findAll();
    }
    
    // Get exercise logs for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getExerciseLogsByUserId(@PathVariable Integer userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
            }
            
            List<ExerciseLog> logs = exerciseLogRepository.findByUser(userOptional.get());
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving exercise logs: " + e.getMessage());
        }
    }
    
    // Create a new exercise log
    @PostMapping
    public ResponseEntity<?> createExerciseLog(@RequestBody ExerciseLogRequest logRequest) {
        try {
            // Debug output
            System.out.println("Received exercise log request: " + logRequest);
            
            // Validate required fields
            if (logRequest.getExerciseName() == null || logRequest.getDate() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Exercise name and date are required");
            }
            
            // Get user
            Optional<User> userOptional = userRepository.findById(logRequest.getUserId());
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + logRequest.getUserId());
            }
            
            // Create and save exercise log
            ExerciseLog log = new ExerciseLog();
            log.setExerciseName(logRequest.getExerciseName());
            log.setDuration(logRequest.getDuration());
            log.setDate(logRequest.getDate());
            log.setUser(userOptional.get());
            
            ExerciseLog savedLog = exerciseLogRepository.save(log);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLog);
        } catch (Exception e) {
            System.err.println("Error creating exercise log: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating exercise log: " + e.getMessage());
        }
    }
    
    // Delete an exercise log
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExerciseLog(@PathVariable Integer id) {
        try {
            if (!exerciseLogRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Exercise log not found with ID: " + id);
            }
            
            exerciseLogRepository.deleteById(id);
            return ResponseEntity.ok("Exercise log deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting exercise log: " + e.getMessage());
        }
    }
    
    // Request class to handle incoming exercise log data
    public static class ExerciseLogRequest {
        private String exerciseName;
        private int duration;
        private String date;
        private Integer userId;
        
        public String getExerciseName() { return exerciseName; }
        public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
        
        public int getDuration() { return duration; }
        public void setDuration(int duration) { this.duration = duration; }
        
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        
        @Override
        public String toString() {
            return "ExerciseLogRequest{" +
                    "exerciseName='" + exerciseName + '\'' +
                    ", duration=" + duration +
                    ", date='" + date + '\'' +
                    ", userId=" + userId +
                    '}';
        }
    }
}
