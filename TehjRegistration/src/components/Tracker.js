import React, { useEffect, useState } from 'react';
import CircularProgress from './CircularProgress';
import './Tracker.css';
import NavBar from '../components/NavBar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

function Tracker() {
  const [data, setData] = useState({
    calories: 0,
    steps: 0,
    heartPoints: 62,
    distance: 0,
    moveMinutes: 0,
  });

  const [weeklySteps, setWeeklySteps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('googleFitToken');
    if (!token) {
      alert('Google Fit token not found. Please sign in again.');
      return;
    }

    const fetchFitnessData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        });

        const result = await response.json();

        let steps = 0;
        let calories = 0;
        let distance = 0;
        let moveMinutes = 0;

        (result.bucket || []).forEach(bucket => {
          (bucket.dataset || []).forEach(dataset => {
            const points = dataset.point || [];
            points.forEach(point => {
              const type = point.dataTypeName;
              if (type?.includes('step_count')) {
                steps += point.value[0]?.intVal || 0;
              } else if (type?.includes('calories')) {
                calories += point.value[0]?.fpVal || 0;
              } else if (type?.includes('distance')) {
                distance += point.value[0]?.fpVal || 0;
              } else if (type?.includes('active_minutes')) {
                moveMinutes += point.value[0]?.intVal || 0;
              }
            });
          });
        });

        setData(prev => ({
          ...prev,
          steps,
          calories: Math.round(calories),
          distance: (distance / 1000).toFixed(2),
          moveMinutes,
        }));
      } catch (error) {
        console.error('❌ Error fetching fitness data:', error);
        alert('Failed to load fitness data.');
      }
    };

    const fetchWeeklySteps = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/fit/weekly-steps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        });

        const result = await response.json();

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const stepsByDay = result.bucket.map(bucket => {
          const date = new Date(parseInt(bucket.startTimeMillis));
          const day = dayNames[date.getDay()];
          const steps = bucket.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
          return { day, steps, date };
        });

        stepsByDay.sort((a, b) => a.date - b.date);
        const cleaned = stepsByDay.map(({ day, steps }) => ({ day, steps }));
        setWeeklySteps(cleaned);
      } catch (error) {
        console.error('❌ Error fetching weekly step data:', error);
      }
    };

    fetchFitnessData();
    fetchWeeklySteps();
  }, []);

  const goalSteps = 10000;
  const percentage = Math.min(100, Math.floor((data.steps / goalSteps) * 100));

  return (
    <>
      <NavBar />

      <div className="tracker-container">
        <div className="circular-wrapper">
          <CircularProgress percentage={percentage} steps={data.steps} />
        </div>

        <div className="tracker-grid">
          <div>
            <p className="tracker-label">Calories</p>
            <p className="tracker-value">{data.calories} Cal</p>
          </div>
          <div>
            <p className="tracker-label">Distance</p>
            <p className="tracker-value">{data.distance} km</p>
          </div>
          <div>
            <p className="tracker-label">Move Minutes</p>
            <p className="tracker-value">{data.moveMinutes} min</p>
          </div>
        </div>

        {/* ✅ Weekly Step Bar Chart */}
        <div className="weekly-chart" style={{ marginTop: '40px', overflowX: 'auto' }}>
          <h3>Weekly Step Activity</h3>
          <div style={{ width: '750px' }}>
            <BarChart
              width={750}
              height={350}
              data={weeklySteps}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barCategoryGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="steps" fill="#ff5722" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tracker;
