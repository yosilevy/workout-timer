import React, { useState } from 'react';
import { Timer } from './components/Timer';
import TimeInput from './components/TimeInput';
import './App.css';

function App() {
  const [settings, setSettings] = useState({
    rounds: 3,
    workDuration: 60, // 1 minute
    restDuration: 30, // 30 seconds
  });

  const [showSettings, setShowSettings] = useState(true);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <div className="settings-container">
        <h1>Welcome !!!</h1>
        <h2>Workout Timer Settings</h2>
        <form onSubmit={handleSettingsSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="rounds">Number of Rounds:</label>
            <input
              type="number"
              id="rounds"
              min="1"
              value={settings.rounds}
              onChange={(e) => setSettings({ ...settings, rounds: parseInt(e.target.value) })}
            />
          </div>
          <TimeInput
            label="Work Duration"
            value={settings.workDuration}
            onChange={(seconds) => setSettings({ ...settings, workDuration: seconds })}
          />
          <TimeInput
            label="Rest Duration"
            value={settings.restDuration}
            onChange={(seconds) => setSettings({ ...settings, restDuration: seconds })}
          />
          <button type="submit" className="start-button">Start Workout</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <Timer
        rounds={settings.rounds}
        workDuration={settings.workDuration}
        restDuration={settings.restDuration}
      />
      <button 
        className="settings-button"
        onClick={() => setShowSettings(true)}
      >
        Settings
      </button>
    </div>
  );
}

export default App;
