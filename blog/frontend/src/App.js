import React from 'react';
import BlogList from './BlogList';
import { CssBaseline } from '@mui/material';

const App = () => {
    return (
        <>
            <CssBaseline />
            <div className="container">
                <BlogList />
            </div>
        </>
    );
};

export default App;