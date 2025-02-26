import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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

const ProfileSection = () => {
  // Initial default data
  const defaultUserData = {
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    avatar: "/api/placeholder/150/150",
    stats: {
      daysTracked: 42,
      currentStreak: 14,
      avgCalories: 1850,
      avgProtein: 85,
      avgCarbs: 210,
      avgFat: 62,
    },
    goals: {
      calories: 2000,
      protein: 100,
      carbs: 225,
      fat: 65,
    },
    health: {
      weight: 165,
      targetWeight: 155,
      height: 68,
      activityLevel: "Moderate",
    },
    weightHistory: [
      { date: 'Jan', weight: 172 },
      { date: 'Feb', weight: 170 },
      { date: 'Mar', weight: 168 },
      { date: 'Apr', weight: 166 },
      { date: 'May', weight: 165 },
      { date: 'Jun', weight: 165 },
    ],
  };

  // State for user data with local storage persistence
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('dietTrackerUserData');
    return savedData ? JSON.parse(savedData) : defaultUserData;
  });

  // Save to local storage when userData changes
  useEffect(() => {
    localStorage.setItem('dietTrackerUserData', JSON.stringify(userData));
  }, [userData]);

  // States for edit modes
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);
  const [addingWeight, setAddingWeight] = useState(false);

  // States for form values
  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    email: userData.email,
  });
  const [healthForm, setHealthForm] = useState({ ...userData.health });
  const [goalsForm, setGoalsForm] = useState({ ...userData.goals });
  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: userData.health.weight,
  });

  // Calculate BMI
  const calculateBMI = () => {
    const heightInMeters = userData.health.height * 0.0254;
    const weightInKg = userData.health.weight * 0.453592;
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Calculate progress percentage towards target weight
  const calculateWeightProgress = () => {
    const startWeight = Math.max(...userData.weightHistory.map((entry) => entry.weight));
    const totalToLose = Math.abs(userData.health.targetWeight - startWeight);
    const lost = Math.abs(userData.health.weight - startWeight);
    return Math.min(100, Math.round((lost / totalToLose) * 100));
  };

  // Update profile information
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      name: profileForm.name,
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

  // --- RENDER FORMS ---
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
      {/* Optional Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Healthy Habits</h1>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => alert("Home clicked!")}>Home</button>
          <button style={styles.navButton} onClick={() => alert("Profile clicked!")}>Profile</button>
          <button style={styles.navButton} onClick={() => alert("Settings clicked!")}>Settings</button>
        </nav>
      </header>

      {/* Main Content Area */}
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
              <h2 style={styles.userName}>{userData.name}</h2>
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
                    <span>{userData.health.weight} lbs</span>
                  </div>
                  <div style={styles.row}>
                    <span>Target Weight</span>
                    <span>{userData.health.targetWeight} lbs</span>
                  </div>
                  <div style={styles.progressBarContainer}>
                    <div style={{ ...styles.progressBar, width: `${calculateWeightProgress()}%` }} />
                  </div>
                  <div style={styles.progressText}>{calculateWeightProgress()}% to goal</div>

                  <div style={styles.row}>
                    <span>Height</span>
                    <span>{Math.floor(userData.health.height / 12)}'{userData.health.height % 12}"</span>
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
        </div>
      </main>
    </div>
  );
};

// Inline styles
const styles = {
  pageWrapper: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#10B981',
    color: '#fff',
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
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
    color: '#333',
  },
  userEmail: {
    color: '#666',
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
    backgroundColor: '#F9F9F9',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
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
    color: '#333',
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
    borderTop: '1px solid #eee',
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
    color: '#666',
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
    color: '#444',
    marginBottom: '4px',
  },
  input: {
    padding: '8px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
};

export default ProfileSection;
