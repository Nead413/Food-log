import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart,
  Area, ScatterChart, Scatter, ZAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Activity, Calendar, User, Lock, TrendingUp, Target, Award,
  Camera, Share2, Download, Check, Trophy, Moon, Sun, Coffee, Droplets
} from 'lucide-react';

const ProfileSection = () => {
  // ----- Initial Data & Options -----
  const initialUserData = {
    name: '',
    email: 'user@gmail.com', // read-only, typically from auth
    heightInches: 68,
    weightLbs: 160,
    targetWeightLbs: 150,
    dateOfBirth: '1990-01-01',
    activityLevel: 'moderate',
    dietaryPreferences: 'balanced',
    profilePicture: null,
    createdAt: new Date().toISOString(),
    milestones: [],
    moodTracking: [],
    sleepHours: 7,
    waterIntake: 8,
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      progressAlerts: true
    },
    healthGoals: ['Lose weight', 'Improve strength'],
    primaryGoal: 'weight',
    measurementSystem: 'imperial',
    dashboardLayout: ['healthScore', 'weightProgress', 'achievements', 'predictions'],
    highContrastMode: false,
    language: 'english'
  };

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 times/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 times/week)' },
    { value: 'active', label: 'Active (exercise 6-7 times/week)' },
    { value: 'veryActive', label: 'Very Active (intense exercise daily)' },
  ];

  const dietaryOptions = [
    { value: 'balanced', label: 'Balanced Diet' },
    { value: 'lowCarb', label: 'Low Carbohydrate' },
    { value: 'highProtein', label: 'High Protein' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Ketogenic' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'dash', label: 'DASH Diet' },
    { value: 'glutenFree', label: 'Gluten-Free' },
    { value: 'intermittentFasting', label: 'Intermittent Fasting' },
  ];

  const healthGoalOptions = [
    { value: 'loseWeight', label: 'Lose Weight' },
    { value: 'gainMuscle', label: 'Gain Muscle' },
    { value: 'improveEndurance', label: 'Improve Endurance' },
    { value: 'increaseFlexibility', label: 'Increase Flexibility' },
    { value: 'improveStrength', label: 'Improve Strength' },
    { value: 'reduceCholesterol', label: 'Reduce Cholesterol' },
    { value: 'lowerBloodPressure', label: 'Lower Blood Pressure' },
    { value: 'improveEnergy', label: 'Improve Energy Levels' },
    { value: 'betterSleep', label: 'Better Sleep Quality' },
    { value: 'stressReduction', label: 'Stress Reduction' },
  ];

  const moodOptions = [
    { value: 'energetic', label: 'Energetic', icon: '😃' },
    { value: 'motivated', label: 'Motivated', icon: '💪' },
    { value: 'content', label: 'Content', icon: '😊' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'tired', label: 'Tired', icon: '😴' },
    { value: 'stressed', label: 'Stressed', icon: '😰' },
    { value: 'unmotivated', label: 'Unmotivated', icon: '😕' },
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'arabic', label: 'Arabic' },
  ];

  // ----- Mock Data Generators -----
  const generateMockWeightHistory = (currentWeight, targetWeight, months = 6) => {
    const history = [];
    const today = new Date();
    const weightDifference = currentWeight - targetWeight;
    const totalDays = months * 30;
    const isWeightLoss = currentWeight > targetWeight;
    const plateauStartDay = Math.floor(totalDays * 0.4);
    const plateauEndDay = Math.floor(totalDays * 0.6);
    for (let i = totalDays; i >= 0; i -= 3) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      let progressRatio = (totalDays - i) / totalDays;
      if (i <= plateauStartDay && i >= plateauEndDay) {
        progressRatio = (totalDays - plateauStartDay) / totalDays;
      }
      const dayOfWeek = date.getDay();
      const weekendEffect = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.5 : 0;
      const randomFactor = (Math.random() * 2 - 1) + weekendEffect;
      const progressAmount = weightDifference * progressRatio * 0.85;
      const weight = isWeightLoss
        ? Math.round((currentWeight - progressAmount + randomFactor) * 10) / 10
        : Math.round((currentWeight + progressAmount + randomFactor) * 10) / 10;
      history.push({ date: date.toISOString().split('T')[0], weight });
    }
    return history;
  };

  const generateMockMoodData = (days = 30) => {
    const data = [];
    const today = new Date();
    const moodValues = ['energetic', 'motivated', 'content', 'neutral', 'tired', 'stressed', 'unmotivated'];
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayOfWeek = date.getDay();
      let moodProbabilities;
      if (dayOfWeek === 1) {
        moodProbabilities = [0.1, 0.1, 0.15, 0.15, 0.3, 0.1, 0.1];
      } else if (dayOfWeek === 3) {
        moodProbabilities = [0.2, 0.3, 0.2, 0.1, 0.1, 0.05, 0.05];
      } else if (dayOfWeek === 5 || dayOfWeek === 6) {
        moodProbabilities = [0.2, 0.1, 0.3, 0.1, 0.1, 0.1, 0.1];
      } else {
        moodProbabilities = [0.15, 0.15, 0.15, 0.2, 0.15, 0.1, 0.1];
      }
      const random = Math.random();
      let cumulative = 0;
      let selected;
      for (let j = 0; j < moodProbabilities.length; j++) {
        cumulative += moodProbabilities[j];
        if (random <= cumulative) {
          selected = moodValues[j];
          break;
        }
      }
      data.push({ date: date.toISOString().split('T')[0], mood: selected });
    }
    return data;
  };

  const generateMockHealthScoreData = (days = 60) => {
    const data = [];
    const today = new Date();
    let baseScore = 65;
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      if (i < days) baseScore += 0.05;
      const fluctuation = Math.random() * 6 - 3;
      const score = Math.round(Math.min(100, Math.max(0, baseScore + fluctuation)));
      data.push({ date: date.toISOString().split('T')[0], score });
    }
    return data;
  };

  const generateMockChallenges = () => {
    return [
      {
        id: 1,
        title: "7-Day Water Challenge",
        description: "Drink at least 8 glasses of water every day for a week",
        daysTotal: 7,
        daysCompleted: 3,
        reward: "Water Warrior Badge"
      },
      {
        id: 2,
        title: "10,000 Steps Daily",
        description: "Walk 10,000 steps every day for 5 days",
        daysTotal: 5,
        daysCompleted: 1,
        reward: "Step Master Badge"
      },
      {
        id: 3,
        title: "Healthy Sleep Week",
        description: "Sleep 7-9 hours each night for a full week",
        daysTotal: 7,
        daysCompleted: 0,
        reward: "Sleep Champion Badge"
      }
    ];
  };

  // ----- State Hooks -----
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('healthyHabitsUserProfile');
    return saved ? JSON.parse(saved) : initialUserData;
  });
  const [weightHistory, setWeightHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [moodData, setMoodData] = useState(() => {
    const saved = localStorage.getItem('healthyHabitsMoodData');
    return saved ? JSON.parse(saved) : generateMockMoodData(30);
  });
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('healthyHabitsAchievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [healthScoreHistory, setHealthScoreHistory] = useState(() => {
    const saved = localStorage.getItem('healthyHabitsHealthScoreHistory');
    return saved ? JSON.parse(saved) : generateMockHealthScoreData(60);
  });
  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('healthyHabitsChallenges');
    return saved ? JSON.parse(saved) : generateMockChallenges();
  });

  // ----- Utility Functions -----
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 0;
    const heightMeters = height * 0.0254;
    const weightKg = weight * 0.453592;
    return (weightKg / (heightMeters * heightMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmi < 25) return { category: 'Healthy Weight', color: '#2ecc71' };
    if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obesity', color: '#e74c3c' };
  };

  const calculateWeeksToGoal = (history, targetWeight) => {
    if (history.length < 2) return null;
    const recent = history.slice(-Math.min(12, history.length));
    if (recent.length < 2) return null;
    const changes = [];
    for (let i = 1; i < recent.length; i++) {
      changes.push(recent[i].weight - recent[i - 1].weight);
    }
    const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length;
    const variance = changes.reduce((sum, val) => sum + Math.pow(val - avgChange, 2), 0) / changes.length;
    const stdDev = Math.sqrt(variance);
    if (avgChange === 0 ||
      (avgChange > 0 && userData.weightLbs > userData.targetWeightLbs) ||
      (avgChange < 0 && userData.weightLbs < userData.targetWeightLbs)) {
      return null;
    }
    const diff = Math.abs(userData.weightLbs - userData.targetWeightLbs);
    const weeks = Math.ceil(diff / Math.abs(avgChange));
    const consistency = Math.max(0, Math.min(100, 100 - (stdDev / Math.abs(avgChange) * 50)));
    const pattern = detectWeightPattern(changes);
    const bestCase = Math.ceil(diff / (Math.abs(avgChange) + stdDev / 2));
    const worstCase = Math.ceil(diff / Math.max(0.1, Math.abs(avgChange) - stdDev / 2));
    return {
      weeksToGoal: weeks,
      weeklyChange: Math.abs(avgChange).toFixed(1),
      confidence: Math.round(consistency),
      pattern,
      bestCaseWeeks: bestCase,
      worstCaseWeeks: worstCase,
      stdDev: stdDev.toFixed(2)
    };
  };

  const detectWeightPattern = (changes) => {
    if (changes.length < 4) return 'insufficient-data';
    const plateau = changes.slice(-3).every(c => Math.abs(c) < 0.5);
    if (plateau) return 'plateau';
    let accelerating = true;
    for (let i = changes.length - 3; i < changes.length - 1; i++) {
      if (Math.abs(changes[i]) <= Math.abs(changes[i - 1])) {
        accelerating = false;
        break;
      }
    }
    if (accelerating) return 'accelerating';
    let decelerating = true;
    for (let i = changes.length - 3; i < changes.length - 1; i++) {
      if (Math.abs(changes[i]) >= Math.abs(changes[i - 1])) {
        decelerating = false;
        break;
      }
    }
    if (decelerating) return 'decelerating';
    const lastFour = changes.slice(-4);
    const signChanges = lastFour.map((c, i) => (i === 0 ? 0 : (Math.sign(c) !== Math.sign(lastFour[i - 1]) ? 1 : 0)))
      .reduce((a, b) => a + b, 0);
    if (signChanges >= 2) return 'fluctuating';
    return 'steady';
  };

  const getMotivationalMessage = (data) => {
    if (!data) return "Start tracking your progress to see AI-powered predictive insights!";
    const { weeksToGoal, weeklyChange, confidence, pattern, bestCaseWeeks, worstCaseWeeks } = data;
    if (weeksToGoal <= 0) return "Congratulations! You've reached your target weight! Consider setting a maintenance goal.";
    let patternInsight = "";
    switch (pattern) {
      case 'plateau':
        patternInsight = "You've hit a plateau recently. Consider changing your routine to break through.";
        break;
      case 'accelerating':
        patternInsight = "Your progress is accelerating! Whatever you're doing is working great.";
        break;
      case 'decelerating':
        patternInsight = "Your progress is slowing down. This is normal as you get closer to your goal.";
        break;
      case 'fluctuating':
        patternInsight = "Your weight is fluctuating. Focus on consistency in diet and exercise.";
        break;
      case 'steady':
        patternInsight = "You're making steady, consistent progress. Great work maintaining your routine!";
        break;
      default:
        patternInsight = "";
    }
    let timelineMessage = "";
    if (weeksToGoal === 1) {
      timelineMessage = `You're just one week away from your goal! Keep up your current pace of ${weeklyChange} lbs/week.`;
    } else if (weeksToGoal <= 4) {
      timelineMessage = `At your current pace of ${weeklyChange} lbs/week, you'll reach your goal in just ${weeksToGoal} weeks!`;
    } else if (weeksToGoal <= 12) {
      timelineMessage = `Maintain your current pace of ${weeklyChange} lbs/week to reach your goal in ${weeksToGoal} weeks.`;
    } else {
      timelineMessage = `At your current pace of ${weeklyChange} lbs/week, you'll reach your goal in ${weeksToGoal} weeks.`;
    }
    let rangeInfo = "";
    if (confidence < 70 && bestCaseWeeks && worstCaseWeeks) {
      rangeInfo = ` Based on your consistency, this could be as soon as ${bestCaseWeeks} weeks or up to ${worstCaseWeeks} weeks.`;
    }
    return `${timelineMessage}${rangeInfo} ${patternInsight}`;
  };

  const calculateHealthScore = () => {
    if (!userData) return 0;
    let score = 50;
    const bmi = calculateBMI(userData.heightInches, userData.weightLbs);
    if (bmi >= 18.5 && bmi < 25) score += 15;
    else if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi < 30)) score += 7;
    else if ((bmi >= 16 && bmi < 17) || (bmi >= 30 && bmi < 35)) score += 0;
    else score -= 5;
    switch (userData.activityLevel) {
      case 'veryActive': score += 15; break;
      case 'active': score += 12; break;
      case 'moderate': score += 8; break;
      case 'light': score += 5; break;
      case 'sedentary': score += 0; break;
      default: score += 5;
    }
    if (userData.sleepHours >= 7 && userData.sleepHours <= 9) score += 10;
    else if (userData.sleepHours >= 6 && userData.sleepHours < 7) score += 5;
    else if (userData.sleepHours > 9 && userData.sleepHours <= 10) score += 5;
    else score += 0;
    if (userData.waterIntake >= 8) score += 10;
    else if (userData.waterIntake >= 6) score += 5;
    else if (userData.waterIntake >= 4) score += 2;
    if (weeksToGoalData && weeksToGoalData.confidence > 70) score += 10;
    else if (weeksToGoalData && weeksToGoalData.confidence > 50) score += 5;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const diff = today.getMonth() - birthDate.getMonth();
    if (diff < 0 || (diff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // ----- Handlers -----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const val = ['heightInches', 'weightLbs', 'targetWeightLbs'].includes(name) ? (value === '' ? '' : Number(value)) : value;
    setUserData(prev => ({ ...prev, [name]: val }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setSaveStatus({ type: 'error', message: 'Please select a valid image file (JPEG, PNG, or GIF)' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus({ type: 'error', message: 'Image file is too large. Maximum size is 5MB.' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserData(prev => ({ ...prev, profilePicture: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    setUserData(prev => ({ ...prev, profilePicture: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus({ type: 'info', message: 'Saving your profile...' });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('healthyHabitsUserProfile', JSON.stringify(userData));
      const today = new Date().toISOString().split('T')[0];
      setWeightHistory(prev => {
        const idx = prev.findIndex(entry => entry.date === today);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { date: today, weight: userData.weightLbs };
          return updated;
        }
        return [...prev, { date: today, weight: userData.weightLbs }];
      });
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save profile. Please try again.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleReset = () => {
    setUserData(initialUserData);
    setSaveStatus({ type: 'info', message: 'Form reset to default values.' });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
  };

  const handleMoodSelection = (mood) => {
    const today = new Date().toISOString().split('T')[0];
    const idx = moodData.findIndex(entry => entry.date === today);
    if (idx >= 0) {
      const updated = [...moodData];
      updated[idx] = { date: today, mood };
      setMoodData(updated);
    } else {
      setMoodData([...moodData, { date: today, mood }]);
    }
    localStorage.setItem('healthyHabitsMoodData', JSON.stringify(moodData));
    setSaveStatus({ type: 'success', message: 'Mood tracked successfully!' });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
  };

  const exportUserData = () => {
    const data = {
      profile: userData,
      weightHistory,
      moodData,
      healthScoreHistory,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthy-habits-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSaveStatus({ type: 'success', message: 'Data exported successfully!' });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
  };

  const addNewChallenge = (challenge) => {
    const newCh = { id: challenges.length + 1, ...challenge, daysCompleted: 0 };
    const updated = [...challenges, newCh];
    setChallenges(updated);
    localStorage.setItem('healthyHabitsChallenges', JSON.stringify(updated));
  };

  const updateChallengeProgress = (challengeId) => {
    const updated = challenges.map(ch => {
      if (ch.id === challengeId) {
        const newDays = Math.min(ch.daysTotal, ch.daysCompleted + 1);
        if (newDays === ch.daysTotal && ch.daysCompleted < ch.daysTotal) {
          const newAch = {
            id: achievements.length + 1,
            title: ch.reward || `Completed: ${ch.title}`,
            date: new Date().toISOString(),
            type: 'challenge'
          };
          setAchievements([...achievements, newAch]);
        }
        return { ...ch, daysCompleted: newDays };
      }
      return ch;
    });
    setChallenges(updated);
    localStorage.setItem('healthyHabitsChallenges', JSON.stringify(updated));
  };

  const checkAndAddAchievements = () => {
    const newAch = [];
    const today = new Date().toISOString().split('T')[0];
    if (userData.name && userData.heightInches && userData.weightLbs && userData.dateOfBirth && userData.profilePicture && !achievements.some(a => a.type === 'profile_complete')) {
      newAch.push({
        id: achievements.length + newAch.length + 1,
        title: "Profile Champion",
        description: "Completed your health profile with all details",
        date: today,
        type: 'profile_complete',
        icon: '🏆'
      });
    }
    if (weightHistory.length >= 10 && !achievements.some(a => a.type === 'consistent_tracker')) {
      newAch.push({
        id: achievements.length + newAch.length + 1,
        title: "Consistent Tracker",
        description: "Tracked your weight for 10 or more days",
        date: today,
        type: 'consistent_tracker',
        icon: '📊'
      });
    }
    if (userData.targetWeightLbs < userData.weightLbs) {
      const totalToLose = initialUserData.weightLbs - userData.targetWeightLbs;
      const currentLoss = initialUserData.weightLbs - userData.weightLbs;
      const percentComplete = (currentLoss / totalToLose) * 100;
      if (percentComplete >= 25 && !achievements.some(a => a.type === 'weight_25_percent')) {
        newAch.push({
          id: achievements.length + newAch.length + 1,
          title: "25% Milestone",
          description: "Achieved 25% of your weight loss goal",
          date: today,
          type: 'weight_25_percent',
          icon: '⭐'
        });
      }
      if (percentComplete >= 50 && !achievements.some(a => a.type === 'weight_50_percent')) {
        newAch.push({
          id: achievements.length + newAch.length + 1,
          title: "Halfway Champion",
          description: "Achieved 50% of your weight loss goal",
          date: today,
          type: 'weight_50_percent',
          icon: '🌟'
        });
      }
    }
    if (newAch.length > 0) {
      const updatedAch = [...achievements, ...newAch];
      setAchievements(updatedAch);
      localStorage.setItem('healthyHabitsAchievements', JSON.stringify(updatedAch));
      setSaveStatus({ type: 'success', message: `Congratulations! You earned the "${newAch[0].title}" achievement!` });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
    }
  };

  // ----- Load Data on Mount -----
  useEffect(() => {
    const savedHistory = localStorage.getItem('healthyHabitsWeightHistory');
    if (savedHistory) {
      setWeightHistory(JSON.parse(savedHistory));
    } else {
      const mockHistory = generateMockWeightHistory(userData.weightLbs, userData.targetWeightLbs);
      setWeightHistory(mockHistory);
      localStorage.setItem('healthyHabitsWeightHistory', JSON.stringify(mockHistory));
    }
    checkAndAddAchievements();
    setTimeout(() => {
      setSaveStatus({ type: 'info', message: 'Enhance your account security by setting up two-factor authentication in Settings.' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
    }, 10000);
  }, []);

  useEffect(() => {
    if (weightHistory.length > 0) {
      localStorage.setItem('healthyHabitsWeightHistory', JSON.stringify(weightHistory));
    }
  }, [weightHistory]);

  // ----- Calculated Values -----
  const bmiValue = calculateBMI(userData.heightInches, userData.weightLbs);
  const bmiInfo = getBMICategory(bmiValue);
  const userAge = calculateAge(userData.dateOfBirth);
  const weeksToGoalData = calculateWeeksToGoal(weightHistory, userData.targetWeightLbs);
  const motivationalMessage = getMotivationalMessage(weeksToGoalData);
  const healthScore = calculateHealthScore();

  // ----- Render Component -----
  return (
    <div className="profile-section" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      color: userData.highContrastMode ? '#fff' : '#333',
      backgroundColor: userData.highContrastMode ? '#1a1a1a' : '#fff'
    }}>
      <h1 style={{
        marginBottom: '20px',
        color: userData.highContrastMode ? '#fff' : '#2c3e50',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <User style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Personal Health Profile
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={exportUserData}
            style={{
              backgroundColor: userData.highContrastMode ? '#444' : '#f8f9fa',
              color: userData.highContrastMode ? '#fff' : '#333',
              border: userData.highContrastMode ? '1px solid #666' : '1px solid #ddd',
              padding: '8px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            Export Data
          </button>
          <button
            onClick={() => setUserData({ ...userData, highContrastMode: !userData.highContrastMode })}
            style={{
              backgroundColor: userData.highContrastMode ? '#444' : '#f8f9fa',
              color: userData.highContrastMode ? '#fff' : '#333',
              border: userData.highContrastMode ? '1px solid #666' : '1px solid #ddd',
              padding: '8px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            {userData.highContrastMode ? <Sun size={16} /> : <Moon size={16} />}
            {userData.highContrastMode ? 'Standard Mode' : 'High Contrast'}
          </button>
        </div>
      </h1>

      {/* Navigation Tabs (Settings removed) */}
      <div style={{
        display: 'flex',
        borderBottom: userData.highContrastMode ? '1px solid #444' : '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        {['profile', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 15px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? (userData.highContrastMode ? '2px solid #fff' : '2px solid #4285f4') : 'none',
              color: activeTab === tab ? (userData.highContrastMode ? '#fff' : '#4285f4') : (userData.highContrastMode ? '#aaa' : '#6c757d'),
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {saveStatus.message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: userData.highContrastMode
            ? (saveStatus.type === 'success' ? '#0d4b26' : saveStatus.type === 'error' ? '#5e1c1c' : '#0d3b4b')
            : (saveStatus.type === 'success' ? '#d4edda' : saveStatus.type === 'error' ? '#f8d7da' : '#d1ecf1'),
          color: userData.highContrastMode ? '#fff' : (saveStatus.type === 'success' ? '#155724' : saveStatus.type === 'error' ? '#721c24' : '#0c5460')
        }}>
          {saveStatus.message}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Profile Form Section */}
          <div style={{ flex: '0 0 350px' }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {/* Profile Picture */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '60px',
                  backgroundColor: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid #dee2e6'
                }}>
                  {userData.profilePicture ? (
                    <img src={userData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={64} color="#adb5bd" />
                  )}
                  <label htmlFor="profile-picture-upload" style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '4px 0',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    <Camera size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Change
                  </label>
                  <input id="profile-picture-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePictureChange} />
                </div>
                {userData.profilePicture && (
                  <button type="button" onClick={handleRemoveProfilePicture} style={{
                    marginTop: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    Remove photo
                  </button>
                )}
              </div>
              <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <User style={{ marginRight: '10px' }} /> Profile Information
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                  <input type="text" name="name" value={userData.name} onChange={handleInputChange} style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} placeholder="Enter your full name" required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Lock size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Email (read-only)
                  </label>
                  <input type="email" name="email" value={userData.email} disabled style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f1f1f1'
                  }} />
                  <small style={{ color: '#6c757d' }}>Email cannot be changed here for security reasons</small>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Date of Birth
                  </label>
                  <input type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleInputChange} style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Height (inches)</label>
                  <input type="number" name="heightInches" value={userData.heightInches} onChange={handleInputChange} min="36" max="96" style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Weight (lbs)</label>
                  <input type="number" name="weightLbs" value={userData.weightLbs} onChange={handleInputChange} min="50" max="500" style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Target size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Target Weight (lbs)
                  </label>
                  <input type="number" name="targetWeightLbs" value={userData.targetWeightLbs} onChange={handleInputChange} min="50" max="500" style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Activity size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Activity Level
                  </label>
                  <select name="activityLevel" value={userData.activityLevel} onChange={handleInputChange} style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required>
                    {activityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Dietary Preferences</label>
                  <select name="dietaryPreferences" value={userData.dietaryPreferences} onChange={handleInputChange} style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required>
                    {dietaryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" disabled={isLoading} style={{
                    flex: '1',
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}>
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button type="button" onClick={handleReset} style={{
                    flex: '1',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    color: '#212529',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Health Metrics & Insights Section */}
          <div style={{ flex: '1 1 auto' }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '15px' }}>Health Metrics</h2>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: '1', minWidth: '120px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Age</div>
                  <div style={{ fontSize: '24px' }}>{userAge}</div>
                </div>
                <div style={{ flex: '1', minWidth: '120px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>BMI</div>
                  <div style={{ fontSize: '24px' }}>{bmiValue}</div>
                  <div style={{ color: bmiInfo.color, fontWeight: 'bold' }}>{bmiInfo.category}</div>
                </div>
                <div style={{ flex: '1', minWidth: '120px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Target</div>
                  <div style={{ fontSize: '24px' }}>{userData.targetWeightLbs} lbs</div>
                  <div style={{ color: '#6c757d' }}>
                    {userData.weightLbs > userData.targetWeightLbs
                      ? `${(userData.weightLbs - userData.targetWeightLbs).toFixed(1)} lbs to lose`
                      : userData.weightLbs < userData.targetWeightLbs
                        ? `${(userData.targetWeightLbs - userData.weightLbs).toFixed(1)} lbs to gain`
                        : 'At target weight!'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                <TrendingUp style={{ marginRight: '10px' }} /> Weight Progress
              </h2>
              <div style={{ height: '300px', marginBottom: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip formatter={(value) => [`${value} lbs`, 'Weight']} labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} name="Weight (lbs)" />
                    <Line type="monotone" dataKey={() => userData.targetWeightLbs} stroke="#82ca9d" strokeDasharray="5 5" name="Target Weight" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderLeft: '4px solid #8884d8',
                flex: '1'
              }}>
                <h2 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <Award style={{ marginRight: '10px' }} /> Goal Prediction
                </h2>
                <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{motivationalMessage}</p>
                {weeksToGoalData && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: 'rgba(136, 132, 216, 0.1)',
                    borderRadius: '4px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Current Weekly Change: {weeksToGoalData.weeklyChange} lbs</div>
                    <div style={{ fontWeight: 'bold' }}>Estimated Time to Goal: {weeksToGoalData.weeksToGoal} weeks</div>
                  </div>
                )}
                <div style={{
                  marginTop: '15px',
                  fontSize: '14px',
                  color: '#6c757d',
                  fontStyle: 'italic'
                }}>
                  Note: Predictions are based on your recent progress and may vary.
                </div>
              </div>
              <div style={{
                padding: '15px',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '20px',
                flex: '1'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  <Lock size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Data Security
                </div>
                <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
                  Your health data is encrypted at rest and during transmission. Only you can access your complete health profile.
                </p>
              </div>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Health Score Trend</h3>
              <div style={{ height: '300px', marginBottom: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={healthScoreHistory.slice(-30)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }} />
                    <YAxis domain={[0, 100]} label={{ value: 'Health Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                    <Tooltip formatter={(value) => [`${value}`, 'Health Score']} labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Legend />
                    <Area type="monotone" dataKey="score" fill="#8884d8" stroke="#8884d8" name="Health Score" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Patterns & Insights</h3>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Weight-Mood Correlation</h4>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="category" dataKey="mood" name="Mood" />
                      <YAxis dataKey="weightDiff" name="Weight Change" unit="lbs" />
                      <ZAxis dataKey="count" range={[50, 500]} name="Frequency" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                        if (name === 'Weight Change') return `${value} lbs`;
                        return value;
                      }} />
                      <Legend />
                      <Scatter name="Mood-Weight Correlation" data={[
                        { mood: 'energetic', weightDiff: -0.5, count: 15 },
                        { mood: 'motivated', weightDiff: -0.7, count: 18 },
                        { mood: 'content', weightDiff: -0.3, count: 22 },
                        { mood: 'neutral', weightDiff: -0.1, count: 12 },
                        { mood: 'tired', weightDiff: 0.2, count: 10 },
                        { mood: 'stressed', weightDiff: 0.4, count: 8 },
                        { mood: 'unmotivated', weightDiff: 0.3, count: 5 },
                      ]} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ fontSize: '14px', color: userData.highContrastMode ? '#ccc' : '#6c757d', marginTop: '10px' }}>
                  Insight: You tend to lose more weight on days when you feel energetic and motivated.
                </div>
              </div>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Personal Health Factors</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={[
                    { factor: 'Diet', value: userData.dietaryPreferences === 'balanced' ? 90 : userData.dietaryPreferences === 'highProtein' ? 85 : 75 },
                    { factor: 'Exercise', value: userData.activityLevel === 'veryActive' ? 90 : userData.activityLevel === 'active' ? 80 : userData.activityLevel === 'moderate' ? 60 : userData.activityLevel === 'light' ? 40 : 20 },
                    { factor: 'Sleep', value: userData.sleepHours >= 7 && userData.sleepHours <= 9 ? 90 : userData.sleepHours >= 6 ? 70 : 50 },
                    { factor: 'Hydration', value: userData.waterIntake >= 8 ? 90 : userData.waterIntake >= 6 ? 70 : userData.waterIntake >= 4 ? 50 : 30 },
                    { factor: 'Consistency', value: weightHistory.length > 20 ? 90 : weightHistory.length > 10 ? 70 : 40 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Your Health Factors" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '15px', backgroundColor: userData.highContrastMode ? '#3a3a3a' : 'rgba(136, 132, 216, 0.1)', padding: '15px', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '10px' }}>Recommendations</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {userData.activityLevel === 'sedentary' && (
                    <li style={{ marginBottom: '5px' }}>Consider increasing your activity level to improve your health score.</li>
                  )}
                  {userData.waterIntake < 8 && (
                    <li style={{ marginBottom: '5px' }}>Increasing your water intake to 8 glasses could boost your hydration score.</li>
                  )}
                  {userData.sleepHours < 7 && (
                    <li style={{ marginBottom: '5px' }}>Try to get at least 7 hours of sleep for optimal health benefits.</li>
                  )}
                  {!userData.dietaryPreferences.includes('balanced') && (
                    <li style={{ marginBottom: '5px' }}>Consider a more balanced diet for overall health improvement.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Advanced Health Analytics</h2>
          {/* Health Score Card */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Your Health Score</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '60px', 
                background: `conic-gradient(
                  ${calculateHealthScore() >= 80 ? '#4CAF50' : 
                    calculateHealthScore() >= 60 ? '#8bc34a' :
                    calculateHealthScore() >= 40 ? '#FFC107' :
                    '#F44336'} ${calculateHealthScore() * 3.6}deg, 
                  ${userData.highContrastMode ? '#444' : '#e0e0e0'} 0deg
                )`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50px',
                  backgroundColor: userData.highContrastMode ? '#2a2a2a' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: calculateHealthScore() >= 80 ? '#4CAF50' : 
                         calculateHealthScore() >= 60 ? '#8bc34a' :
                         calculateHealthScore() >= 40 ? '#FFC107' :
                         '#F44336'
                }}>
                  {calculateHealthScore()}
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>
                  {calculateHealthScore() >= 80 ? 'Excellent' : 
                   calculateHealthScore() >= 60 ? 'Good' :
                   calculateHealthScore() >= 40 ? 'Fair' :
                   'Needs Improvement'}
                </h4>
                <p style={{ marginBottom: '10px' }}>
                  {calculateHealthScore() >= 80 
                    ? 'You\'re doing fantastic! Keep up the great work.' 
                    : calculateHealthScore() >= 60 
                    ? 'You\'re on the right track. Keep focusing on consistent habits.'
                    : calculateHealthScore() >= 40 
                    ? 'There\'s room for improvement in your health habits.'
                    : 'Consider making some adjustments to your health routine.'}
                </p>
                <div style={{ 
                  fontSize: '14px',
                  color: userData.highContrastMode ? '#ccc' : '#6c757d',
                }}>
                  Based on your BMI, activity level, sleep, hydration, and progress
                </div>
              </div>
            </div>
          </div>
          {/* Health Score Trend Chart */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Health Score Trend</h3>
            <div style={{ height: '300px', marginBottom: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={healthScoreHistory.slice(-30)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }} />
                  <YAxis domain={[0, 100]} label={{ value: 'Health Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <Tooltip formatter={(value) => [`${value}`, 'Health Score']} labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <Legend />
                  <Area type="monotone" dataKey="score" fill="#8884d8" stroke="#8884d8" name="Health Score" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Weight-Mood Correlation */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Patterns & Insights</h3>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Weight-Mood Correlation</h4>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="category" dataKey="mood" name="Mood" />
                    <YAxis dataKey="weightDiff" name="Weight Change" unit="lbs" />
                    <ZAxis dataKey="count" range={[50, 500]} name="Frequency" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                      if (name === 'Weight Change') return `${value} lbs`;
                      return value;
                    }} />
                    <Legend />
                    <Scatter name="Mood-Weight Correlation" data={[
                      { mood: 'energetic', weightDiff: -0.5, count: 15 },
                      { mood: 'motivated', weightDiff: -0.7, count: 18 },
                      { mood: 'content', weightDiff: -0.3, count: 22 },
                      { mood: 'neutral', weightDiff: -0.1, count: 12 },
                      { mood: 'tired', weightDiff: 0.2, count: 10 },
                      { mood: 'stressed', weightDiff: 0.4, count: 8 },
                      { mood: 'unmotivated', weightDiff: 0.3, count: 5 },
                    ]} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: '14px', color: userData.highContrastMode ? '#ccc' : '#6c757d', marginTop: '10px' }}>
                Insight: You tend to lose more weight on days when you feel energetic and motivated.
              </div>
            </div>
          </div>
          {/* Personal Health Factors */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Personal Health Factors</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} width={730} height={250} data={[
                  { factor: 'Diet', value: userData.dietaryPreferences === 'balanced' ? 90 : userData.dietaryPreferences === 'highProtein' ? 85 : 75 },
                  { factor: 'Exercise', value: userData.activityLevel === 'veryActive' ? 90 : userData.activityLevel === 'active' ? 80 : userData.activityLevel === 'moderate' ? 60 : userData.activityLevel === 'light' ? 40 : 20 },
                  { factor: 'Sleep', value: userData.sleepHours >= 7 && userData.sleepHours <= 9 ? 90 : userData.sleepHours >= 6 ? 70 : 50 },
                  { factor: 'Hydration', value: userData.waterIntake >= 8 ? 90 : userData.waterIntake >= 6 ? 70 : userData.waterIntake >= 4 ? 50 : 30 },
                  { factor: 'Consistency', value: weightHistory.length > 20 ? 90 : weightHistory.length > 10 ? 70 : 40 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Your Health Factors" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '15px', backgroundColor: userData.highContrastMode ? '#3a3a3a' : 'rgba(136, 132, 216, 0.1)', padding: '15px', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '10px' }}>AI Recommendations</h4>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {userData.activityLevel === 'sedentary' && (
                  <li style={{ marginBottom: '5px' }}>Consider increasing your activity level to improve your health score.</li>
                )}
                {userData.waterIntake < 8 && (
                  <li style={{ marginBottom: '5px' }}>Increasing your water intake to 8 glasses could boost your hydration score.</li>
                )}
                {userData.sleepHours < 7 && (
                  <li style={{ marginBottom: '5px' }}>Try to get at least 7 hours of sleep for optimal health benefits.</li>
                )}
                {!userData.dietaryPreferences.includes('balanced') && (
                  <li style={{ marginBottom: '5px' }}>Consider a more balanced diet for overall health improvement.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Your Achievements</h2>
          <div style={{
            padding: '20px',
            backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            {achievements.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>You haven't earned any achievements yet. Start using the app regularly to unlock them!</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '15px' }}>Achievements Earned: {achievements.length}</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  {achievements.map(a => (
                    <div key={a.id} style={{
                      padding: '15px',
                      backgroundColor: userData.highContrastMode ? '#3a3a3a' : 'white',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: userData.highContrastMode ? '#444' : '#e9ecef',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {a.icon || '🏆'}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{a.title}</h4>
                        <div style={{
                          fontSize: '14px',
                          color: userData.highContrastMode ? '#ccc' : '#6c757d'
                        }}>
                          {a.description || 'Achievement unlocked!'}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: userData.highContrastMode ? '#aaa' : '#adb5bd',
                          marginTop: '5px'
                        }}>
                          Earned: {new Date(a.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: userData.highContrastMode ? '#3a3a3a' : 'rgba(136, 132, 216, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <p style={{ margin: '0 0 10px 0' }}><strong>Achievement Milestones:</strong></p>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Profile Champion: Complete your health profile</li>
                    <li>Consistent Tracker: Track your weight for 10+ days</li>
                    <li>25% Milestone: Achieve 25% of your weight goal</li>
                    <li>Halfway Champion: Achieve 50% of your weight goal</li>
                    <li>Challenge Master: Complete 5 personal challenges</li>
                  </ul>
                </div>
              </>
            )}
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: userData.highContrastMode ? '#2a2a2a' : '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Share Your Success</h3>
            <div style={{
              padding: '20px',
              backgroundColor: userData.highContrastMode ? '#3a3a3a' : 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '500px',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '15px' }}>My Healthy Habits Journey</h4>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Health Score</div>
                <div style={{ fontSize: '24px', color: healthScore >= 80 ? '#4CAF50' : healthScore >= 60 ? '#8bc34a' : healthScore >= 40 ? '#FFC107' : '#F44336' }}>
                  {healthScore}/100
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Achievements</div>
                <div style={{ fontSize: '24px' }}>{achievements.length}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Current Streak</div>
                <div style={{ fontSize: '24px' }}>7 days</div>
              </div>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                width: '100%'
              }}>
                <Share2 size={16} />
                Share Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
