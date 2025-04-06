import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NavBar from '../components/NavBar'; // ✅ already imported

function Settings() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    theme: theme,
    notifications: {
      email: true,
      push: true,
      reminders: true,
    },
    privacy: {
      showProfile: true,
      showProgress: true,
    },
    units: {
      weight: 'lbs',
      height: 'ft',
    },
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (section, field, value) => {
    if (field === 'theme') {
      setTheme(value);
    }

    if (section) {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
        localStorage.setItem('userSettings', JSON.stringify(newSettings));
        return newSettings;
      });
    } else {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <>
      {/* ✅ NAV BAR ADDED HERE */}
      <NavBar />

      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 style={styles.title}>Settings</h1>
          <button style={styles.saveButton} onClick={handleSave}>
            <Save size={20} />
            Save Changes
          </button>
        </div>

        <div style={styles.content}>
          <section style={styles.section}>
            <h2>Appearance</h2>
            <div style={styles.setting}>
              <label>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange(null, 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>

          <section style={styles.section}>
            <h2>Notifications</h2>
            <div style={styles.setting}>
              <label>Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
              />
            </div>
            <div style={styles.setting}>
              <label>Push Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
              />
            </div>
            <div style={styles.setting}>
              <label>Daily Reminders</label>
              <input
                type="checkbox"
                checked={settings.notifications.reminders}
                onChange={(e) => handleChange('notifications', 'reminders', e.target.checked)}
              />
            </div>
          </section>

          <section style={styles.section}>
            <h2>Privacy</h2>
            <div style={styles.setting}>
              <label>Show Profile to Others</label>
              <input
                type="checkbox"
                checked={settings.privacy.showProfile}
                onChange={(e) => handleChange('privacy', 'showProfile', e.target.checked)}
              />
            </div>
            <div style={styles.setting}>
              <label>Share Progress</label>
              <input
                type="checkbox"
                checked={settings.privacy.showProgress}
                onChange={(e) => handleChange('privacy', 'showProgress', e.target.checked)}
              />
            </div>
          </section>

          <section style={styles.section}>
            <h2>Units</h2>
            <div style={styles.setting}>
              <label>Weight Unit</label>
              <select
                value={settings.units.weight}
                onChange={(e) => handleChange('units', 'weight', e.target.value)}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            <div style={styles.setting}>
              <label>Height Unit</label>
              <select
                value={settings.units.height}
                onChange={(e) => handleChange('units', 'height', e.target.value)}
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet/Inches (ft)</option>
              </select>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    color: 'var(--text-color)',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--button-text)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  section: {
    backgroundColor: 'var(--section-bg)',
    color: 'var(--text-color)',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px var(--shadow-color)',
  },
  setting: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid var(--border-color)`,
  },
};

export default Settings;
