import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Settings,
  Calendar,
  Award,
  TrendingUp,
  Utensils,
  Edit,
  X,
  Save,
  PlusCircle,
} from 'lucide-react';
import '../index.css';

const ProfileSection = () => {
  const navigate = useNavigate();

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('dietTrackerUserData');
    navigate('/login');
  };

  // Default user data structure
  const defaultUserData = useMemo(() => ({
    username: "",
    email: "",
    avatar: "/api/placeholder/150/150",
    stats: {
      daysTracked: 0,
      currentStreak: 0,
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFat: 0,
    },
    goals: {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 70,
    },
    health: {
      weight: 0,
      targetWeight: 0,
      height: 0,
      activityLevel: "Moderate"
    },
    weightHistory: [],
    workoutPreferences: {
      frequency: "3-4 times per week",
      location: "Gym",
      preferredTypes: ["Strength Training", "Cardio"]
    }
  }), []);

  // Delete account handler
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      const password = prompt('Please enter your password to confirm deletion:');
      
      if (password) {
        try {
          await axios.delete(`/users/deleteAccount?email=${userData.email}`, {
            data: { password }
          });
          
          localStorage.clear();
          navigate('/');
        } catch (error) {
          alert(error.response?.data || 'Error deleting account');
        }
      }
    }
  };

  // State for debugging
  const [debug, setDebug] = useState({
    authChecked: false,
    userEmail: null,
    loadingStage: 'initial',
    error: null
  });

  // User data states
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('dietTrackerUserData');
    return savedData ? JSON.parse(savedData) : defaultUserData;
  });
  
  // Form editing states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);
  const [addingWeight, setAddingWeight] = useState(false);
  
  // Form data states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });
  const [healthForm, setHealthForm] = useState({});
  const [goalsForm, setGoalsForm] = useState({});
  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: 0,
  });
  
  // Settings
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      units: {
        weight: 'lbs',
        height: 'ft'
      }
    };
  });

  // Workout preferences
  const [workoutForm, setWorkoutForm] = useState({
    frequency: userData?.workoutPreferences?.frequency || "3-4 times per week",
    location: userData?.workoutPreferences?.location || "Gym",
    preferredTypes: userData?.workoutPreferences?.preferredTypes || ["Strength Training", "Cardio"]
  });
  const [editingWorkout, setEditingWorkout] = useState(false);

  // Save to localStorage when userData changes
  useEffect(() => {
    localStorage.setItem('dietTrackerUserData', JSON.stringify(userData));
  }, [userData]);

  // Add conversion helper functions
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

  const formatHeight = (inches) => {
    if (settings.units.height === 'cm') {
      return `${convertHeight(inches, 'cm')} cm`;
    }
    return `${Math.floor(inches / 12)}'${inches % 12}"`;
  };

  const formatWeight = (weight) => {
    if (settings.units.weight === 'kg') {
      return `${convertWeight(weight, 'kg')} kg`;
    }
    return `${weight} lbs`;
  };

  // Authentication check and data loading
  useEffect(() => {
    setDebug(prev => ({...prev, loadingStage: 'checking auth'}));
    
    const userEmail = localStorage.getItem('userEmail');
    setDebug(prev => ({...prev, userEmail}));
    
    if (!userEmail) {
      console.log("No user email found in localStorage, redirecting to login");
      setDebug(prev => ({...prev, authChecked: true, loadingStage: 'redirecting - no email'}));
      navigate('/login');
      return;
    }
    
    setDebug(prev => ({...prev, authChecked: true, loadingStage: 'loading saved data'}));
    const savedData = localStorage.getItem('dietTrackerUserData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Update email if missing
        if (!parsedData.email && userEmail) {
          parsedData.email = userEmail;
          // Ensure username exists to avoid UI issues
          if (!parsedData.username) {
            parsedData.username = userEmail.split('@')[0];
          }
        }
        
        setUserData(parsedData);
        setUser({...parsedData});
        
        // Set form data
        setProfileForm({
          name: parsedData.username || "",
          email: parsedData.email || userEmail
        });
        setHealthForm(parsedData.health || defaultUserData.health);
        setGoalsForm(parsedData.goals || defaultUserData.goals);
        
        setDebug(prev => ({...prev, loadingStage: 'data loaded from localStorage'}));
      } catch (error) {
        console.error('Error parsing saved data:', error);
        setDebug(prev => ({...prev, error: 'Parse error', loadingStage: 'creating new data'}));
        
        // Create new user data with the email we have
        const newUserData = {
          ...defaultUserData,
          email: userEmail,
          username: userEmail.split('@')[0]
        };
        setUserData(newUserData);
        setUser({...newUserData});
        localStorage.setItem('dietTrackerUserData', JSON.stringify(newUserData));
      }
    } else {
      // No saved data, initialize with default + email
      setDebug(prev => ({...prev, loadingStage: 'no saved data, creating new'}));
      const newUserData = {
        ...defaultUserData,
        email: userEmail,
        username: userEmail.split('@')[0]
      };
      setUserData(newUserData);
      setUser({...newUserData});
      localStorage.setItem('dietTrackerUserData', JSON.stringify(newUserData));
    }
  }, [navigate, defaultUserData]);

  // Update initial form values after user data is loaded
  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.username || "",
        email: userData.email || ""
      });
      setHealthForm(userData.health || defaultUserData.health);
      setGoalsForm(userData.goals || defaultUserData.goals);
      setWeightForm(prev => ({
        ...prev,
        weight: userData?.health?.weight || 0
      }));
      setWorkoutForm(userData?.workoutPreferences || {
        frequency: "3-4 times per week",
        location: "Gym", 
        preferredTypes: ["Strength Training", "Cardio"]
      });
    }
  }, [userData, defaultUserData]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Ensure userData and its nested properties are defined
  const health = userData?.health || {};

  // Calculate BMI
  const calculateBMI = () => {
    if (!health?.height || !health?.weight) return 'N/A';
    const heightInMeters = health.height * 0.0254;
    const weightInKg = health.weight * 0.453592;
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Calculate progress percentage towards target weight
  const calculateWeightProgress = () => {
    if (!health?.targetWeight || !health?.weight || !userData?.weightHistory?.length) return 0;
    const startWeight = Math.max(...userData.weightHistory.map((entry) => entry.weight));
    const totalToLose = Math.abs(health.targetWeight - startWeight);
    const lost = Math.abs(health.weight - startWeight);
    return Math.min(100, Math.round((lost / totalToLose) * 100));
  };

  // Update profile information
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      username: profileForm.name,
      email: profileForm.email,
    });
    setEditingProfile(false);
  };

  // Update health metrics
  const handleHealthSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      health: healthForm,
    });
    setEditingHealth(false);
  };

  // Update diet goals
  const handleGoalsSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      goals: goalsForm,
    });
    setEditingGoals(false);
  };

  // Add new weight entry
  const handleWeightSubmit = (e) => {
    e.preventDefault();
    const dateObj = new Date(weightForm.date);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const updatedHistory = [
      ...userData.weightHistory,
      { date: month, weight: parseFloat(weightForm.weight) },
    ].sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.date) - months.indexOf(b.date);
    });

    setUserData({
      ...userData,
      health: {
        ...userData.health,
        weight: parseFloat(weightForm.weight),
      },
      weightHistory: updatedHistory,
    });
    setAddingWeight(false);
  };

  // Reset app data
  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('dietTrackerUserData');
      setUserData(defaultUserData);
    }
  };

  // Update workout preferences
  const handleWorkoutSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData, 
      workoutPreferences: workoutForm
    });
    setEditingWorkout(false);
  };

  // Handle checkbox changes for workout types
  const handleWorkoutTypeChange = (type) => {
    if (workoutForm.preferredTypes.includes(type)) {
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

  // RENDER FORMS
  const renderWorkoutForm = () => (
    <form onSubmit={handleWorkoutSubmit} style={styles.form}>
      <div>
        <label style={styles.label}>How often do you work out?</label>
        <select
          style={styles.input}
          value={workoutForm.frequency}
          onChange={(e) => setWorkoutForm({...workoutForm, frequency: e.target.value})}
        >
          <option value="Rarely">Rarely</option>
          <option value="1-2 times per week">1-2 times per week</option>
          <option value="3-4 times per week">3-4 times per week</option>
          <option value="5+ times per week">5+ times per week</option>
          <option value="Every day">Every day</option>
        </select>
      </div>
      
      <div>
        <label style={styles.label}>Where do you usually work out?</label>
        <select
          style={styles.input}
          value={workoutForm.location}
          onChange={(e) => setWorkoutForm({...workoutForm, location: e.target.value})}
        >
          <option value="Home">Home</option>
          <option value="Gym">Gym</option>
          <option value="Outdoors">Outdoors</option>
          <option value="Mixed">Mixed environments</option>
        </select>
      </div>
      
      <div>
        <label style={styles.label}>Preferred workout types (select all that apply)</label>
        <div style={styles.checkboxGroup}>
          {["Strength Training", "Cardio", "HIIT", "Yoga", "Pilates", "Bodyweight", "Sports"].map(type => (
            <div key={type} style={styles.checkbox}>
              <input
                type="checkbox"
                id={`workout-${type}`}
                checked={workoutForm.preferredTypes.includes(type)}
                onChange={() => handleWorkoutTypeChange(type)}
              />
              <label htmlFor={`workout-${type}`}>{type}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.buttonGroup}>
        <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
          <Save size={16} style={{ marginRight: '4px' }} />
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingWorkout(false)}
          style={{ ...styles.button, ...styles.cancelButton }}
        >
          <X size={16} style={{ marginRight: '4px' }} />
          Cancel
        </button>
      </div>
    </form>
  );

  const renderProfileForm = () => (
    <form onSubmit={handleProfileSubmit} style={styles.form}>
      <div>
        <label style={styles.label}>Name</label>
        <input
          type="text"
          style={styles.input}
          value={profileForm.name}
          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          style={styles.input}
          value={profileForm.email}
          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          required
        />
      </div>
      <div style={styles.buttonGroup}>
        <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
          <Save size={16} style={{ marginRight: '4px' }} />
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingProfile(false)}
          style={{ ...styles.button, ...styles.cancelButton }}
        >
          <X size={16} style={{ marginRight: '4px' }} />
          Cancel
        </button>
      </div>
    </form>
  );

  const renderHealthForm = () => (
    <form onSubmit={handleHealthSubmit} style={styles.form}>
      <div>
        <label style={styles.label}>Current Weight (lbs)</label>
        <input
          type="number"
          style={styles.input}
          value={healthForm.weight}
          onChange={(e) => setHealthForm({ ...healthForm, weight: parseFloat(e.target.value) })}
          min="50"
          max="500"
          required
        />
      </div>
      <div>
        <label style={styles.label}>Target Weight (lbs)</label>
        <input
          type="number"
          style={styles.input}
          value={healthForm.targetWeight}
          onChange={(e) => setHealthForm({ ...healthForm, targetWeight: parseFloat(e.target.value) })}
          min="50"
          max="500"
          required
        />
      </div>
      <div>
        <label style={styles.label}>Height (inches)</label>
        <input
          type="number"
          style={styles.input}
          value={healthForm.height}
          onChange={(e) => setHealthForm({ ...healthForm, height: parseFloat(e.target.value) })}
          min="36"
          max="96"
          required
        />
      </div>
      <div>
        <label style={styles.label}>Activity Level</label>
        <select
          style={styles.input}
          value={healthForm.activityLevel}
          onChange={(e) => setHealthForm({ ...healthForm, activityLevel: e.target.value })}
          required
        >
          <option value="Sedentary">Sedentary</option>
          <option value="Light">Light</option>
          <option value="Moderate">Moderate</option>
          <option value="Active">Active</option>
          <option value="Very Active">Very Active</option>
        </select>
      </div>
      <div style={styles.buttonGroup}>
        <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
          <Save size={16} style={{ marginRight: '4px' }} />
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingHealth(false)}
          style={{ ...styles.button, ...styles.cancelButton }}
        >
          <X size={16} style={{ marginRight: '4px' }} />
          Cancel
        </button>
      </div>
    </form>
  );

  const renderGoalsForm = () => (
    <form onSubmit={handleGoalsSubmit} style={styles.form}>
      <div>
        <label style={styles.label}>Daily Calories</label>
        <input
          type="number"
          style={styles.input}
          value={goalsForm.calories}
          onChange={(e) => setGoalsForm({ ...goalsForm, calories: parseFloat(e.target.value) })}
          min="500"
          max="5000"
          required
        />
      </div>
      <div>
        <label style={styles.label}>Protein (g)</label>
        <input
          type="number"
          style={styles.input}
          value={goalsForm.protein}
          onChange={(e) => setGoalsForm({ ...goalsForm, protein: parseFloat(e.target.value) })}
          min="20"
          max="400"
          required
        />
      </div>
      <div>
        <label style={styles.label}>Carbs (g)</label>
        <input
          type="number"
          style={styles.input}
          value={goalsForm.carbs}
          onChange={(e) => setGoalsForm({ ...goalsForm, carbs: parseFloat(e.target.value) })}
          min="0"
          max="600"
          required
        />
      </div>
      <div>
        <label style={styles.label}>Fat (g)</label>
        <input
          type="number"
          style={styles.input}
          value={goalsForm.fat}
          onChange={(e) => setGoalsForm({ ...goalsForm, fat: parseFloat(e.target.value) })}
          min="10"
          max="200"
          required
        />
      </div>
      <div style={styles.buttonGroup}>
        <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
          <Save size={16} style={{ marginRight: '4px' }} />
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingGoals(false)}
          style={{ ...styles.button, ...styles.cancelButton }}
        >
          <X size={16} style={{ marginRight: '4px' }} />
          Cancel
        </button>
      </div>
    </form>
  );

  const renderWeightForm = () => (
    <form onSubmit={handleWeightSubmit} style={styles.form}>
      <div>
        <label style={styles.label}>Date</label>
        <input
          type="date"
          style={styles.input}
          value={weightForm.date}
          onChange={(e) => setWeightForm({ ...weightForm, date: e.target.value })}
          required
        />
      </div>
      <div>
        <label style={styles.label}>Weight (lbs)</label>
        <input
          type="number"
          style={styles.input}
          value={weightForm.weight}
          onChange={(e) => setWeightForm({ ...weightForm, weight: parseFloat(e.target.value) })}
          min="50"
          max="500"
          step="0.1"
          required
        />
      </div>
      <div style={styles.buttonGroup}>
        <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
          <Save size={16} style={{ marginRight: '4px' }} />
          Save
        </button>
        <button
          type="button"
          onClick={() => setAddingWeight(false)}
          style={{ ...styles.button, ...styles.cancelButton }}
        >
          <X size={16} style={{ marginRight: '4px' }} />
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div style={styles.pageWrapper}>
      {/* Debug information */}
      {debug.error && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          background: '#ffeeee',
          padding: 10,
          zIndex: 1000,
          border: '1px solid red'
        }}>
          Debug: {debug.loadingStage} | Email: {debug.userEmail || 'none'} | Error: {debug.error}
        </div>
      )}
      
      {/* Only render content if we have user data */}
      {user && userData ? (
        <>
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>Healthy Habits</h1>
            <nav style={styles.nav}>
              <button style={styles.navButton} onClick={() => navigate('/homepage')}>Home</button>
              <button style={styles.navButton} onClick={() => navigate('/profile')}>Profile</button>
              <button style={styles.navButton} onClick={() => navigate('/settings')}>Settings</button>
              <button 
                style={{...styles.navButton, backgroundColor: 'var(--error-color)', borderColor: 'var(--error-color)'}}
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </nav>
          </header>

          <main style={styles.mainArea}>
            <div style={styles.contentWrapper}>
              {/* Top User Info Section */}
              <div style={styles.headerSection}>
                <div style={styles.avatarContainer}>
                  <img src={userData.avatar} alt={userData.name} style={styles.avatar} />
                  <button style={styles.editAvatarButton} onClick={() => setEditingProfile(!editingProfile)}>
                    <Edit size={16} />
                  </button>
                </div>

                <div style={styles.userInfo}>
                  <h1>{userData ? `Hello, ${userData.username}` : 'Loading...'}</h1>
                  <h2 style={styles.userName}>{userData.username}</h2>
                  <p style={styles.userEmail}>{userData.email}</p>
                  
                  {editingProfile && renderProfileForm()}
                  
                  {!editingProfile && (
                    <div style={styles.quickStatsContainer}>
                      <div style={styles.statBox}>
                        <Calendar size={16} style={{ marginRight: '4px' }} />
                        <span>{userData.stats.daysTracked} days tracked</span>
                      </div>
                      <div style={styles.statBox}>
                        <Award size={16} style={{ marginRight: '4px' }} />
                        <span>{userData.stats.currentStreak} day streak</span>
                      </div>
                      <div style={styles.statBox}>
                        <TrendingUp size={16} style={{ marginRight: '4px' }} />
                        <span>BMI: {calculateBMI()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button style={styles.resetButton} onClick={resetData}>
                  <Settings size={16} style={{ marginRight: '4px' }} />
                  Reset Data
                </button>
              </div>

              {/* Main Grid of Sections */}
              <div style={styles.sectionsGrid}>
                {/* Health Metrics */}
                <div style={styles.sectionBox}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>
                      <User size={20} style={{ marginRight: '4px', color: '#10B981' }} />
                      Health Metrics
                    </h3>
                    <button style={styles.iconButton} onClick={() => setEditingHealth(!editingHealth)}>
                      <Edit size={16} />
                    </button>
                  </div>

                  {editingHealth ? (
                    renderHealthForm()
                  ) : (
                    <div>
                      <div style={styles.row}>
                        <span>Current Weight</span>
                        <span>{formatWeight(userData.health.weight)}</span>
                      </div>
                      <div style={styles.row}>
                        <span>Target Weight</span>
                        <span>{formatWeight(userData.health.targetWeight)}</span>
                      </div>
                      <div style={styles.progressBarContainer}>
                        <div style={{ ...styles.progressBar, width: `${calculateWeightProgress()}%` }} />
                      </div>
                      <div style={styles.progressText}>{calculateWeightProgress()}% to goal</div>

                      <div style={styles.row}>
                        <span>Height</span>
                        <span>{formatHeight(userData.health.height)}</span>
                      </div>
                      <div style={styles.row}>
                        <span>Activity Level</span>
                        <span>{userData.health.activityLevel}</span>
                      </div>
                      <div style={styles.row}>
                        <span>BMI</span>
                        <span>{calculateBMI()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diet Overview */}
                <div style={styles.sectionBox}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>
                      <Utensils size={20} style={{ marginRight: '4px', color: '#10B981' }} />
                      Diet Overview
                    </h3>
                    <button style={styles.iconButton} onClick={() => setEditingGoals(!editingGoals)}>
                      <Edit size={16} />
                    </button>
                  </div>

                  {editingGoals ? (
                    renderGoalsForm()
                  ) : (
                    <div>
                      {/* Calories */}
                      <div style={styles.metricGroup}>
                        <div style={styles.row}>
                          <span>Daily Calories</span>
                          <span>
                            {userData.stats.avgCalories} / {userData.goals.calories}
                          </span>
                        </div>
                        <div style={styles.progressBarContainer}>
                          <div
                            style={{
                              ...styles.progressBar,
                              backgroundColor: '#3B82F6',
                              width: `${Math.min(
                                100,
                                (userData.stats.avgCalories / userData.goals.calories) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Protein */}
                      <div style={styles.metricGroup}>
                        <div style={styles.row}>
                          <span>Protein</span>
                          <span>
                            {userData.stats.avgProtein}g / {userData.goals.protein}g
                          </span>
                        </div>
                        <div style={styles.progressBarContainer}>
                          <div
                            style={{
                              ...styles.progressBar,
                              backgroundColor: '#EF4444',
                              width: `${Math.min(
                                100,
                                (userData.stats.avgProtein / userData.goals.protein) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Carbs */}
                      <div style={styles.metricGroup}>
                        <div style={styles.row}>
                          <span>Carbs</span>
                          <span>
                            {userData.stats.avgCarbs}g / {userData.goals.carbs}g
                          </span>
                        </div>
                        <div style={styles.progressBarContainer}>
                          <div
                            style={{
                              ...styles.progressBar,
                              backgroundColor: '#F59E0B',
                              width: `${Math.min(
                                100,
                                (userData.stats.avgCarbs / userData.goals.carbs) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Fat */}
                      <div style={styles.metricGroup}>
                        <div style={styles.row}>
                          <span>Fat</span>
                          <span>
                            {userData.stats.avgFat}g / {userData.goals.fat}g
                          </span>
                        </div>
                        <div style={styles.progressBarContainer}>
                          <div
                            style={{
                              ...styles.progressBar,
                              backgroundColor: '#10B981',
                              width: `${Math.min(
                                100,
                                (userData.stats.avgFat / userData.goals.fat) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weight Progress */}
                <div style={styles.sectionBox}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>
                      <TrendingUp size={20} style={{ marginRight: '4px', color: '#10B981' }} />
                      Weight Progress
                    </h3>
                    <button style={styles.iconButton} onClick={() => setAddingWeight(!addingWeight)}>
                      <PlusCircle size={16} />
                    </button>
                  </div>

                  {addingWeight ? (
                    renderWeightForm()
                  ) : (
                    <div style={styles.chartContainer}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={userData.weightHistory}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#10B981"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Workout Preferences Section */}
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
                      <div style={{marginTop: '10px'}}>
                        <Link to="/workouts" style={{...styles.linkButton, display: 'block', textAlign: 'center'}}>
                          View Recommended Workouts
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtonsContainer}>
                <button 
                  style={{ ...styles.actionButton, backgroundColor: '#10B981', color: '#fff' }}
                  onClick={() => setEditingGoals(true)}
                >
                  Update Goals
                </button>
                <button 
                  style={{ ...styles.actionButton, backgroundColor: '#3B82F6', color: '#fff' }}
                  onClick={() => alert("Log Today's Meals feature would open a meal logging interface")}
                >
                  Log Today's Meals
                </button>
              </div>

              {/* Settings Section */}
              <div style={styles.settingsSection}>
                <button 
                  style={{ 
                    ...styles.actionButton, 
                    backgroundColor: 'var(--error-color)', 
                    marginTop: '20px' 
                  }}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </main>
        </>
      ) : (
        <div style={{padding: '2rem', textAlign: 'center'}}>
          <h2>Loading profile data...</h2>
          <p>If you're not redirected automatically, <button onClick={() => navigate('/login')}>click here to login</button></p>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  pageWrapper: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--button-text)',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  mainArea: {
    flex: 1,
    padding: '1rem',
  },
  contentWrapper: {
    backgroundColor: 'var(--section-bg)',
    borderRadius: '8px',
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    boxShadow: '0 2px 8px var(--shadow-color)',
    color: 'var(--text-color)',
  },
  headerSection: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
    marginBottom: '1rem',
    gap: '1rem',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #D1FAE5',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    padding: '4px',
    cursor: 'pointer',
  },
  userInfo: {
    flex: 1,
    minWidth: '200px',
    textAlign: 'left',
  },
  userName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-color)',
  },
  userEmail: {
    color: 'var(--muted-text)',
  },
  quickStatsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '14px',
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  sectionBox: {
    backgroundColor: 'var(--card-bg)',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px var(--shadow-color)',
    color: 'var(--text-color)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-color)',
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#10B981',
  },
  chartContainer: {
    height: '200px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    padding: '4px 0',
    borderTop: `1px solid var(--border-color)`,
    color: 'var(--text-color)',
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    height: '8px',
    marginTop: '4px',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
    backgroundColor: '#10B981',
  },
  progressText: {
    textAlign: 'right',
    fontSize: '12px',
    marginTop: '4px',
    color: 'var(--muted-text)',
  },
  metricGroup: {
    marginBottom: '8px',
  },
  form: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-color)',
    marginBottom: '4px',
  },
  input: {
    padding: '8px',
    width: '100%',
    backgroundColor: 'var(--input-bg)',
    border: `1px solid var(--input-border)`,
    borderRadius: '4px',
    color: 'var(--text-color)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#10B981',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    color: '#333',
  },
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
  },
  actionButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  settingsSection: {
    marginTop: '2rem',
    padding: '1rem',
    borderTop: '1px solid var(--border-color)',
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '8px',
    marginTop: '8px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  linkButton: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '10px',
  },
};

export default ProfileSection;