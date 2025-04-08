import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis,
  ReferenceLine
} from 'recharts';
import {
  Activity,
  Calendar,
  User,
  Lock,
  TrendingUp,
  Target,
  Award,
  Camera,
  Share2,
  Download,
  Edit,
  X,
  Save
} from 'lucide-react';
import '../index.css';
import '../pages/WorkoutsPage.css'; // For workouts page styling

// ------------------------
// PROFILE SECTION COMPONENT
// ------------------------
const ProfileSection = () => {
  const navigate = useNavigate();

  // ------------------------------
  // Default Data & Options
  // ------------------------------
  const initialUserData = {
    name: '',
    email: 'user@example.com', // read-only, typically from auth
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
    language: 'english',
    // Workout Preferences added for workout goals integration:
    workoutPreferences: {
      frequency: "3-4 times per week",
      location: "Gym",
      preferredTypes: ["Strength Training", "Cardio"]
    }
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

  // ------------------------------
  // Mock Data Generators
  // ------------------------------
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
      if (i >= plateauStartDay && i <= plateauEndDay) {
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

  // ------------------------------
  // State Hooks
  // // ------------------------------
  // const [userData, setUserData] = useState(() => {
  //   const saved = localStorage.getItem('healthyHabitsUserProfile');
  //   return saved ? JSON.parse(saved) : initialUserData;
  // });

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail'); // or however you store it
        if (!email) return;
  
        const response = await axios.get(`http://localhost:8080/users/findByEmail?email=${email}`);
        if (response.data) {
          setUserData(response.data);
          localStorage.setItem('healthyHabitsUserProfile', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching profile from backend:', error);
        setUserData(initialUserData); // fallback if needed
      }
    };
  
    fetchProfile();
  }, []);
  

  const [weightHistory, setWeightHistory] = useState([]);
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
  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('healthyHabitsChallenges');
    return saved ? JSON.parse(saved) : generateMockChallenges();
  });
  // New state for workout goals integration:
  const [workoutForm, setWorkoutForm] = useState(userData?.workoutPreferences || {
    frequency: "3-4 times per week",
    location: "Gym",
    preferredTypes: ["Strength Training", "Cardio"]
  });
  const [editingWorkout, setEditingWorkout] = useState(false);

  // Settings:
  const [settings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      units: {
        weight: 'lbs',
        height: 'ft'
      }
    };
  });

  // ------------------------------
  // Save to localStorage when userData changes
  // ------------------------------
  useEffect(() => {
    localStorage.setItem('healthyHabitsUserProfile', JSON.stringify(userData));
  }, [userData]);

  // ------------------------------
  // Conversion Helper Functions
  // ------------------------------
  const convertWeight = (weight, targetUnit) => {
    if (!weight) return 0;
    if (targetUnit === 'kg') {
      return (weight * 0.453592).toFixed(1);
    }
    return weight;
  };

  const convertHeight = (inches, targetUnit) => {
    if (!inches) return 0;
    if (targetUnit === 'cm') {
      return (inches * 2.54).toFixed(0);
    }
    return inches;
  };

  // ------------------------------
  // Data Loading & Auth Check (logic assumed to be in place)
  // ------------------------------
  useEffect(() => {
    // Your authentication and data loading logic would be here.
  }, []);

  useEffect(() => {
    if (userData) {
      setWorkoutForm(userData?.workoutPreferences || {
        frequency: "3-4 times per week",
        location: "Gym", 
        preferredTypes: ["Strength Training", "Cardio"]
      });
    }
  }, [userData]);

  // ------------------------------
  // Derived Values
  // ------------------------------
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 0;
    const heightMeters = height * 0.0254;
    const weightKg = weight * 0.453592;
    return (weightKg / (heightMeters * heightMeters)).toFixed(1);
  };

  const bmiValue = (userData?.heightInches ?? 0) && (userData?.weightLbs ?? 0)
    ? calculateBMI(userData?.heightInches ?? 0, userData?.weightLbs ?? 0)
    : 0;

  const bmiInfo = (() => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmiValue < 25) return { category: 'Healthy Weight', color: '#2ecc71' };
    if (bmiValue < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obesity', color: '#e74c3c' };
  })();

  const userAge = (() => {
    const birthDate = new Date(userData?.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const diff = today.getMonth() - birthDate.getMonth();
    if (diff < 0 || (diff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  })();

  const weeksToGoalData = (() => {
    if (weightHistory.length < 2) return null;
    const recent = weightHistory.slice(-Math.min(12, weightHistory.length));
    if (recent.length < 2) return null;
    const changes = [];
    for (let i = 1; i < recent.length; i++) {
      changes.push(recent[i].weight - recent[i - 1].weight);
    }
    const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length;
    const variance = changes.reduce((sum, val) => sum + Math.pow(val - avgChange, 2), 0) / changes.length;
    const stdDev = Math.sqrt(variance);
    if (avgChange === 0 ||
      (avgChange > 0 && userData?.weightLbs > userData?.targetWeightLbs) ||
      (avgChange < 0 && userData?.weightLbs < userData?.targetWeightLbs)) {
      return null;
    }
    const diff = Math.abs(userData?.weightLbs - userData?.targetWeightLbs);
    const weeks = Math.ceil(diff / Math.abs(avgChange));
    const consistency = Math.max(0, Math.min(100, 100 - (stdDev / Math.abs(avgChange) * 50)));
    const pattern = (() => {
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
      const signChanges = lastFour.map((c, i) =>
        i === 0 ? 0 : (Math.sign(c) !== Math.sign(lastFour[i - 1]) ? 1 : 0)
      ).reduce((a, b) => a + b, 0);
      if (signChanges >= 2) return 'fluctuating';
      return 'steady';
    })();
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
  })();

  const motivationalMessage = (() => {
    if (!weeksToGoalData) return "Start tracking your progress to see AI-powered predictive insights!";
    const { weeksToGoal, weeklyChange, confidence, pattern, bestCaseWeeks, worstCaseWeeks } = weeksToGoalData;
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
  })();

  // ------------------------------
  // Health Score Calculation & Constant
  // ------------------------------
  const calculateHealthScore = () => {
    if (!userData) return 0;
    let score = 50;
    const bmi = calculateBMI(userData?.heightInches, userData?.weightLbs);
    if (bmi >= 18.5 && bmi < 25) score += 15;
    else if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi < 30)) score += 7;
    else if ((bmi >= 16 && bmi < 17) || (bmi >= 30 && bmi < 35)) score += 0;
    else score -= 5;
    switch (userData?.activityLevel) {
      case 'veryActive': score += 15; break;
      case 'active': score += 12; break;
      case 'moderate': score += 8; break;
      case 'light': score += 5; break;
      case 'sedentary': score += 0; break;
      default: score += 5;
    }
    if (userData?.sleepHours >= 7 && userData?.sleepHours <= 9) score += 10;
    else if (userData?.sleepHours >= 6 && userData?.sleepHours < 7) score += 5;
    else if (userData?.sleepHours > 9 && userData?.sleepHours <= 10) score += 5;
    else score += 0;
    if (userData?.waterIntake >= 8) score += 10;
    else if (userData?.waterIntake >= 6) score += 5;
    else if (userData?.waterIntake >= 4) score += 2;
    if (weeksToGoalData && weeksToGoalData.confidence > 70) score += 10;
    else if (weeksToGoalData && weeksToGoalData.confidence > 50) score += 5;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const healthScoreValue = calculateHealthScore();
  const [healthScoreHistory, setHealthScoreHistory] = useState(generateMockHealthScoreData());


  // ------------------------------
  // Existing Handlers
  // ------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const val = ("" + ['heightInches', 'weightLbs', 'targetWeightLbs']).includes(name)
      ? (value === '' ? '' : Number(value))
      : value;
    setUserData(prev => ({ ...prev, [name]: val }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!("" + validTypes).includes(file.type)) {
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get(`/profiles/${email}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/profiles', userData);
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save profile. Please try again.' });
    }
  };

  const handleReset = () => {
    setUserData(initialUserData);
    setSaveStatus({ type: 'info', message: 'Form reset to default values.' });
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

  const checkAndAddAchievements = () => {
    const newAch = [];
    const today = new Date().toISOString().split('T')[0];
    if (userData?.name && userData?.heightInches && userData?.weightLbs && userData?.dateofBirth && userData?.profilePicture && !achievements.some(a => a.type === 'profile_complete')) {
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
    if (userData?.targetWeightLbs < userData?.weightLbs) {
      const totalToLose = initialUserData.weightLbs - userData?.targetWeightLbs;
      const currentLoss = initialUserData.weightLbs - userData?.weightLbs;
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

  // ------------------------------
  // Load Data on Mount
  // ------------------------------
  useEffect(() => {
    const savedHistory = localStorage.getItem('healthyHabitsWeightHistory');
    if (savedHistory) {
      setWeightHistory(JSON.parse(savedHistory));
    } else {
      const mockHistory = generateMockWeightHistory(userData?.weightLbs, userData?.targetWeightLbs);
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

  // ------------------------------
  // New Handlers for Workout Goals Integration
  // ------------------------------
  const handleWorkoutSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      workoutPreferences: workoutForm
    });
    setEditingWorkout(false);
  };

  const handleWorkoutTypeChange = (type) => {
    if (("" + workoutForm.preferredTypes).includes(type)) {
      setWorkoutForm({
        ...workoutForm,
        preferredTypes: workoutForm.preferredTypes.filter(t => t !== type)
      });
    } else {
      setWorkoutForm({
        ...workoutForm,
        preferredTypes: [...workoutForm.preferredTypes, type]
      });
    }
  };

  const renderWorkoutForm = () => (
    <form onSubmit={handleWorkoutSubmit} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>How often do you work out?</label>
        <select
          style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
          value={workoutForm.frequency}
          onChange={(e) => setWorkoutForm({ ...workoutForm, frequency: e.target.value })}
        >
          <option value="Rarely">Rarely</option>
          <option value="1-2 times per week">1-2 times per week</option>
          <option value="3-4 times per week">3-4 times per week</option>
          <option value="5+ times per week">5+ times per week</option>
          <option value="Every day">Every day</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Where do you usually work out?</label>
        <select
          style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
          value={workoutForm.location}
          onChange={(e) => setWorkoutForm({ ...workoutForm, location: e.target.value })}
        >
          <option value="Home">Home</option>
          <option value="Gym">Gym</option>
          <option value="Outdoors">Outdoors</option>
          <option value="Mixed">Mixed environments</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Preferred workout types (select all that apply)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
          {["Strength Training", "Cardio", "HIIT", "Yoga", "Pilates", "Bodyweight", "Sports"].map(type => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id={`workout-${type}`}
                checked={("" + workoutForm.preferredTypes).includes(type)}
                onChange={() => handleWorkoutTypeChange(type)}
              />
              <label htmlFor={`workout-${type}`}>{type}</label>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          <Save size={16} style={{ marginRight: '4px' }} />
          Save
        </button>
        <button type="button" onClick={() => setEditingWorkout(false)} style={{ padding: '10px 15px', backgroundColor: '#f8f9fa', color: '#212529', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
          <X size={16} style={{ marginRight: '4px' }} />
          Cancel
        </button>
      </div>
    </form>
  );

  // ------------------------------
  // Render Component JSX
  // ------------------------------
  return (
    <div className="profile-section" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      color: userData?.highContrastMode ? '#fff' : '#333',
      backgroundColor: userData?.highContrastMode ? '#1a1a1a' : '#fff'
    }}>
      <h1 style={{
        marginBottom: '20px',
        color: userData?.highContrastMode ? '#fff' : '#2c3e50',
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
              backgroundColor: userData?.highContrastMode ? '#444' : '#f8f9fa',
              color: userData?.highContrastMode ? '#fff' : '#333',
              border: userData?.highContrastMode ? '1px solid #666' : '1px solid #ddd',
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
            onClick={() => setUserData({ ...userData, highContrastMode: !userData?.highContrastMode })}
            style={{
              backgroundColor: userData?.highContrastMode ? '#444' : '#f8f9fa',
              color: userData?.highContrastMode ? '#fff' : '#333',
              border: userData?.highContrastMode ? '1px solid #666' : '1px solid #ddd',
              padding: '8px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            {/* {userData?.highContrastMode ? <Sun size={16} /> : <Moon size={16} />} */}
            {userData?.highContrastMode ? 'Standard Mode' : 'High Contrast'}
          </button>
        </div>
      </h1>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: userData?.highContrastMode ? '1px solid #444' : '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        {['profile', 'analytics', 'achievements'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 15px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? (userData?.highContrastMode ? '2px solid #fff' : '2px solid #4285f4') : 'none',
              color: activeTab === tab ? (userData?.highContrastMode ? '#fff' : '#4285f4') : (userData?.highContrastMode ? '#aaa' : '#6c757d'),
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
          backgroundColor: userData?.highContrastMode
            ? (saveStatus.type === 'success' ? '#0d4b26' : saveStatus.type === 'error' ? '#5e1c1c' : '#0d3b4b')
            : (saveStatus.type === 'success' ? '#d4edda' : saveStatus.type === 'error' ? '#f8d7da' : '#d1ecf1'),
          color: userData?.highContrastMode ? '#fff' : (saveStatus.type === 'success' ? '#155724' : saveStatus.type === 'error' ? '#721c24' : '#0c5460')
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
                  {userData?.profilePicture ? (
                    <img src={userData?.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                {userData?.profilePicture && (
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
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                  <input id="name" type="text" name="name" value={userData?.name} onChange={handleInputChange} style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} placeholder="Enter your full name" required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Lock size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Email (read-only)
                  </label>
                  <input id="email" type="email" name="email" value={userData?.email} disabled style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f1f1f1'
                  }} />
                  <small style={{ color: '#6c757d' }}>Email cannot be changed here for security reasons</small>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="dateOfBirth" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Date of Birth
                  </label>
                  <input id="dateOfBirth" type="date" name="dateOfBirth" value={userData?.dateofBirth} onChange={handleInputChange} style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="heightInches" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Height (inches)</label>
                  <input id="heightInches" type="number" name="heightInches" value={userData?.height} onChange={handleInputChange} min="36" max="96" style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="weightLbs" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Weight (lbs)</label>
                  <input id="weightLbs" type="number" name="weightLbs" value={userData?.weight} onChange={handleInputChange} min="50" max="500" style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="targetWeightLbs" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Target size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Target Weight (lbs)
                  </label>
                  <input id="targetWeightLbs" type="number" name="targetWeightLbs" value={userData?.desiredWeight} onChange={handleInputChange} min="50" max="500" style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="activityLevel" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    <Activity size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Activity Level
                  </label>
                  <select id="activityLevel" name="activityLevel" value={userData?.activityLevel} onChange={handleInputChange} style={{
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
                  <label htmlFor="dietaryPreferences" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Dietary Preferences</label>
                  <select id="dietaryPreferences" name="dietaryPreferences" value={userData?.dietaryPreferences} onChange={handleInputChange} style={{
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
                  <button type="submit" style={{
                    flex: '1',
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    Save Profile
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
          {/* Right side: Health Metrics, Weight Progress, etc. */}
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
                  <div style={{ fontSize: '24px' }}>{userData?.desiredWeight} lbs</div>
                  <div style={{ color: '#6c757d' }}>
                    {userData?.weightLbs > userData?.targetWeightLbs
                      ? `${(userData?.weightLbs - userData?.targetWeightLbs).toFixed(1)} lbs to lose`
                      : userData?.weightLbs < userData?.targetWeightLbs
                        ? `${(userData?.targetWeightLbs - userData?.weightLbs).toFixed(1)} lbs to gain`
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
                    <ReferenceLine y={userData?.targetWeightLbs} label="Target" stroke="#82ca9d" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* NEW: Workout Goals Section */}
            <div style={styles.sectionBox}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>
                  <Award size={20} style={{ marginRight: '4px', color: '#10B981' }} />
                  Workout Goals
                </h3>
                <button style={styles.iconButton} onClick={() => setEditingWorkout(!editingWorkout)}>
                  <Edit size={16} />
                </button>
              </div>
              {editingWorkout ? (
                renderWorkoutForm()
              ) : (
                <div>
                  <div style={styles.row}>
                    <span>Frequency</span>
                    <span>{userData?.workoutPreferences?.frequency || "Not set"}</span>
                  </div>
                  <div style={styles.row}>
                    <span>Location</span>
                    <span>{userData?.workoutPreferences?.location || "Not set"}</span>
                  </div>
                  <div style={styles.row}>
                    <span>Preferences</span>
                    <span>{userData?.workoutPreferences?.preferredTypes?.join(", ") || "None selected"}</span>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <Link to="/workouts" style={{ ...styles.linkButton, display: 'block', textAlign: 'center' }}>
                      View Recommended Workouts
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '20px'
            }}>
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
              backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
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
              backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
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
                <div style={{ fontSize: '14px', color: userData?.highContrastMode ? '#ccc' : '#6c757d', marginTop: '10px' }}>
                  Insight: You tend to lose more weight on days when you feel energetic and motivated.
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Personal Health Factors</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={[
                    { factor: 'Diet', value: userData?.dietaryPreferences === 'balanced' ? 90 : userData?.dietaryPreferences === 'highProtein' ? 85 : 75 },
                    { factor: 'Exercise', value: userData?.activityLevel === 'veryActive' ? 90 : userData?.activityLevel === 'active' ? 80 : userData?.activityLevel === 'moderate' ? 60 : userData?.activityLevel === 'light' ? 40 : 20 },
                    { factor: 'Sleep', value: userData?.sleepHours >= 7 && userData?.sleepHours <= 9 ? 90 : userData?.sleepHours >= 6 ? 70 : 50 },
                    { factor: 'Hydration', value: userData?.waterIntake >= 8 ? 90 : userData?.waterIntake >= 6 ? 70 : userData?.waterIntake >= 4 ? 50 : 30 },
                    { factor: 'Consistency', value: weightHistory.length > 20 ? 90 : weightHistory.length > 10 ? 70 : 40 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Your Health Factors" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '15px', backgroundColor: userData?.highContrastMode ? '#3a3a3a' : 'rgba(136, 132, 216, 0.1)', padding: '15px', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '10px' }}>AI Recommendations</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {userData?.activityLevel === 'sedentary' && (
                    <li style={{ marginBottom: '5px' }}>Consider increasing your activity level to improve your health score.</li>
                  )}
                  {userData?.waterIntake < 8 && (
                    <li style={{ marginBottom: '5px' }}>Increasing your water intake to 8 glasses could boost your hydration score.</li>
                  )}
                  {userData?.sleepHours < 7 && (
                    <li style={{ marginBottom: '5px' }}>Try to get at least 7 hours of sleep for optimal health benefits.</li>
                  )}
                  {("" + userData?.dietaryPreferences).includes('balanced') && (
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
            backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa', 
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
                  ${healthScoreValue >= 80 ? '#4CAF50' : 
                    healthScoreValue >= 60 ? '#8bc34a' :
                    healthScoreValue >= 40 ? '#FFC107' :
                    '#F44336'} ${healthScoreValue * 3.6}deg, 
                  ${userData?.highContrastMode ? '#444' : '#e0e0e0'} 0deg
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
                  backgroundColor: userData?.highContrastMode ? '#2a2a2a' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: healthScoreValue >= 80 ? '#4CAF50' : 
                         healthScoreValue >= 60 ? '#8bc34a' :
                         healthScoreValue >= 40 ? '#FFC107' :
                         '#F44336'
                }}>
                  {healthScoreValue}
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>
                  {healthScoreValue >= 80 ? 'Excellent' : 
                   healthScoreValue >= 60 ? 'Good' :
                   healthScoreValue >= 40 ? 'Fair' :
                   'Needs Improvement'}
                </h4>
                <p style={{ marginBottom: '10px' }}>
                  {healthScoreValue >= 80 
                    ? 'You\'re doing fantastic! Keep up the great work.' 
                    : healthScoreValue >= 60 
                    ? 'You\'re on the right track. Keep focusing on consistent habits.'
                    : healthScoreValue >= 40 
                    ? 'There\'s room for improvement in your health habits.'
                    : 'Consider making some adjustments to your health routine.'}
                </p>
                <div style={{ 
                  fontSize: '14px',
                  color: userData?.highContrastMode ? '#ccc' : '#6c757d',
                }}>
                  Based on your BMI, activity level, sleep, hydration, and progress
                </div>
              </div>
            </div>
          </div>
          {/* Health Score Trend Chart */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa', 
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
          {/* Patterns & Insights */}
          <div style={{
            padding: '20px',
            backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
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
              <div style={{ fontSize: '14px', color: userData?.highContrastMode ? '#ccc' : '#6c757d', marginTop: '10px' }}>
                Insight: You tend to lose more weight on days when you feel energetic and motivated.
              </div>
            </div>
          </div>
          {/* Personal Health Factors */}
          <div style={{
            padding: '20px',
            backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Personal Health Factors</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} width={730} height={250} data={[
                  { factor: 'Diet', value: userData?.dietaryPreferences === 'balanced' ? 90 : userData?.dietaryPreferences === 'highProtein' ? 85 : 75 },
                  { factor: 'Exercise', value: userData?.activityLevel === 'veryActive' ? 90 : userData?.activityLevel === 'active' ? 80 : userData?.activityLevel === 'moderate' ? 60 : userData?.activityLevel === 'light' ? 40 : 20 },
                  { factor: 'Sleep', value: userData?.sleepHours >= 7 && userData?.sleepHours <= 9 ? 90 : userData?.sleepHours >= 6 ? 70 : 50 },
                  { factor: 'Hydration', value: userData?.waterIntake >= 8 ? 90 : userData?.waterIntake >= 6 ? 70 : userData?.waterIntake >= 4 ? 50 : 30 },
                  { factor: 'Consistency', value: weightHistory.length > 20 ? 90 : weightHistory.length > 10 ? 70 : 40 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Your Health Factors" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '15px', backgroundColor: userData?.highContrastMode ? '#3a3a3a' : 'rgba(136, 132, 216, 0.1)', padding: '15px', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '10px' }}>AI Recommendations</h4>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {userData?.activityLevel === 'sedentary' && (
                  <li style={{ marginBottom: '5px' }}>Consider increasing your activity level to improve your health score.</li>
                )}
                {userData?.waterIntake < 8 && (
                  <li style={{ marginBottom: '5px' }}>Increasing your water intake to 8 glasses could boost your hydration score.</li>
                )}
                {userData?.sleepHours < 7 && (
                  <li style={{ marginBottom: '5px' }}>Try to get at least 7 hours of sleep for optimal health benefits.</li>
                )}
                {!("" + userData?.dietaryPreferences).includes('balanced') && (
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
            backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
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
                      backgroundColor: userData?.highContrastMode ? '#3a3a3a' : 'white',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: userData?.highContrastMode ? '#444' : '#e9ecef',
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
                          color: userData?.highContrastMode ? '#ccc' : '#6c757d'
                        }}>
                          {a.description || 'Achievement unlocked!'}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: userData?.highContrastMode ? '#aaa' : '#adb5bd',
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
                  backgroundColor: userData?.highContrastMode ? '#3a3a3a' : 'rgba(136, 132, 216, 0.1)',
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
            backgroundColor: userData?.highContrastMode ? '#2a2a2a' : '#f8f9fa',
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
              backgroundColor: userData?.highContrastMode ? '#3a3a3a' : 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '500px',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '15px' }}>My Healthy Habits Journey</h4>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Health Score</div>
                <div style={{ fontSize: '24px', color: healthScoreValue >= 80 ? '#4CAF50' : healthScoreValue >= 60 ? '#8bc34a' : healthScoreValue >= 40 ? '#FFC107' : '#F44336' }}>
                  {healthScoreValue}/100
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

// ------------------------------
// Inline Styles Object
// ------------------------------
const styles = {
  pageWrapper: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  mainArea: {
    flex: 1,
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  contentWrapper: {
    backgroundColor: 'var(--section-bg)',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
    boxShadow: '0 2px 5px var(--shadow-color)',
  },
  headerSection: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '20px',
    marginBottom: '20px',
    gap: '20px',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid var(--primary-color)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    padding: '6px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  userInfo: {
    flex: 1,
    minWidth: '200px',
    textAlign: 'left',
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-color)',
    margin: '0 0 5px 0',
  },
  userEmail: {
    color: 'var(--muted-text)',
    margin: '0 0 10px 0',
  },
  quickStatsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--card-bg)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text-color)',
    boxShadow: '0 1px 3px var(--shadow-color)',
  },
  resetButton: {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  sectionBox: {
    backgroundColor: 'var(--card-bg)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px var(--shadow-color)',
    color: 'var(--text-color)',
    transition: 'transform 0.3s',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '10px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-color)',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
  },
  iconButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--primary-color)',
    transition: 'transform 0.2s',
  },
  chartContainer: {
    height: '200px',
    marginTop: '10px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '8px 0',
    borderTop: `1px solid var(--border-color)`,
    color: 'var(--text-color)',
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: 'var(--section-bg)',
    borderRadius: '8px',
    height: '10px',
    marginTop: '8px',
  },
  progressBar: {
    height: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary-color)',
    transition: 'width 0.5s ease-in-out',
  },
  progressText: {
    textAlign: 'right',
    fontSize: '12px',
    marginTop: '4px',
    color: 'var(--muted-text)',
  },
  metricGroup: {
    marginBottom: '15px',
  },
  form: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-color)',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    width: '100%',
    backgroundColor: 'var(--input-bg)',
    border: `1px solid var(--input-border)`,
    borderRadius: '8px',
    color: 'var(--text-color)',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
  },
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  actionButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    fontSize: '14px',
  },
  settingsSection: {
    marginTop: '30px',
    padding: '20px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'center',
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '10px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  linkButton: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '15px',
    transition: 'background-color 0.2s',
    textAlign: 'center',
    fontWeight: '500',
  },
};

export default ProfileSection;
