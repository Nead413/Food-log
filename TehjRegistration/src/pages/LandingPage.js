import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import '../index.css';

const CLIENT_ID = '1062096731061-0vaoigu36cspe53bmh0hpt4hsf0l7rfm.apps.googleusercontent.com'; // Replace with your actual Client ID
const scopes = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read';

const LandingPage = () => {
  const navigate = useNavigate();

  // Initialize Google API client
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope:scopes ,
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  // Google Sign-In Handler
  const handleGoogleSignIn = () => {
    const auth = gapi.auth2.getAuthInstance();
    auth.signIn().then((googleUser) => {
      const token = googleUser.getAuthResponse().access_token;
      console.log('Google Fit Access Token:', token);
      localStorage.setItem('googleFitToken', token);
      navigate('/homepage');
    }).catch((error) => {
      console.error('Google Sign-In Error:', error);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to Healthy Habits</h1>
        <p style={styles.subtitle}>Start your journey to a healthier lifestyle today</p>
        <div style={styles.buttonGroup}>
          <button 
            style={styles.primaryButton}
            onClick={() => navigate('/step1')}
          >
            Get Started
          </button>
          <button 
            style={styles.secondaryButton}
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
          <button 
            style={styles.googleButton}
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </button>
        </div>
      </div>

      <div style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Healthy Habits?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <h3>Track Your Progress</h3>
            <p>Monitor your weight, nutrition, and fitness goals in one place</p>
          </div>
          <div style={styles.featureCard}>
            <h3>Smart Analytics</h3>
            <p>Get insights into your habits and make informed decisions</p>
          </div>
          <div style={styles.featureCard}>
            <h3>Personalized Goals</h3>
            <p>Set and achieve your personal health and fitness targets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
  },
  hero: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: 'var(--section-bg)',
    borderBottom: '1px solid var(--border-color)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: 'var(--text-color)',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: 'var(--muted-text)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: 'var(--text-color)',
    border: '2px solid var(--primary-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  googleButton: {
    padding: '12px 24px',
    backgroundColor: '#4285F4',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  features: {
    padding: '60px 20px',
    backgroundColor: 'var(--bg-color)',
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: '3rem',
    color: 'var(--text-color)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  featureCard: {
    backgroundColor: 'var(--card-bg)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px var(--shadow-color)',
    textAlign: 'center',
  },
};

export default LandingPage;
