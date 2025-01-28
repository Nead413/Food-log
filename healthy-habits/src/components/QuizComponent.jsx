import React, { useState, useEffect } from "react";
import "./QuizComponent.css";
import BronzeMedal from "../assets/BronzeMedal.png";
import SilverMedal from "../assets/SilverMedal.png";
import GoldMedal from "../assets/GoldMedal.png";

// Sample user profile
const sampleUser = {
  name: "Alice",
  score: 50,
  badges: [GoldMedal], // The user starts with the Gold medal (can be updated)
};

const quizzes = [
  {
    title: "Nutrition Basics",
    medal: BronzeMedal,
    questions: [
      { question: "How many calories are in a gram of protein?", options: ["4", "9", "7", "3"], answer: "4" },
      { question: "What percentage of daily calories should come from carbohydrates?", options: ["45-65%", "20-35%", "10-25%", "70-85%"], answer: "45-65%" },
      { question: "What vitamin is commonly found in citrus fruits?", options: ["Vitamin C", "Vitamin D", "Vitamin A", "Vitamin K"], answer: "Vitamin C" },
      { question: "Which of the following is a macronutrient?", options: ["Water", "Protein", "Vitamins", "Minerals"], answer: "Protein" },
      { question: "Which type of fat is considered healthy?", options: ["Trans fat", "Saturated fat", "Unsaturated fat", "Hydrogenated fat"], answer: "Unsaturated fat" },
    ],
  },
  {
    title: "Exercise Knowledge",
    medal: SilverMedal,
    questions: [
      { question: "How much physical activity is recommended per week?", options: ["150 minutes", "100 minutes", "200 minutes", "250 minutes"], answer: "150 minutes" },
      { question: "Which of these exercises is best for building strength?", options: ["Running", "Swimming", "Weightlifting", "Cycling"], answer: "Weightlifting" },
      { question: "What type of exercise is yoga?", options: ["Cardio", "Strength", "Flexibility", "Endurance"], answer: "Flexibility" },
      { question: "Which of these is a sign of overtraining?", options: ["Increased energy", "Improved performance", "Fatigue", "Better sleep"], answer: "Fatigue" },
      { question: "What should you do after a workout?", options: ["Eat immediately", "Stretch and cool down", "Sleep", "Skip recovery"], answer: "Stretch and cool down" },
    ],
  },
  {
    title: "Healthy Habits",
    medal: GoldMedal,
    questions: [
      { question: "How much sleep is recommended for adults?", options: ["6-7 hours", "8-9 hours", "10-12 hours", "4-5 hours"], answer: "8-9 hours" },
      { question: "What is the recommended daily intake of fruits and vegetables?", options: ["1-2 servings", "3-5 servings", "6-7 servings", "10+ servings"], answer: "3-5 servings" },
      { question: "Which of these is a healthy habit?", options: ["Skipping breakfast", "Drinking water", "Smoking", "Staying up late"], answer: "Drinking water" },
      { question: "Which is a sign of a good mental health habit?", options: ["Ignoring stress", "Talking about feelings", "Avoiding exercise", "Sleep deprivation"], answer: "Talking about feelings" },
      { question: "Which of these is the healthiest snack option?", options: ["Chips", "Candy", "Fruit", "Cookies"], answer: "Fruit" },
    ],
  },
];

const QuizComponent = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  const progressPercentage = ((currentQuestion + 1) / currentQuiz?.questions.length) * 100;

  useEffect(() => {
    if (isQuizCompleted) {
      setShowBadgeAnimation(true);
      setTimeout(() => {
        setShowBadgeAnimation(false);
      }, 3000); // Hide the animation after 3 seconds
    }
  }, [isQuizCompleted]);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === currentQuiz.questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsQuizCompleted(true);
      sampleUser.badges.push(score >= 2 ? currentQuiz.medal : BronzeMedal); // Add badge after quiz completion
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const closeBadgeAnimation = () => {
    setShowBadgeAnimation(false);
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Healthy Habits Quiz</h1>
        <div className="profile">
          <img src={sampleUser.badges[sampleUser.badges.length - 1]} alt="User Badge" className="profile-badge" />
          <span>{sampleUser.name}</span>
          <span>{sampleUser.score} pts</span>
        </div>
      </header>

      <div className="quiz-content">
        <aside className="quiz-list">
          <h2>Available Quizzes</h2>
          <ul>
            {quizzes.map((quiz, index) => (
              <li key={index} className="quiz-item">
                <span>{quiz.title}</span>
                <button onClick={() => startQuiz(quiz)} className="start-quiz-button">Start</button>
              </li>
            ))}
          </ul>
        </aside>

        {currentQuiz && !isQuizCompleted && (
          <div className="quiz-widget">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="quiz-question-container">
              <h3>{currentQuiz.questions[currentQuestion].question}</h3>
              <div className="quiz-options">
                {currentQuiz.questions[currentQuestion].options.map((option, index) => (
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
          </div>
        )}

        {isQuizCompleted && (
          <div className="quiz-completed">
            <h3>Quiz Completed!</h3>
            <p>Your Score: {score}/{currentQuiz.questions.length}</p>
          </div>
        )}

        {/* Leaderboard Section */}
        <aside className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            <li>Alice - 50 pts</li>
            <li>Bob - 45 pts</li>
            <li>Charlie - 40 pts</li>
            <li>David - 35 pts</li>
          </ul>
        </aside>
      </div>

      {showBadgeAnimation && (
        <div className="badge-animation-container">
          <h3>Congratulations! You earned a new badge!</h3>
          <img src={currentQuiz.medal} alt="New Badge" className="badge-animation" />
          <button onClick={closeBadgeAnimation} className="close-badge-button">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
