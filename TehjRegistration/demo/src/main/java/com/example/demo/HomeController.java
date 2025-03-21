package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "home"; // Ensure this matches a view template
    }

    /*
    @GetMapping("/login")
    public String login() {
        return "login"; // Ensure this matches a view template
    }
    */

    @GetMapping("/register")
    public String register() {
        return "register"; // Ensure this matches a view template
    }
}
