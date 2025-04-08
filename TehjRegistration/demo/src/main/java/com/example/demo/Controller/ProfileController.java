package com.example.demo.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.UserProfile;
import com.example.demo.repository.UserProfileRepository;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    // Get profile by email
    @GetMapping("/{email:.+}")
    public ResponseEntity<?> getProfileByEmail(@PathVariable String email) {
        Optional<UserProfile> profile = Optional.ofNullable(userProfileRepository.findByEmail(email));
        return profile.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Save or update profile
    @PostMapping
    public ResponseEntity<?> saveOrUpdateProfile(@RequestBody UserProfile userProfile) {
        try {
            UserProfile savedProfile = userProfileRepository.save(userProfile);
            return ResponseEntity.ok(savedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving profile: " + e.getMessage());
        }
    }
}
