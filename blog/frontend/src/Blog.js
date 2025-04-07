import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardActions, Typography, Button, TextField, IconButton, Avatar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

const Blog = ({ blog, fetchBlogs }) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await axios.post(`http://localhost:8080/api/blogs/${blog.id}/comments`, { comment: comment.trim() }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchBlogs();
      setComment('');
    }
  };

  const handleLike = async () => {
    await axios.post(`http://localhost:8080/api/blogs/${blog.id}/like`);
    fetchBlogs();
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, transition: '0.3s', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2980b9' }}>{blog.title}</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>{blog.content}</Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 24, height: 24, marginRight: 1 }} /> {blog.author}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">Category: {blog.category}</Typography>
        <Typography variant="subtitle1" color="text.secondary">Likes: {blog.likes}</Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike} color="primary">
          <ThumbUpIcon />
        </IconButton>
        <Typography variant="body2">{blog.likes}</Typography>
      </CardActions>
      <CardContent>
        <Typography variant="h6">Comments</Typography>
        <ul>
          {/* Ensure each comment is displayed properly */}
          {blog.comments.map((c, index) => (
            <li key={index}>{c.comment}</li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <TextField
            label="Add a comment"
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit" startIcon={<CommentIcon />}>
            Comment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Blog;
