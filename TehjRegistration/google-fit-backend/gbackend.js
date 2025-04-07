const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// ✅ Route: Daily fitness data (steps, calories, distance, move minutes)
app.post('/api/fit', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'Access token missing' });

  try {
    const now = Date.now();
    const oneDayAgo = now - 86400000;

    // Requesting daily fitness data from Google Fit
    const response = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        aggregateBy: [
          { dataTypeName: 'com.google.step_count.delta' },
          { dataTypeName: 'com.google.calories.expended' },
          { dataTypeName: 'com.google.distance.delta' },
          { dataTypeName: 'com.google.active_minutes' },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: oneDayAgo,
        endTimeMillis: now,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Sending the fitness data as response
    res.json(response.data);  // Send back the fitness data to the frontend
  } catch (error) {
    console.error('Google Fit API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Google Fit data' });
  }
});

// ✅ NEW Route: Weekly step data (for step chart)
app.post('/api/fit/weekly-steps', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'Access token missing' });

  try {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Requesting weekly step data from Google Fit
    const response = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        aggregateBy: [
          { dataTypeName: 'com.google.step_count.delta' }
        ],
        bucketByTime: { durationMillis: 86400000 }, // daily buckets
        startTimeMillis: oneWeekAgo,
        endTimeMillis: now,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send back the weekly step data as response
    res.json(response.data);
  } catch (error) {
    console.error('Google Fit Weekly API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch weekly step data' });
  }
});

app.listen(PORT, () => {
  console.log(`Google Fit Backend running on http://localhost:${PORT}`);
});
