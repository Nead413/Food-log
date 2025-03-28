import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './WorkoutsPage.css';

const WorkoutsPage = () => {
  const [userData, setUserData] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Preloaded workout data with embedded video links
  const workoutLibrary = useMemo(() => [
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
        "Push-ups - 10 reps",
        "Bodyweight Squats - 15 reps",
        "Plank - 30 seconds",
        "Repeat 3 times"
      ],
      video: "https://www.youtube.com/embed/30PqX2zvK88?si=j5ifuP5nPs-fuvBm" 
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
      ],
      video:"https://www.youtube.com/embed/ml6cT4AZdqI?si=pSLyxxNCRffO7gy3" 
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
      ],
      video:"https://www.youtube.com/embed/w98q46fhiO4?si=yHmvAyiNhrNc6yUG"
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
      ],
      video:"https://www.youtube.com/embed/47Dt93KB3T4?si=qq-RW7FlnxHHEJem"
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
      ],
      video:"https://www.youtube.com/embed/Nh4qa-Y1CIo?si=FmhBIjn2VrEAwcgL" 
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
      ],
      video:"https://www.youtube.com/embed/_gAzC5euqIA?si=cdSxPfXd2Dbr6Vp0"
    },

//Outdoor workouts
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
        "Burpees - 3 sets of 10"
      ],
      video: "https://www.youtube.com/embed/f5Viy_Aqf1I?si=vP_lx1Er_nwO7b_q" 
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
    ],
    video: "https://www.youtube.com/embed/DQBCdbV2Enc?si=aNXT17o8wWJXTKFF"
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
      "Savasana - 5 minutes",
    ],
    video: "https://www.youtube.com/embed/w98q46fhiO4?si=yHmvAyiNhrNc6yUG" 
  },
], []);
 

  // Load user data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('dietTrackerUserData');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
    setLoading(false);
  }, []);

  // Filter workouts based on user preferences
  useEffect(() => {
    if (!userData || loading) return;

    const preferences = { location: "Indoors", preferredTypes: ["Strength Training", "Cardio"] };

    let relevantWorkouts = workoutLibrary.filter(workout => 
      (workout.location === preferences.location || preferences.location === "Mixed") &&
      preferences.preferredTypes.includes(workout.type)
    );

    if (relevantWorkouts.length === 0) {
      relevantWorkouts = workoutLibrary.slice(0, 3);
    }

    setWorkouts(relevantWorkouts);
    setFilteredWorkouts(relevantWorkouts);
  }, [userData, loading, workoutLibrary]);

  // Filter handler
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setFilteredWorkouts(newFilter === 'all' ? workouts : workouts.filter(workout => workout.type === newFilter));
  };

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
      
      <section className="filter-section">
        <button className={filter === 'all' ? 'filter-button active' : 'filter-button'} onClick={() => handleFilterChange('all')}>
          All
        </button>
        {[...new Set(workouts.map(workout => workout.type))].map(type => (
          <button key={type} className={filter === type ? 'filter-button active' : 'filter-button'} onClick={() => handleFilterChange(type)}>
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
                  <ul>
                    {workout.exercises.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>
                {workout.video && (
                  <div className="workout-video">
                    <h4>Watch the Workout</h4>
                    <iframe width="100%" height="200" src={workout.video} title={workout.name} frameBorder="0" allowFullScreen></iframe>
                  </div>
                )}
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
