import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import NavBar from "../components/NavBar";


const HomePage = () => {
  // Quote state
  const [quote, setQuote] = useState("");
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // New video state
  const [currentVideo, setCurrentVideo] = useState("");
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const [showVideoFavorites, setShowVideoFavorites] = useState(false);
  
  // Array of motivational quotes - wrap in useMemo to prevent recreation on each render
  const quotes = useMemo(() => [
    "Take care of your body. It's the only place you have to live.",
    "The greatest wealth is health.",
    "Your health is an investment, not an expense.",
    "Healthy eating is a way of life, so it's important to establish routines that are simple, realistically, and ultimately livable.",
    "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.",
    "Let food be thy medicine and medicine be thy food.",
    "He who has health has hope, and he who has hope has everything.",
    "If you don't take care of your body, where are you going to live?",
    "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.",
    "The doctor of the future will no longer treat the human frame with drugs, but rather will cure and prevent disease with nutrition.",
    "To ensure good health: eat lightly, breathe deeply, live moderately, cultivate cheerfulness, and maintain an interest in life.",
    "The groundwork for all happiness is good health.",
    "A healthy outside starts from the inside.",
    "Good health is not something we can buy. However, it can be an extremely valuable savings account.",
    "Those who think they have no time for healthy eating will sooner or later have to find time for illness.",
  ], []);
  
  // Array of motivational videos - wrap in useMemo
  const videos = useMemo(() => [
    "_JRefJH6N00?si=grSwgYx8mzCz0jCa", // Initial videounbelievably easy
    "yTL_bNvXJ9s", // The Health Benefits Of Exercise
    "Ar7IP1eSsgI", // Healthy Diet Motivation
    "qODdeXqbBJU", // How Exercise Makes You Smarter
    "arj7oStGLkU", // Inside the mind of a master procrastinator
    "J9LHThOo-5c", // The Key to Happiness: Letting Go
    "9v99hclktVA", // The Science of Nutrition
    "ZyM3YdAJjXc", // The Power of Habit
    "fLJsdqxnZb0", // Recommended Exercises for Every Age
    "KJ9I1Taf1DQ", // Healthy Eating Habits
    "fqhYBTg73fw", // What I eat in a day - Healthy recipes
    "aFVmPkR_JVc", // Beginner's workout routine
  ], []);
  
  // Load favorites from localStorage on component mount
  useEffect(() => {
    // Quote favorites
    const savedQuotes = localStorage.getItem('favoriteQuotes');
    if (savedQuotes) {
      setFavoriteQuotes(JSON.parse(savedQuotes));
    }
    
    // Video favorites
    const savedVideos = localStorage.getItem('favoriteVideos');
    if (savedVideos) {
      setFavoriteVideos(JSON.parse(savedVideos));
    }
    
    // Select random quote and video
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    
    setQuote(quotes[randomQuoteIndex]);
    setCurrentVideo(videos[randomVideoIndex]);
  }, [quotes, videos]);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
  }, [favoriteQuotes]);
  
  useEffect(() => {
    localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));
  }, [favoriteVideos]);
  
  // Function to toggle a quote as favorite
  const toggleFavorite = (quoteText) => {
    if (favoriteQuotes.includes(quoteText)) {
      setFavoriteQuotes(favoriteQuotes.filter(q => q !== quoteText));
    } else {
      setFavoriteQuotes([...favoriteQuotes, quoteText]);
    }
  };
  
  // Function to toggle a video as favorite
  const toggleVideoFavorite = (videoId) => {
    if (favoriteVideos.includes(videoId)) {
      setFavoriteVideos(favoriteVideos.filter(v => v !== videoId));
    } else {
      setFavoriteVideos([...favoriteVideos, videoId]);
    }
  };
  
  // Functions to check if quote/video is a favorite
  const isFavorite = (quoteText) => favoriteQuotes.includes(quoteText);
  const isVideoFavorite = (videoId) => favoriteVideos.includes(videoId);
  
  // Functions to get new random quote/video
  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };
  
  const getNewVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(videos[randomIndex]);
  };

  return (
    <div className="home-container">
      <NavBar/>
      {/* Navigation Bar */}
      
      {/* Hero Section */}
      <section className="hero">
        <h2>Track Your Meals. Achieve Your Goals.</h2>
        <p>Join thousands of users making healthy choices every day.</p>
        <button className="cta-button">Get Started</button>
      </section>

      {/* Enhanced Video Section */}
      <section className="video-section">
        <div className="video-header">
          <h3>Motivational Video of the Day</h3>
          <div className="video-actions">
            <button 
              className="refresh-btn" 
              onClick={getNewVideo}
              title="Get a new video"
            >
              ↻
            </button>
            <button 
              className="favorite-btn"
              onClick={() => toggleVideoFavorite(currentVideo)}
              title={isVideoFavorite(currentVideo) ? "Remove from favorites" : "Add to favorites"}
            >
              {isVideoFavorite(currentVideo) ? "★" : "☆"}
            </button>
            <button 
              className="view-favorites-btn"
              onClick={() => setShowVideoFavorites(true)}
              title="View favorite videos"
            >
              View Favorites
            </button>
          </div>
        </div>
        <div className="video-container">
          <iframe
            width="560"
            height="500"
            src={`https://www.youtube.com/embed/${currentVideo}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="quick-stats">
        <h3>Your Daily Progress</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-number">1200</p>
            <p className="stat-label">Calories Consumed</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">3/5</p>
            <p className="stat-label">Workouts Completed</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">2L</p>
            <p className="stat-label">Water Intake</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Buttons */}
      <section className="actions">
        <h3>What Would You Like to Do?</h3>
        <button>Log a Meal</button>
        <Link to="/tracker">
        <button>Track a Workout</button>
        </Link>
        <button>View Progress</button>
      </section>

      {/* Quote Section */}
      <section className="motivation quote-section">
        <div className="quote-header">
          <h3>Quote of The Day</h3>
          <div className="quote-actions">
            <button 
              className="refresh-btn" 
              onClick={getNewQuote}
              title="Get a new quote"
            >
              ↻
            </button>
            <button 
              className="favorite-btn"
              onClick={() => toggleFavorite(quote)}
              title={isFavorite(quote) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(quote) ? "★" : "☆"}
            </button>
            <button 
              className="view-favorites-btn"
              onClick={() => setShowFavorites(true)}
              title="View favorite quotes"
            >
              View Favorites
            </button>
          </div>
        </div>
        <blockquote className="quote-text">
          "{quote}"
        </blockquote>
      </section>

      {/* Quote Favorites Modal */}
      {showFavorites && (
        <div className="favorites-modal">
          <div className="favorites-content">
            <div className="favorites-header">
              <h3>Your Favorite Quotes</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowFavorites(false)}
              >
                ×
              </button>
            </div>
            {favoriteQuotes.length === 0 ? (
              <p>You haven't saved any favorite quotes yet.</p>
            ) : (
              <ul className="favorites-list">
                {favoriteQuotes.map((favoriteQuote, index) => (
                  <li key={index} className="favorite-quote-item">
                    <p>"{favoriteQuote}"</p>
                    <button 
                      className="remove-favorite-btn"
                      onClick={() => toggleFavorite(favoriteQuote)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Video Favorites Modal */}
      {showVideoFavorites && (
        <div className="favorites-modal">
          <div className="favorites-content video-favorites-content">
            <div className="favorites-header">
              <h3>Your Favorite Videos</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowVideoFavorites(false)}
              >
                ×
              </button>
            </div>
            {favoriteVideos.length === 0 ? (
              <p>You haven't saved any favorite videos yet.</p>
            ) : (
              <ul className="video-favorites-list">
                {favoriteVideos.map((videoId, index) => (
                  <li key={index} className="favorite-video-item">
                    <div className="favorite-video-container">
                      <iframe
                        width="250"
                        height="150"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                      <button 
                        className="remove-favorite-btn"
                        onClick={() => toggleVideoFavorite(videoId)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Healthy Habits. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
