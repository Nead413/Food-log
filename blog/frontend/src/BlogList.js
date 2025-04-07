import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Blog from './Blog';
import BlogForm from './BlogForm';
import { Container, Typography, Grid, Paper, TextField } from '@mui/material';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await axios.get('http://localhost:8080/api/blogs');
    setBlogs(response.data);
  };

  const addBlog = async (blog) => {
    await axios.post('http://localhost:8080/api/blogs', blog);
    fetchBlogs();
  };

  // Filter blogs based on title/content matching search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#2c3e50' }}
      >
        Healthy Habits
      </Typography>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ color: '#34495e' }}
      >
        This web application tracks your health
      </Typography>

      {/* ✅ Blog form for creating new blogs */}
      <BlogForm addBlog={addBlog} />

      {/* ✅ Search Bar */}
      <TextField
        label="Search Blogs"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mt: 4, mb: 2 }}
      />

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  padding: 2,
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 20 },
                }}
              >
                <Blog blog={blog} fetchBlogs={fetchBlogs} />
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography
            variant="h6"
            align="center"
            sx={{ width: '100%', mt: 4, color: 'gray' }}
          >
            No blogs found for "{searchQuery}"
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default BlogList;
