import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const BlogForm = ({ addBlog }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addBlog({ title, content, author, category });
        setTitle('');
        setContent('');
        setAuthor('');
        setCategory('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2980b9' }}>
                Create a New Blog Post
            </Typography>
            <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label="Content"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <TextField
                label="Author"
                variant="outlined"
                fullWidth
                margin="normal"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
            />
            <TextField
                label="Category"
                variant="outlined"
                fullWidth
                margin="normal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            />
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Add Blog
            </Button>
        </Box>
    );
};

export default BlogForm;