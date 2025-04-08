import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationStep1 from './RegistrationStep1';
import RegistrationStep2 from './RegistrationStep2';
import Login from './Login';
import Homepage from './pages/Homepage';
import LandingPage from './pages/LandingPage';
import ProfileSection from './profile/ProfileSection';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import WorkoutsPage from './pages/WorkoutsPage';
import Tracker from './components/Tracker'; 
import NutritionTrackerPage from './pages/NutritionTrackerPage';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/step1" element={<RegistrationStep1 />} />
                    <Route path="/step2" element={<RegistrationStep2 />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<ProfileSection />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/workouts" element={<WorkoutsPage />} />
                    <Route path="/nutritiontracker" element={<NutritionTrackerPage />} />
                    <Route path="/tracker" element={<Tracker />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
