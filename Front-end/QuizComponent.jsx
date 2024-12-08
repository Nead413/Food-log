import React, { useState, useEffect } from "react";
import "./QuizComponent.css";
import BronzeMedal from "../assets/Bronze Medal.png";
import SilverMedal from "../assets/Silver Medal.png";
import GoldMedal from "../assets/Gold Medal.png";

const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const questions = [
    { question: "How many calories are in a gram of protein?", options: ["4", "9", "7", "3"], answer: "4" },
    { question: "Which of the following is a macronutrient?", options: ["Vitamin C", "Protein", "Iron", "Calcium"], answer: "Protein" },
    { question: "What percentage of daily calories should come from carbohydrates?", options: ["45-65%", "20-35%", "10-25%", "70-85%"], answer: "45-65%" },
  ];

  const leaderboard = [
    { name: "Alice", score: 50, profile: "https://via.placeholder.com/50" },
    { name: "Bob", score: 45, profile: "https://via.placeholder.com/50" },
    { name: "Charlie", score: 40, profile: "https://via.placeholder.com/50" },
    { name: "David", score: 35, profile: "https://via.placeholder.com/50" },
  ];

  const quizList = [
    { title: "Nutrition Basics", lastMedal: BronzeMedal },
    { title: "Exercise Knowledge", lastMedal: SilverMedal },
    { title: "Healthy Habits", lastMedal: GoldMedal },
  ];

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Healthy Habits Quiz</h1>
        <p>{dateTime.toLocaleString()}</p>
      </header>
      <div className="quiz-content">
        <div className="quiz-widget">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          {isQuizCompleted ? (
            <div className="quiz-completed">
              <h3>Quiz Completed!</h3>
              <p>Your Score: {score}/{questions.length}</p>
              <img
                src={score >= 3 ? GoldMedal : score >= 2 ? SilverMedal : BronzeMedal}
                alt="Medal"
                className="badge-animation"
              />
            </div>
          ) : (
            <div className="quiz-question-container">
              <h3>{questions[currentQuestion].question}</h3>
              <div className="quiz-options">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="quiz-option-button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Section */}
        <aside className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((user, index) => (
              <li key={index} className="leaderboard-item">
                <img src={user.profile} alt={user.name} className="profile-pic" />
                <span className="user-name">{user.name}</span>
                <span className="user-score">{user.score} pts</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Quiz List Section */}
        <aside className="quiz-list">
          <h2>Available Quizzes</h2>
          <ul>
            {quizList.map((quiz, index) => (
              <li key={index} className="quiz-item">
                <span>{quiz.title}</span>
                <img
                  src={quiz.lastMedal}
                  alt={`${quiz.title} medal`}
                  className="medal-icon"
                />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default QuizComponent;
