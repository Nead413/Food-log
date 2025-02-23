import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link
import QuizComponent from './components/QuizComponent'; // Import QuizComponent
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <div>
              <h1>Welcome to the Healthy Habits Quiz App</h1>
              {/* Add a link or button to navigate to the quiz */}
              <Link to="/quiz">
                <button style={{ padding: "10px 20px", fontSize: "1rem", marginTop: "20px" }}>
                  Start Quiz
                </button>
              </Link>
            </div>
          } 
        />
        <Route path="/quiz" element={<QuizComponent />} /> {/* Set up the route to the quiz */}
      </Routes>
    </Router>
  );
}

export default App;
