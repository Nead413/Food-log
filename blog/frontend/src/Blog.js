import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Blog = ({ blog, fetchBlogs }) => {
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState({
    title: blog.title,
    content: blog.content,
    author: blog.author,
    category: blog.category
  });

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await axios.post(
        `http://localhost:8080/api/blogs/${blog.id}/comments`,
        { comment: comment.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );
      fetchBlogs();
      setComment('');
    }
  };

  const handleLike = async () => {
    await axios.post(`http://localhost:8080/api/blogs/${blog.id}/like`);
    fetchBlogs();
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:8080/api/blogs/${blog.id}`);
    fetchBlogs();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/api/blogs/${blog.id}`, editedBlog);
    setIsEditing(false);
    fetchBlogs();
  };

  return (
    <>
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
          <IconButton onClick={handleLike} color="primary"><ThumbUpIcon /></IconButton>
          <Typography variant="body2">{blog.likes}</Typography>
          <IconButton onClick={() => setIsEditing(true)} color="primary"><EditIcon /></IconButton>
          <IconButton onClick={handleDelete} color="error"><DeleteIcon /></IconButton>
        </CardActions>

        <CardContent>
          <Typography variant="h6">Comments</Typography>
          <ul>
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
              sx={{ mb: 1 }}
            />
            <Button variant="contained" color="primary" type="submit" startIcon={<CommentIcon />}>
              Comment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth>
        <DialogTitle>Edit Blog</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              fullWidth
              value={editedBlog.title}
              onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={editedBlog.content}
              onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Author"
              fullWidth
              value={editedBlog.author}
              onChange={(e) => setEditedBlog({ ...editedBlog, author: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Category"
              fullWidth
              value={editedBlog.category}
              onChange={(e) => setEditedBlog({ ...editedBlog, category: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Blog;

