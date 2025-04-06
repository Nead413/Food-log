package com.example.demo.controller;

import com.example.demo.model.Blog;
import com.example.demo.repository.BlogRepository;
import com.example.demo.model.Comment;  // Import Comment model
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "http://localhost:3000")
public class BlogController {

    private final BlogRepository blogRepository;

    public BlogController(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    // Get all blogs
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Get a blog by ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new blog
    @PostMapping
    public ResponseEntity<Blog> createBlog(@Valid @RequestBody Blog blog) {
        Blog savedBlog = blogRepository.save(blog);
        return ResponseEntity.ok(savedBlog);
    }

    // Update an existing blog
    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @Valid @RequestBody Blog updatedBlog) {
        return blogRepository.findById(id)
                .map(blog -> {
                    blog.setTitle(updatedBlog.getTitle());
                    blog.setContent(updatedBlog.getContent());
                    blog.setAuthor(updatedBlog.getAuthor());
                    blog.setCategory(updatedBlog.getCategory());
                    return ResponseEntity.ok(blogRepository.save(blog));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a blog
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        if (blogRepository.existsById(id)) {
            blogRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Add a comment to a blog
    @PostMapping("/{id}/comments")
    public ResponseEntity<Blog> addComment(@PathVariable Long id, @RequestBody Comment comment) {  // Change to accept Comment object
        return blogRepository.findById(id).map(blog -> {
            blog.getComments().add(comment);  // Add the comment object
            return ResponseEntity.ok(blogRepository.save(blog));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Like a blog
    @PostMapping("/{id}/like")
    public ResponseEntity<Blog> likeBlog(@PathVariable Long id) {
        return blogRepository.findById(id).map(blog -> {
            blog.setLikes(blog.getLikes() + 1);
            return ResponseEntity.ok(blogRepository.save(blog));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
