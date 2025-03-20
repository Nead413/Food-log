import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './WorkoutsPage.css';

const WorkoutsPage = () => {
  const [userData, setUserData] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Preloaded workout data - wrap in useMemo
  const workoutLibrary = useMemo(() => [
    // Home workouts
    {
      id: 1,
      name: "Beginner Bodyweight Circuit",
      type: "Bodyweight",
      location: "Home",
      duration: "15 minutes",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A simple circuit to get you started with fitness at home. No equipment required!",
      exercises: [
        "Jumping Jacks - 30 seconds",
        "Push-ups - 10 reps (on knees if needed)",
        "Bodyweight Squats - 15 reps",
        "Plank - 30 seconds",
        "Rest 60 seconds and repeat 3 times"
      ]
    },
    {
      id: 2,
      name: "Living Room HIIT",
      type: "HIIT",
      location: "Home",
      duration: "20 minutes",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "High-intensity interval training you can do with minimal space.",
      exercises: [
        "High knees - 30 seconds",
        "Mountain climbers - 30 seconds",
        "Burpees - 30 seconds",
        "Rest 30 seconds",
        "Repeat for 4 rounds"
      ]
    },
    {
      id: 3,
      name: "Apartment-Friendly Yoga Flow",
      type: "Yoga",
      location: "Home",
      duration: "25 minutes",
      level: "All levels",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A calming yoga flow perfect for small spaces.",
      exercises: [
        "Child's pose - 1 minute",
        "Cat-cow stretches - 1 minute",
        "Downward dog - 30 seconds",
        "Warrior I, II, III sequence - 30 seconds each",
        "Savasana - 2 minutes"
      ]
    },
    
    // Gym workouts
    {
      id: 4,
      name: "Beginner Strength Circuit",
      type: "Strength Training",
      location: "Gym",
      duration: "30 minutes",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A full-body strength workout for beginners using gym equipment.",
      exercises: [
        "Leg press - 3 sets of 10 reps",
        "Chest press machine - 3 sets of 10 reps",
        "Lat pulldown - 3 sets of 10 reps",
        "Seated row - 3 sets of 10 reps",
        "Plank - 3 sets of 30 seconds"
      ]
    },
    {
      id: 5,
      name: "Intermediate Hypertrophy Program",
      type: "Strength Training",
      location: "Gym",
      duration: "45 minutes",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A focused workout designed for muscle growth.",
      exercises: [
        "Barbell squats - 4 sets of 8-12 reps",
        "Dumbbell bench press - 4 sets of 8-12 reps",
        "Bent-over rows - 3 sets of 10 reps",
        "Overhead press - 3 sets of 10 reps",
        "Bicep curls - 3 sets of 12 reps"
      ]
    },
    {
      id: 6,
      name: "Cardio Mix",
      type: "Cardio",
      location: "Gym",
      duration: "35 minutes",
      level: "All levels",
      image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Varied cardio workout using different gym machines.",
      exercises: [
        "Treadmill - 10 minutes (moderate pace)",
        "Rowing machine - 5 minutes",
        "Stair climber - 5 minutes",
        "Exercise bike - 10 minutes",
        "Cool down walk - 5 minutes"
      ]
    },
    
    // Outdoor workouts
    {
      id: 7,
      name: "Park Interval Training",
      type: "HIIT",
      location: "Outdoors",
      duration: "25 minutes",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "A high-intensity workout using a local park's features.",
      exercises: [
        "Sprint intervals - 30 seconds sprint, 60 seconds walk x5",
        "Park bench step-ups - 2 sets of 15 each leg",
        "Park bench dips - 3 sets of 12",
        "Walking lunges - 2 sets of 20 steps",
        "Burpees - 3 sets of 10"
      ]
    },
    {
      id: 8,
      name: "Trail Running Session",
      type: "Cardio",
      location: "Outdoors",
      duration: "40 minutes",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Build endurance and enjoy nature with trail running.",
      exercises: [
        "5-minute warm-up walk/light jog",
        "25 minutes of trail running (moderate pace)",
        "Include 5 hill repeats if available",
        "5-minute cool down walk",
        "5 minutes stretching"
      ]
    },
    {
      id: 9,
      name: "Outdoor Yoga",
      type: "Yoga",
      location: "Outdoors",
      duration: "30 minutes",
      level: "All levels",
      image: "https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Connect with nature through outdoor yoga practice.",
      exercises: [
        "Sun salutations - 5 minutes",
        "Standing poses - 10 minutes",
        "Balance poses - 5 minutes",
        "Seated poses - 5 minutes",
        "Savasana - 5 minutes"
      ]
    },
  ], []);

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedData = localStorage.getItem('dietTrackerUserData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Filter workouts based on user preferences
  useEffect(() => {
    if (!userData || loading) return;

    // Ensure workoutPreferences exists
    const preferences = userData.workoutPreferences || {
      location: "Gym",
      preferredTypes: ["Strength Training", "Cardio"]
    };

    // Filter workouts based on location and type preferences
    let relevantWorkouts = workoutLibrary.filter(workout => {
      // Match by location
      const locationMatch = workout.location === preferences.location || preferences.location === "Mixed";
      
      // Match by at least one preferred workout type
      const typeMatch = preferences.preferredTypes.some(type => workout.type === type);
      
      return locationMatch && typeMatch;
    });

    // If no matches, provide some default workouts
    if (relevantWorkouts.length === 0) {
      relevantWorkouts = workoutLibrary.slice(0, 3); // Just show first 3 workouts as default
    }

    setWorkouts(relevantWorkouts);
    setFilteredWorkouts(relevantWorkouts);
  }, [userData, loading, workoutLibrary]); // Add workoutLibrary dependency

  // Filter handler
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    if (newFilter === 'all') {
      setFilteredWorkouts(workouts);
    } else {
      const filtered = workouts.filter(workout => workout.type === newFilter);
      setFilteredWorkouts(filtered);
    }
  };

  // Get unique workout types for filter buttons
  const workoutTypes = [...new Set(workouts.map(workout => workout.type))];

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workouts-container">
      <header className="workouts-header">
        <h1>Your Workouts</h1>
        <nav>
          <ul>
            <li><Link to="/homepage">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
      </header>
      
      <section className="workouts-intro">
        <h2>Personalized Workout Plan</h2>
        <p>
          Based on your preferences ({userData?.workoutPreferences?.frequency || "3-4 times per week"}, 
          {userData?.workoutPreferences?.location || "Gym"})
        </p>
      </section>
      
      <section className="filter-section">
        <button 
          className={filter === 'all' ? 'filter-button active' : 'filter-button'} 
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        {workoutTypes.map(type => (
          <button
            key={type}
            className={filter === type ? 'filter-button active' : 'filter-button'}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </section>
      
      <section className="workouts-grid">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <div key={workout.id} className="workout-card">
              <div className="workout-image" style={{ backgroundImage: `url(${workout.image})` }}>
                <span className="workout-level">{workout.level}</span>
              </div>
              <div className="workout-content">
                <h3>{workout.name}</h3>
                <div className="workout-meta">
                  <span>{workout.duration}</span>
                  <span>{workout.type}</span>
                  <span>{workout.location}</span>
                </div>
                <p>{workout.description}</p>
                <div className="workout-exercises">
                  <h4>Routine</h4>
                  <ol>
                    {workout.exercises.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ol>
                </div>
                <button className="start-workout-btn">Start Workout</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-workouts">
            <p>No matching workouts found. Try adjusting your preferences in your profile.</p>
            <Link to="/profile" className="profile-link">Update Preferences</Link>
          </div>
        )}
      </section>
      
      <section className="workout-tips">
        <h3>Workout Tips</h3>
        <ul>
          <li>Always warm up before starting your workout</li>
          <li>Stay hydrated throughout your session</li>
          <li>Focus on proper form rather than weight or speed</li>
          <li>Listen to your body and rest when needed</li>
        </ul>
      </section>
    </div>
  );
};

export default WorkoutsPage;
